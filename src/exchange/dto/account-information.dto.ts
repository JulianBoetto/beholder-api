import { numberInString } from 'binance';

export interface SpotAssetBalance {
  asset: string;
  free: numberInString;
  locked: numberInString;
  fiatEstimate?: number;
}

export class SpotAssetBalanceDto {
  asset: string;
  free: number;
  locked: number;
  fiatEstimate: number ;

  constructor(spotAssetBalance: SpotAssetBalance) {
    this.asset = spotAssetBalance.asset;
    this.free = parseFloat(`${spotAssetBalance.free}`);
    this.locked = parseFloat(`${spotAssetBalance.locked}`);
    this.fiatEstimate = spotAssetBalance.fiatEstimate;
  }
}

export interface AccountInformation {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: SpotAssetBalance[];
  permissions: any[];
}

export class AccountInformationDto {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: SpotAssetBalanceDto[];
  permissions: any[];
  fiatEstimate?: string;

  constructor(accountInformation: AccountInformation) {
    delete this.makerCommission;
    delete this.takerCommission;
    delete this.buyerCommission;
    delete this.sellerCommission;
    delete this.canTrade;
    delete this.canWithdraw;
    delete this.canDeposit;
    delete this.updateTime;
    delete this.accountType;
    this.balances = accountInformation.balances.map(
      (balance) => new SpotAssetBalanceDto(balance),
    );
    delete this.permissions;
  }
}

export class BalanceDto {
  asset: string;
  available: string;
  onOrder: string;
  fiatEstimate: number;
  avg?: number;

  constructor(asset: string, available: string, onOrder: string, fiatEstimate: number) {
    this.asset = asset;
    this.available = available;
    this.onOrder = onOrder;
    this.fiatEstimate = fiatEstimate;
  }
}

export class BalancesDto {
  assets: { [key: string]: BalanceDto };
  fiatEstimate: string;

  constructor(assets: { [key: string]: BalanceDto }, fiatEstimate: string) {
    this.assets = assets;
    this.fiatEstimate = fiatEstimate;
  }
}
