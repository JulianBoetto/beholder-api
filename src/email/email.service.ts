import { Inject, Injectable } from '@nestjs/common';
import { Automation } from 'src/automations/entities/automation.entity';
import { User } from 'src/users/entities/user.entity';
import { Logger } from 'winston';

@Injectable()
export class EmailService {
  @Inject('winston') private logger: Logger;

  async send(settings: User, automation: Automation) {
    try {
      // await email(settings, `${automation.name} has fired! ${automation.conditions}`);
      if (automation.logs)
        this.logger.info(`Automation ${automation.id} E-mail sent!`);
      return { type: 'success', text: `E-mail sent from ${automation.name}!` };
    } catch (err) {
      this.logger.info(`Automation ${automation.id}: ${err}`);
      return {
        type: 'error',
        text: `E-mail can't sent from ${automation.name}!`,
      };
    }
  }
}
