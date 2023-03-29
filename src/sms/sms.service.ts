import { Inject, Injectable } from '@nestjs/common';
import { Automation } from 'src/automations/entities/automation.entity';
import { User } from 'src/users/entities/user.entity';
import { Logger } from 'winston';

@Injectable()
export class SmsService {
  @Inject('winston') private logger: Logger;

    async send(settings: User, automation: Automation) {
        try {
            // await sms(settings, `${automation.name} has fired!`);
            if (automation.logs) this.logger.info(`Automation ${automation.id}: SMS sent!`);
            return { type: "success", text: `SMS sent from ${automation.name}!` };
        } catch (err) {
            this.logger.info(`Automation ${automation.id}: ${err}`);
            return { type: "error", text: `SMS can't sent from ${automation.name}!` };
        }
    }
}
