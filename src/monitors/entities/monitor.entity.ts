export class Monitor {
  id: number;
  symbol: string;
  type: string;
  broadcastLabel?: string;
  interval?: string | undefined;
  indexes?: string;
  isActive: boolean;
  isSystemMon: boolean;
  logs: boolean;
  createdAt: Date;
  updatedAt: Date;
}
