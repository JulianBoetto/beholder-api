import { Injectable } from '@nestjs/common';
import { indexKeys } from 'src/utils/indexes';
import { strToNumber } from 'src/utils/types/formatedKlines';
import * as technicalindicators from 'technicalindicators';

@Injectable()
export class IndicatorsService {
  execCalc(indexName: string, ohlc: [], params: any[]) {
    switch (indexName) {
      // case indexKeys._3DBLACK_CROWS: return threeBlackCrows(ohlc);
      //   case indexKeys._3WHITE_SOLDIERS: return threeWhiteSoldiers(ohlc);
      //   case indexKeys.ABANDONNED_BABY: return abandonedBaby(ohlc);
      //   case indexKeys.ADL: return ADL(ohlc);
      //   case indexKeys.ADX: return ADX(ohlc, params[0]);
      //   case indexKeys.ATR: return ATR(ohlc, params[0]);
      //   case indexKeys.AWESONE_OSCILLATIOR: return AO(ohlc, params[0]);
      //   case indexKeys.BEARISH_ENGULFING: return bearishEngulfing(ohlc);
      //   case indexKeys.BEARISH_HARAMI: return bearishHarami(ohlc);
      //   case indexKeys.BEARISH_HARAMI_CROSS: return bearishHaramiCross(ohlc);
      //   case indexKeys.BEARISH_INVERTED_HAMMER: return bearishInvertedHammer(ohlc);
      //   case indexKeys.BEARISH_MARUBOZU: return bearishMarubozu(ohlc);
      //   case indexKeys.BEARISH_SPINNING_TOP: return bearishSpinningTop(ohlc);
      //   case indexKeys.BOLLINGER_BANDS: return bollingerBands(ohlc.close, params[0]);
      //   case indexKeys.BULLISH_ENGULFING: return bullishEngulfing(ohlc);
      //   case indexKeys.BULLISH_HARAMI: return bullishHarami(ohlc);
      //   case indexKeys.BULLISH_HARAMI_CROSS: return bullishHaramiCross(ohlc);
      //   case indexKeys.BULLISH_MARUBOZU: return bullishMarubozu(ohlc);
      //   case indexKeys.BULLISH_SPINNING_TOP: return bullishSpinningTop(ohlc);
      //   case indexKeys.BEARISH_HAMMER: return bearishHammer(ohlc);
      //   case indexKeys.BULLISH_HAMMER: return bullishHammer(ohlc);
      //   case indexKeys.BULLISH_INVERTED_HAMMER: return bullishInvertedHammer(ohlc);
      //   case indexKeys.CCI: return CCI(ohlc, params[0]);
      //   case indexKeys.DARK_CLOUD_COVER: return darkCloudCover(ohlc);
      //   case indexKeys.DOJI: return doji(ohlc);
      //   case indexKeys.DOWNSIDE_TASUKI_GAP: return downsideTasukiGap(ohlc);
      //   case indexKeys.DRAGONFLY_DOJI: return dragonflyDoji(ohlc);
      //   case indexKeys.EMA: return EMA(ohlc.close, params[0]);
      //   case indexKeys.EVENING_DOJI_STAR: return eveningDojiStar(ohlc);
      //   case indexKeys.EVENING_STAR: return eveningStar(ohlc);
      //   case indexKeys.FORCE_INDEX: return FI(ohlc, params[0]);
      //   case indexKeys.GRAVESTONE_DOJI: return gravestoneDoji(ohlc);
      //   case indexKeys.HAMMER: return hammer(ohlc);
      //   case indexKeys.HAMMER_UNCONFIRMED: return hammerUnconfirmed(ohlc);
      //   case indexKeys.HANGING_MAN: return hangingMan(ohlc);
      //   case indexKeys.HANGING_MAN_UNCONFIRMED: return hangingManUnconfirmed(ohlc);
      //   case indexKeys.ICHIMOKU: return ichimoku(ohlc, params[0]);
      //   case indexKeys.INSIDE_CANDLE: return insideCandle(ohlc, params[0]);
      case indexKeys.KST:
        return this.KST(ohlc, params[0]);
      //   case indexKeys.MACD: return MACD(ohlc.close, params[0]);
      //   case indexKeys.MFI: return MFI(ohlc, params[0]);
      //   case indexKeys.MORNING_DOJI_STAR: return morningDojiStar(ohlc);
      //   case indexKeys.MORNING_STAR: return morningStar(ohlc);
      //   case indexKeys.OBV: return OBV(ohlc);
      //   case indexKeys.PIERCING_LINE: return piercingLine(ohlc);
      //   case indexKeys.PSAR: return PSAR(ohlc, params[0]);
      //   case indexKeys.ROC: return ROC(ohlc.close, params[0]);
      case indexKeys.RSI:
        return this.RSI(ohlc, params[0]);
      case indexKeys.SMA:
        return this.SMA(ohlc, params[0]);
      // case indexKeys.STOCH: return Stochastic(ohlc, params[0]);
      // case indexKeys.STOCH_RSI: return StochRSI(ohlc.close, params[0]);
      // case indexKeys.SHOOTING_STAR: return shootingStar(ohlc);
      // case indexKeys.SHOOTING_STAR_UNCONFIRMED: return shootingStarUnconfirmed(ohlc);
      // case indexKeys.TRIX: return TRIX(ohlc.close, params[0]);
      // case indexKeys.TWEEZER_TOP: return tweezerTop(ohlc);
      // case indexKeys.TWEEZER_BOTTOM: return tweezerBottom(ohlc);
      // case indexKeys.VOLUME_PROFILE: return VP(ohlc, params[0]);
      // case indexKeys.VWAP: return VWAP(ohlc);
      // case indexKeys.WEMA: return WEMA(ohlc.close, params[0]);
      // case indexKeys.WILLIAMS_R: return williamsR(ohlc, params[0]);
      // case indexKeys.WMA: return WMA(ohlc.close, params[0]);
      // default: return false;
    }
  }

