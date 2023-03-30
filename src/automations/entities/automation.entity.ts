export class Automation {
  id?: number;
  name: string;
  symbol: string;
  indexes: string;
  conditions: string;
  schedule?: string;
  isActive: boolean;
  action: any;
  grid: any;
  logs: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
