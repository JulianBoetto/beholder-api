import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Action } from 'src/action/entities/action.entity';
import { Automation } from 'src/automations/entities/automation.entity';
import { EmailService } from 'src/email/email.service';
import { Grid } from 'src/grid/entities/grid.entity';
import { OrdersService } from 'src/orders/orders.service';
import { SmsService } from 'src/sms/sms.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import actionsTypes from 'src/utils/types/actionsTypes';
import { Logger } from 'winston';

@Injectable()
export class BeholderService {
  @Inject('winston') private logger: Logger;
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
    private smsService: SmsService,
    private telegramService: TelegramService,
    private ordersService: OrdersService,
  ) {}

  private MEMORY: object = {};
  private BRAIN: object;
  private BRAIN_INDEX: any = [];
  private LOCK_MEMORY: boolean = false;
  private LOCK_BRAIN: object = {};
  private LOGS: boolean = process.env.BEHOLDER_LOGS === 'true';
  private INTERVAL: number = parseInt(process.env.AUTOMATION_INTERVAL) || 0;

  init(automations: any[]) {
    try {
      this.setLocked(
        automations.map((a: { id: number }) => a.id),
        true,
      );

      this.LOCK_MEMORY = true;

      this.BRAIN = {};
      this.BRAIN_INDEX = {};

      automations.map((auto: Automation) => {
        if (auto.isActive && !auto.schedule) this.updateBrain(auto);
      });
    } finally {
      this.setLocked(
        automations.map((a: { id: number }) => a.id),
        false,
      );
      this.LOCK_MEMORY = false;
      this.logger.info(`Beholder Brain has started!`);
    }
  }

  private setLocked(automationId: any, value: boolean) {
    if (Array.isArray(automationId))
      return automationId.map((id) => this.LOCK_BRAIN[id] === value);

    this.LOCK_BRAIN[automationId] = value;
  }

  private updateBrain(automation: Automation) {
    if (!automation.isActive || !automation.conditions) return;

    const actions: Action[] = automation.action
      ? automation.action.map((a: Action) => {
          // a = a.toJSON ? a.toJSON() : a;
          delete a.createdAt;
          delete a.updatedAt;
          // // delete a.orderTemplate;
          return a;
        })
      : [];

    const grids: Grid[] = automation.grid
      ? automation.grid.map((g: Grid) => {
          // g = g.toJSON ? g.toJSON() : g;
          delete g.createdAt;
          delete g.updatedAt;
          delete g.automationId;
          // GRID sin order template
          // if (g.orderTemplate) {
          //   delete g.orderTemplate.createdAt;
          //   delete g.orderTemplate.updateAt;
          // }
          return g;
        })
      : [];

    // if (automation.toJSON) automation = automation.toJSON();

    delete automation.createdAt;
    delete automation.updatedAt;

    automation.action = actions;
    automation.grid = grids;

    this.BRAIN[automation.id] = automation;
    automation.indexes
      .split(',')
      .map((ix: string) => this.updateBrainIndex(ix, automation.id));
  }

  private updateBrainIndex(index: string, automationId: number) {
    if (!this.BRAIN_INDEX[index]) this.BRAIN_INDEX[index] = [];
    this.BRAIN_INDEX[index].push(automationId);

    if (index.startsWith('*')) this.BRAIN_INDEX.hasWildCard = true;
  }

  getMemoryIndexes() {
    return Object.entries(this.flattenObject(this.MEMORY))
      .map((prop) => {
        if (prop[0].indexOf('previous') !== -1) return false;
        const propSplit = prop[0].split(':');
        return {
          symbol: propSplit[0],
          variable: propSplit[1].replace('.current', ''),
          eval: this.getEval(prop[0]),
          example: prop[1],
        };
      })
      .filter((ix) => ix)
      .sort((a: any, b: any) => {
        if (a.variable < b.variable) return -1;
        if (a.variable > b.variable) return 1;
        return 0;
      });
  }

  private flattenObject(ob: object) {
    let toReturn = {};

    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if (typeof ob[i] === 'object' && ob[i] !== null) {
        let flatObject = this.flattenObject(ob[i]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;
          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }

    return toReturn;
  }

  private getEval(prop) {
    if (prop.indexOf('.') === -1) return `MEMORY['${prop}']`;

    const propSplit = prop.split('.');
    const memKey = propSplit[0];
    const memProp = prop.replace(memKey, '');
    return `MEMORY['${memKey}']${memProp}`;
  }

  parseMemoryKey(symbol: string, index: string, interval = null) {
    const indexKey = interval ? `${index}_${interval}` : index;
    return `${symbol}:${indexKey}`;
  }

  async updateMemory(
    symbol: string,
    index: string,
    interval: string,
    value: number | object,
    executeAutomations = true,
  ) {
    if (this.LOCK_MEMORY) return [];

    const memoryKey = this.parseMemoryKey(symbol, index, interval);
    this.MEMORY[memoryKey] = value;

    if (this.LOGS)
      this.logger.info(
        `Beholder memory updated: ${memoryKey} => ${JSON.stringify(value)}`,
      );

    if (!executeAutomations) return [];

    return this.testAutomations(memoryKey);
  }

  private isLocked(automationId: string | any) {
    if (Array.isArray(automationId))
      return automationId.some((id) => this.LOCK_BRAIN[id] === true);

    return this.LOCK_BRAIN[automationId] === true;
  }

  async testAutomations(memoryKey: string) {
    // EX RSI_14_1m, tiene que tener todos los parametros
    const automations = this.findAutomations(memoryKey);
    if (
      !automations ||
      !automations.length ||
      this.isLocked(automations.map((a) => a.id))
    ) {
      if (this.LOGS)
        this.logger.info(
          `Beholder has no automations for memoryKey: ${memoryKey} or the brain is locked!`,
        );
      return [];
    }
    this.setLocked(
      automations.map((a) => a.id),
      true,
    );
    let results = [];
    try {
      const promises = automations.map(async (automation) => {
        let auto = automation;
        if (auto.symbol.startsWith('*')) {
          const symbol = memoryKey.split(':')[0];
          auto.indexes = auto.indexes.replaceAll(auto.symbol, symbol);
          auto.conditions = auto.conditions.replaceAll(auto.symbol, symbol);
          if (auto.actions) {
            auto.actions.forEach((action) => {
              if (action.orderTemplate) action.orderTemplate.symbol = symbol;
            });
          }
          auto.symbol = symbol;
        }
        return this.evalDecision(memoryKey, auto);
      });
      results = await Promise.all(promises);
      results = results.flat().filter((r) => r);
      if (!results && !results.length) return [];
      else return results;
    } finally {
      setTimeout(
        () => {
          this.setLocked(
            automations.map((a) => a.id),
            false,
          );
        },
        results && results.length ? this.INTERVAL : 0,
      );
    }
  }

  private findAutomations(memoryKey: string) {
    let ids = [];
    if (this.BRAIN_INDEX.hasWildCard) {
      const props = Object.entries(this.BRAIN_INDEX).filter((p) =>
        memoryKey.endsWith(p[0].replace('*', '')),
      );
      ids = props.map((p) => p[1]).flat();
    } else ids = this.BRAIN_INDEX[memoryKey];

    if (!ids) return [];
    return [...new Set(ids)].map((id) => this.BRAIN[id]);
  }

  getMemory(symbol: string, index: string, interval?: string) {
    if (symbol && index) {
      const indexKey = interval ? `${index}_${interval}` : index;
      const memoryKey = `${symbol}:${indexKey}`;

      const result = this.MEMORY[memoryKey];
      return typeof result === 'object' ? { ...result } : result;
    }
    return { ...this.MEMORY };
  }

  private async evalDecision(memoryKey: string, automation: Automation) {
    if (!automation) return false;

    try {
      const indexes = automation.indexes ? automation.indexes.split(',') : [];

      if (indexes.length) {
        const isChecked = indexes.every(
          (ix) => this.MEMORY[ix] !== null && this.MEMORY[ix] !== undefined,
        );
        if (!isChecked) return false;

        const invertedCondition = this.shouldntInvert(automation, memoryKey)
          ? ''
          : this.invertCondition(memoryKey, automation.conditions);
        const evalCondition =
          automation.conditions +
          (invertedCondition ? ` && ${invertedCondition}` : '');

        if (this.LOGS)
          this.logger.info(
            `Automation ${automation.id}: Beholder is trying to evaluate a condition ${evalCondition}\n at automation: ${automation.name}`,
          );

        // Compara la condición con los datos de la memoria del Beholder
        const isValid = evalCondition
          ? eval(evalCondition.replace(/MEMORY/g, 'this.MEMORY'))
          : true;

        // Solo si la condición es válida continua
        // if (!isValid) return false;
      }

      if (!automation.action || !automation.action.length) {
        if (this.LOGS || automation.logs)
          this.logger.info(
            `Automation ${automation.id}: No actions defined for automation ${automation.name}`,
          );
        return false;
      }

      if (
        (this.LOGS || automation.logs) &&
        ![actionsTypes.GRID, actionsTypes.TRAILING].includes(
          automation.action[0].type,
        )
      )
        this.logger.info(
          `Automation ${automation.id}: Beholder evaluated a condition at automation: ${automation.name}`,
        );

      const settings: User = await this.usersService.getSettings(
        this.usersService.setUserId(),
      );
      let results = [];

      for (let i = 0; i < automation.action.length; i++) {
        const action = automation.action[i];
        const result = await this.doAction(settings, action, automation);
        if (!result || result.type === 'error') break;

        results.push(result);
      }

      if (automation.logs && results && results.length && results[0])
        this.logger.info(
          `Automation ${automation.name} id: ${
            automation.id
          } has fired at ${new Date()}!\nResults: ${JSON.stringify(results)}`,
        );

      return results.flat();
    } catch (err) {
      if (automation.logs)
        this.logger.info(`Automation ${automation.id}: ${err}`);
      return {
        type: 'error',
        text: `Error at evalDecision for '${automation.name}': ${err.message}`,
      };
    }
  }

  private shouldntInvert(automation: Automation, memoryKey: string) {
    //return false;//descomente para desabilitar 'double check' (teste de condição invertida)
    return (
      ['GRID', 'TRAILING'].includes(automation.action[0].type) ||
      automation.schedule ||
      memoryKey.indexOf(':LAST_ORDER') !== -1 ||
      memoryKey.indexOf(':LAST_CANDLE') !== -1 ||
      memoryKey.indexOf(':PREVIOUS_CANDLE') !== -1
    );
  }

  private invertCondition(memoryKey: string, conditions: string) {
    const conds = conditions.split(' && ');
    const condToInvert = conds.find(
      (c) => c.indexOf(memoryKey) !== -1 && c.indexOf('current') !== -1,
    );
    if (!condToInvert) return false;

    if (condToInvert.indexOf('>=') !== -1)
      return condToInvert.replace('>=', '<').replace(/current/g, 'previous');
    if (condToInvert.indexOf('<=') !== -1)
      return condToInvert.replace('<=', '>').replace(/current/g, 'previous');
    if (condToInvert.indexOf('>') !== -1)
      return condToInvert.replace('>', '<').replace(/current/g, 'previous');
    if (condToInvert.indexOf('<') !== -1)
      return condToInvert.replace('<', '>').replace(/current/g, 'previous');
    if (condToInvert.indexOf('!') !== -1)
      return condToInvert.replace('!', '=').replace(/current/g, 'previous');
    if (condToInvert.indexOf('==') !== -1)
      return condToInvert.replace('==', '!==').replace(/current/g, 'previous');
    return false;
  }

  private doAction(settings: User, action: Action, automation: Automation) {
    try {
      switch (action.type) {
        case actionsTypes.ORDER:
          return this.ordersService.placeOrder(settings, automation, action);
        // case actionsRepository.actionsTypes.TRAILING: return trailingEval(settings, automation, action);
        case actionsTypes.ALERT_EMAIL:
          return this.emailService.send(settings, automation);
        case actionsTypes.ALERT_SMS:
          return this.smsService.send(settings, automation);
        case actionsTypes.ALERT_TELEGRAM:
          return this.telegramService.send(settings, automation);
        // case actionsRepository.actionsTypes.WITHDRAW: return withdrawCrypto(settings, automation, action);
        // case actionsRepository.actionsTypes.GRID: return gridEval(settings, automation);
        default:
          return false;
      }
    } catch (err) {
      if (automation.logs) {
        this.logger.info(
          `Automation ${automation.id}: ${automation.name}:${action.type}`,
        );
        this.logger.info(`Automation ${automation.id}: ${err}`);
      }
      return {
        type: 'error',
        text: `Error at ${automation.name}: ${err.message}`,
      };
    }
  }
}
