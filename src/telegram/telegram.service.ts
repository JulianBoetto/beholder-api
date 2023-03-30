import { Inject, Injectable } from '@nestjs/common';
import { Automation } from '../automations/entities/automation.entity';
import { User } from '../users/entities/user.entity';
import { Logger } from 'winston';

@Injectable()
export class TelegramService {
  @Inject('winston') private logger: Logger;
    
  async send(settings: User, automation: Automation) {
    try {
        // await telegram(settings, `${automation.name} has fired!`);
        if (automation.logs) this.logger.info(`Automation ${automation.id}: Telegram sent!`);
        return { type: "success", text: `Telegram sent from ${automation.name}!` };
    } catch (err) {
        this.logger.info(`Automation ${automation.id}: ${err}`)
        return { type: "error", text: `Telegram can't sent from ${automation.name}!` };
    }
}
}
