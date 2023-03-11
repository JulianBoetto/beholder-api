import { Inject, Injectable } from '@nestjs/common';
import { CreateAutomationDto } from 'src/automations/dto/create-automation.dto';
import { Logger } from 'winston';

@Injectable()
export class BeholderService {
  @Inject('winston') private logger: Logger

  private MEMORY: object = {};
  private BRAIN: object;
  private BRAIN_INDEX: any;
  private LOCK_MEMORY: boolean = false;
  private LOCK_BRAIN: object = {};
  private LOGS: boolean = process.env.BEHOLDER_LOGS === "true";
  private INTERVAL: number = parseInt(process.env.AUTOMATION_INTERVAL) || 0;

  init(automations: any[] | any) {
    try {
      this.setLocked(automations.map((a: { id: number; }) => a.id), true);

      this.LOCK_MEMORY = true;

      this.BRAIN = {};
      this.BRAIN_INDEX = {};

      automations.map((auto: { isActive: boolean; schedule: string; }) => {
        if (auto.isActive && !auto.schedule)
          this.updateBrain(auto)
      });
    } finally {
      this.setLocked(automations.map((a: { id: number; }) => a.id), false);
      this.LOCK_MEMORY = false;
      this.logger.info(`Beholder Brain has started!`);
    }
  }

  private setLocked(automationId: number, value: boolean) {
    if (Array.isArray(automationId))
      return automationId.map(id => this.LOCK_BRAIN[id] === value);

    this.LOCK_BRAIN[automationId] = value;
  }

  private updateBrain(automation: any) {
    if (!automation.isActive || !automation.conditions) return;

    const actions = automation.actions ? automation.actions.map(a => {
      a = a.toJSON ? a.toJSON() : a;
      delete a.createdAt;
      delete a.updatedAt;
      // delete a.orderTemplate;
      return a;
    }) : [];

    const grids = automation.grids ? automation.grids.map(g => {
      g = g.toJSON ? g.toJSON() : g;
      delete g.createdAt;
      delete g.updatedAt;
      delete g.automationId;

      if (g.orderTemplate) {
        delete g.orderTemplate.createdAt;
        delete g.orderTemplate.updateAt;
      }

      return g;
    }) : [];

    if (automation.toJSON)
      automation = automation.toJSON();

    delete automation.createdAt;
    delete automation.updatedAt;

    automation.actions = actions;
    automation.grids = grids;

    this.BRAIN[automation.id] = automation;
    automation.indexes.split(",").map((ix: string) => this.updateBrainIndex(ix, automation.id));
  }

  private updateBrainIndex(index: string, automationId: number) {
    if (!this.BRAIN_INDEX[index]) this.BRAIN_INDEX[index] = [];
    this.BRAIN_INDEX[index].push(automationId);

    if (index.startsWith("*")) this.BRAIN_INDEX.hasWildCard = true;
  }

  getMemoryIndexes() {
    return Object.entries(this.flattenObject(this.MEMORY)).map(prop => {
      if (prop[0].indexOf("previous") !== -1) return false;
      const propSplit = prop[0].split(":");
      return {
        symbol: propSplit[0],
        variable: propSplit[1].replace(".current", ""),
        eval: this.getEval(prop[0]),
        example: prop[1]
      }
    })
      .filter(ix => ix)
    .sort((a: any, b: any) => {
      if (a.variable < b.variable) return -1;
      if (a.variable > b.variable) return 1;
      return 0;
    })
  }

  private flattenObject(ob: object) {
    let toReturn = {};

    for (let i in ob) {
      if (!ob.hasOwnProperty(i)) continue;

      if ((typeof ob[i]) === "object" && ob[i] !== null) {
        let flatObject = this.flattenObject(ob[i]);
        for (let x in flatObject) {
          if (!flatObject.hasOwnProperty(x)) continue;
          toReturn[i + "." + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }

    return toReturn;
  }

  private getEval(prop) {
    if (prop.indexOf(".") === -1) return `MEMORY['${prop}']`;

    const propSplit = prop.split(".");
    const memKey = propSplit[0];
    const memProp = prop.replace(memKey, "");
    return `MEMORY['${memKey}']${memProp}`;
  }
}