  private sortCloses(closes: []) {
    let values: number[] = [];
    closes.forEach((close) => {
      values.push(strToNumber(close[4]));
    });
    return values;
  }
  private KST(
    closes: [],
    ROCPer1: number = 10,
    ROCPer2: number = 15,
    ROCPer3: number = 20,
    ROCPer4: number = 30,
    SMAROCPer1: number = 10,
    SMAROCPer2: number = 10,
    SMAROCPer3: number = 10,
    SMAROCPer4: number = 15,
    signalPeriod: number = 3,
  ) {
    if (
      [
        ROCPer1,
        ROCPer2,
        ROCPer3,
        ROCPer4,
        SMAROCPer1,
        SMAROCPer3,
        SMAROCPer4,
      ].some((p) => p >= closes.length)
    )
      return {
        calc: { current: false, previous: false },
        paramsDetail: [
          `ROCPer1_${ROCPer1}`,
          `ROCPer2_${ROCPer2}`,
          `ROCPer3_${ROCPer3}`,
          `ROCPer4_${ROCPer4}`,
          `SMAROCPer1_${SMAROCPer1}`,
          `SMAROCPer2_${SMAROCPer2}`,
          `SMAROCPer3_${SMAROCPer3}`,
          `SMAROCPer4_${SMAROCPer4}`,
          `signalPeriod_${signalPeriod}`,
        ],
      };

    const kstResult = technicalindicators.kst({
      values: this.sortCloses(closes),
      ROCPer1,
      ROCPer2,
      ROCPer3,
      ROCPer4,
      SMAROCPer1,
      SMAROCPer2,
      SMAROCPer3,
      SMAROCPer4,
      signalPeriod,
    });
    return {
      calc: {
        current: kstResult[kstResult.length - 1],
        previous: kstResult[kstResult.length - 2],
      },
      paramsDetail: [
        `ROCPer1_${ROCPer1}`,
        `ROCPer2_${ROCPer2}`,
        `ROCPer3_${ROCPer3}`,
        `ROCPer4_${ROCPer4}`,
        `SMAROCPer1_${SMAROCPer1}`,
        `SMAROCPer2_${SMAROCPer2}`,
        `SMAROCPer3_${SMAROCPer3}`,
        `SMAROCPer4_${SMAROCPer4}`,
        `signalPeriod_${signalPeriod}`,
      ],
    };
  }

  private RSI(closes: [], period: number = 14) {
    const values = this.sortCloses(closes);

    if (values.length <= period)
      return {
        calc: { current: false, previous: false },
        paramsDetail: [`period_${period}`],
      };

    const rsiResult: number[] = technicalindicators.rsi({
      period,
      values,
    });
    return {
      calc: {
        current: rsiResult[rsiResult.length - 1],
        previous: rsiResult[rsiResult.length - 2],
      },
      paramsDetail: [`period_${period}`],
    };
  }

  private SMA(closes: [], period: number = 10) {
    if (closes.length <= period)
      return {
        calc: { current: false, previous: false },
        paramsDetail: [`period_${period}`],
      };

    const smaResult = technicalindicators.sma({
      values: this.sortCloses(closes),
      period,
    });
    return {
      calc: {
        current: parseFloat(smaResult[smaResult.length - 1].toFixed(3)),
        previous: parseFloat(smaResult[smaResult.length - 2].toFixed(3)),
      },
      paramsDetail: [`period_${period}`],
    };
  }
}
