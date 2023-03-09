import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { decryptData } from 'src/utils/encrypt';

@Injectable()
export class SettingsService {
  constructor(
    private readonly usersService: UsersService
  ) { }

  private settingsCache: any = [];

  async getSettingsDecrypted(id: number) {
    let settings = this.settingsCache[id];

    if (!settings) {
        settings = await this.usersService.getSettings(id);
        settings.secretKey = await decryptData(settings.secretKey)
        this.settingsCache[id] = settings;
    }

    return settings;
  }
}
