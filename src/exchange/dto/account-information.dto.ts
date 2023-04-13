import { numberInString } from 'binance';

export interface SpotAssetBalance {
  asset: string;
  free: numberInString;
  locked: numberInString;
}

export class SpotAssetBalanceDto {
    asset: string;
    free: number;
    locked: number;
    fiatEstimate?: number;

  constructor(spotAssetBalance: SpotAssetBalance) {
    this.asset = spotAssetBalance.asset;
    this.free = parseFloat(`${spotAssetBalance.free}`);
    this.locked = parseFloat(`${spotAssetBalance.locked}`);
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
    this.makerCommission = accountInformation.makerCommission;
    this.takerCommission = accountInformation.takerCommission;
    this.buyerCommission = accountInformation.buyerCommission;
    this.sellerCommission = accountInformation.sellerCommission;
    this.canTrade = accountInformation.canTrade;
    this.canWithdraw = accountInformation.canWithdraw;
    this.canDeposit = accountInformation.canDeposit;
    this.updateTime = accountInformation.updateTime;
    this.accountType = accountInformation.accountType;
    this.balances = accountInformation.balances.map(
      (balance) => new SpotAssetBalanceDto(balance),
    );
    this.permissions = accountInformation.permissions;
  }
}
