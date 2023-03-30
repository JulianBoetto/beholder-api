export class Symbol {
  symbol: string;
  basePrecision: number;
  quotePrecision: number;
  base?: string;
  quote?: string;
  stepSize?: string;
  tickSize?: string;
  minNotional: string;
  minLotSize: string;
  isFavorite: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
