import { Injectable } from '@nestjs/common';
import { indexKeys } from 'src/utils/indexes';
import { rsi } from 'technicalindicators';

@Injectable()
export class IndicatorsService {
  execCalc(indexName: string, ohlc: [], params: any[]) {
    switch (indexName) {
      //   case indexKeys.INSIDE_CANDLE:
      //     return insideCandle(ohlc, ...params);
      //   case indexKeys.ABANDONNED_BABY:
      //     return abandonedBaby(ohlc);
      //   case indexKeys.ADL:
      //     return ADL(ohlc);
      //   case indexKeys.ADX:
      //     return ADX(ohlc, ...params);
      //   case indexKeys.ATR:
      //     return ATR(ohlc, ...params);
      //   case indexKeys.AWESONE_OSCILLATIOR:
      //     return AO(ohlc, ...params);
      //   case indexKeys.BOLLINGER_BANDS:
      //     return bollingerBands(ohlc.close, ...params);
      //   case indexKeys.BEARISH_ENGULFING:
      //     return bearishEngulfing(ohlc);
      //   case indexKeys.BULLISH_ENGULFING:
      //     return bullishEngulfing(ohlc);
      //   case indexKeys.BEARISH_HARAMI:
      //     return bearishHarami(ohlc);
      //   case indexKeys.BULLISH_HARAMI:
      //     return bullishHarami(ohlc);
      //   case indexKeys.BEARISH_HARAMI_CROSS:
      //     return bearishHaramiCross(ohlc);
      //   case indexKeys.BULLISH_HARAMI_CROSS:
      //     return bullishHaramiCross(ohlc);
      //   case indexKeys.BEARISH_MARUBOZU:
      //     return bearishMarubozu(ohlc);
      //   case indexKeys.BULLISH_MARUBOZU:
      //     return bullishMarubozu(ohlc);
      //   case indexKeys.EVENING_DOJI_STAR:
      //     return eveningDojiStar(ohlc);
      //   case indexKeys.EVENING_STAR:
      //     return eveningStar(ohlc);
      //   case indexKeys.PIERCING_LINE:
      //     return piercingLine(ohlc);
      //   case indexKeys.BULLISH_SPINNING_TOP:
      //     return bullishSpinningTop(ohlc);
      //   case indexKeys.BEARISH_SPINNING_TOP:
      //     return bearishSpinningTop(ohlc);
      //   case indexKeys.MORNING_DOJI_STAR:
      //     return morningDojiStar(ohlc);
      //   case indexKeys.MORNING_STAR:
      //     return morningStar(ohlc);
      //   case indexKeys._3DBLACK_CROWS:
      //     return threeBlackCrows(ohlc);
      //   case indexKeys._3WHITE_SOLDIERS:
      //     return threeWhiteSoldiers(ohlc);
      //   case indexKeys.BEARISH_HAMMER:
      //     return bearishHammer(ohlc);
      //   case indexKeys.BULLISH_HAMMER:
      //     return bullishHammer(ohlc);
      //   case indexKeys.BEARISH_INVERTED_HAMMER:
      //     return bearishInvertedHammer(ohlc);
      //   case indexKeys.BULLISH_INVERTED_HAMMER:
      //     return bullishInvertedHammer(ohlc);
      //   case indexKeys.HAMMER:
      //     return hammer(ohlc);
      //   case indexKeys.HAMMER_UNCONFIRMED:
      //     return hammerUnconfirmed(ohlc);
      //   case indexKeys.HANGING_MAN:
      //     return hangingMan(ohlc);
      //   case indexKeys.HANGING_MAN_UNCONFIRMED:
      //     return hangingManUnconfirmed(ohlc);
      //   case indexKeys.SHOOTING_STAR:
      //     return shootingStar(ohlc);
      //   case indexKeys.SHOOTING_STAR_UNCONFIRMED:
      //     return shootingStarUnconfirmed(ohlc);
      //   case indexKeys.TWEEZER_TOP:
      //     return tweezerTop(ohlc);
      //   case indexKeys.TWEEZER_BOTTOM:
      //     return tweezerBottom(ohlc);
      //   case indexKeys.CCI:
      //     return CCI(ohlc, ...params);
      //   case indexKeys.DARK_CLOUD_COVER:
      //     return darkCloudCover(ohlc);
      //   case indexKeys.DOJI:
      //     return doji(ohlc);
      //   case indexKeys.DOWNSIDE_TASUKI_GAP:
      //     return downsideTasukiGap(ohlc);
      //   case indexKeys.DRAGONFLY_DOJI:
      //     return dragonflyDoji(ohlc);
      //   case indexKeys.EMA:
      //     return EMA(ohlc.close, ...params);
      //   case indexKeys.FORCE_INDEX:
      //     return FI(ohlc, ...params);
      //   case indexKeys.GRAVESTONE_DOJI:
      //     return gravestoneDoji(ohlc);
      //   case indexKeys.ICHIMOKU:
      //     return ichimoku(ohlc, ...params);
      //   case indexKeys.KST:
      //     return KST(ohlc.close, ...params);
      //   case indexKeys.MACD:
      //     return MACD(ohlc.close, ...params);
      //   case indexKeys.MFI:
      //     return MFI(ohlc, ...params);
      //   case indexKeys.OBV:
      //     return OBV(ohlc);
      //   case indexKeys.PSAR:
      //     return PSAR(ohlc, ...params);
      //   case indexKeys.ROC:
      //     return ROC(ohlc.close, ...params);
      case indexKeys.RSI:
        return this.RSI(ohlc, params[0]);
      //   case indexKeys.SMA:
      //     return this.SMA(ohlc.close, ...params);
      //   case indexKeys.STOCH:
      //     return this.Stochastic(ohlc, ...params);
      //   case indexKeys.STOCH_RSI:
      //     return this.StochRSI(ohlc.close, ...params);
      //   case indexKeys.TRIX:
      //     return this.TRIX(ohlc.close, ...params);
      //   case indexKeys.VOLUME_PROFILE:
      //     return this.VP(ohlc, ...params);
      //   case indexKeys.VWAP:
      //     return this.VWAP(ohlc);
      //   case indexKeys.WILLIAMS_R:
      //     return this.williamsR(ohlc, ...params);
      //   case indexKeys.WEMA:
      //     return this.WEMA(ohlc.close, ...params);
      //   case indexKeys.WMA:
      //     return this.WMA(ohlc.close, ...params);
      //   default:
      //     return false;
    }
  }

  private RSI(closes: [], period: number = 14) {
    let values: number[] = [];
    closes.forEach((close) => {
      values.push(parseFloat(close[4]));
    });
    if (values.length <= period) return { current: false, previous: false };

    const rsiResult: number[] = rsi({
      period,
      values,
    });
    return {
      current: rsiResult[rsiResult.length - 1],
      previous: rsiResult[rsiResult.length - 2],
    };
  }
}
