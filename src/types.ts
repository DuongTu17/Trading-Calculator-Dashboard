export type TradingCategory = 'selector' | 'vn' | 'crypto';

export interface VnPositionSizeInput {
  capital: number;
  riskPercent: number;
  entryPrice: number;
  stopLossPrice: number;
}

export interface VnPositionSizeResult {
  maxRiskAmount: number;
  riskPerShare: number;
  riskPercentPerShare: number;
  lotCount: number;
  shareCount: number;
  totalInvestment: number;
  actualRiskAmount: number;
  capitalUtilizationPercent: number;
  maxAffordableShares: number;
  isCappedByCapital: boolean;
}

export interface VnBreakEvenInput {
  buyPrice: number;
  quantity: number;
  buyFeeRate: number; // % e.g. 0.1
  sellFeeRate: number; // % e.g. 0.1
  taxRate: number; // % e.g. 0.1
}

export interface VnBreakEvenResult {
  breakEvenPrice: number;
  minGainAmount: number;
  minGainPercent: number;
  totalBuyAmount: number;
  buyFee: number;
  totalSellAmountAtBreakEven: number;
  sellFee: number;
  taxAmount: number;
  totalCostAndTax: number;
}

export interface DcaPurchase {
  id: string;
  price: number;
  quantity: number;
}

export interface VnDcaResult {
  totalQuantity: number;
  totalCost: number;
  averagePrice: number;
  currentValue: number;
  currentPnlAmount: number;
  currentPnlPercent: number;
  percentNeededToBreakEven: number;
}

export interface RiskRewardInput {
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  isShort?: boolean;
}

export interface RiskRewardResult {
  riskAmount: number;
  rewardAmount: number;
  riskPercent: number;
  rewardPercent: number;
  ratio: number;
  rating: 'optimal' | 'acceptable' | 'high_risk';
  ratingLabel: string;
  ratingDescription: string;
}

export type CryptoDirection = 'long' | 'short';
export type MarginMode = 'isolated' | 'cross';

export interface CryptoLiquidationInput {
  direction: CryptoDirection;
  entryPrice: number;
  leverage: number;
  margin: number;
  marginMode: MarginMode;
  extraBalance: number;
  mmrRate: number; // e.g. 0.4%
}

export interface CryptoLiquidationResult {
  liquidationPrice: number;
  bankruptcyPrice: number;
  distancePrice: number;
  distancePercent: number;
  positionSizeCoins: number;
  notionalValueUsdt: number;
  riskLevel: 'critical' | 'high' | 'moderate' | 'safe';
  riskLabel: string;
  riskDescription: string;
}

export interface CryptoPositionSizeInput {
  accountCapital: number;
  riskType: 'percent' | 'fixed';
  riskValue: number; // % or $
  entryPrice: number;
  stopLossPrice: number;
  customLeverage?: number;
}

export interface CryptoPositionSizeResult {
  riskAmountUsdt: number;
  riskPercent: number;
  priceDistance: number;
  priceDistancePercent: number;
  positionSizeUnits: number;
  notionalValueUsdt: number;
  recommendedLeverage: number;
  requiredMarginAtLeverage: number;
  forexStandardLots: number;
}

export interface FuturesFeeInput {
  margin: number;
  leverage: number;
  orderType: 'taker' | 'maker' | 'custom';
  feeRate: number; // %
  fundingRate: number; // % e.g. 0.01%
  fundingPeriods: number; // number of 8h sessions
}

export interface FuturesFeeResult {
  notionalValue: number;
  openFee: number;
  closeFee: number;
  roundTripTradingFee: number;
  fundingFeePerCycle: number;
  totalFundingFee: number;
  totalAllFees: number;
  feeOnMarginPercent: number;
}

export interface CryptoPnlInput {
  direction: CryptoDirection;
  margin: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  p2pRate: number; // VND per USDT
  openFeeType?: 'taker' | 'maker';
  closeFeeType?: 'taker' | 'maker';
  customFeeRate?: number;
}

export interface CryptoPnlResult {
  priceChangePercent: number;
  roePercent: number;
  grossPnlUsdt: number;
  openFeeUsdt: number;
  closeFeeUsdt: number;
  totalFeeUsdt: number;
  netPnlUsdt: number;
  netRoePercent: number;
  netPnlVnd: number;
  totalReturnUsdt: number;
  totalReturnVnd: number;
  isProfit: boolean;
  breakevenExitPrice: number;
  // Legacy / fallback alias
  pnlUsdt: number;
  pnlVnd: number;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  category: 'vn' | 'crypto';
  toolName: string;
  summary: string;
  detail: string;
  badgeType: 'profit' | 'loss' | 'neutral';
}

export interface KellyCriterionInput {
  winRatePercent: number; // e.g. 55%
  riskRewardRatio: number; // e.g. 2.0 (1:2)
  accountCapital: number;
  fractionType?: 'full' | 'half' | 'quarter';
}

export interface KellyCriterionResult {
  fullKellyPercent: number;
  recommendedKellyPercent: number;
  recommendedBetAmount: number;
  isNegativeEdge: boolean;
  isDangerous: boolean;
  statusBadge: 'optimal' | 'warning' | 'negative';
  verdictLabel: string;
  verdictDescription: string;
  fractionalKellyPercent: number;
  recommendedRiskAmount: number;
  isWarning: boolean;
  warningMessage: string;
  advice: string;
  expectedValuePerTradePercent: number;
}

export interface SlippageImpactInput {
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  slippagePercent: number; // e.g. 0.1%
  spreadPercent: number; // e.g. 0.05%
  isShort?: boolean;
}

export interface SlippageImpactResult {
  nominalRatio: number;
  effectiveEntryPrice: number;
  effectiveStopLoss: number;
  effectiveTakeProfit: number;
  effectiveRatio: number;
  ratioErosionPercent: number;
  slippageCostPerUnit: number;
  totalHiddenCostPercent: number;
}

export interface FundingMultiPeriodInput {
  margin: number;
  leverage: number;
  fundingRate: number; // % per 8h e.g. 0.01%
  direction: CryptoDirection;
  p2pRate?: number;
}

export interface FundingMultiPeriodResult {
  notionalValue: number;
  ratePerCyclePercent: number;
  fee8h: number; // 1 cycle
  fee8hVnd: number;
  fee24h: number; // 3 cycles
  fee24hVnd: number;
  fee7d: number; // 21 cycles
  fee7dVnd: number;
  annualizedRatePercent: number;
  actionType: 'pay' | 'receive';
  actionExplanation: string;
}

export interface CompoundGrowthInput {
  initialCapital: number;
  gainPerTradePercent: number;
  numberOfTrades: number;
  reinvestPercent: number; // 100% compound or partial
}

export interface CompoundGrowthResult {
  finalCapital: number;
  totalProfit: number;
  growthMultiplier: number;
  totalGainPercent: number;
}

export interface TradePlanExportData {
  pair: string;
  marketType: 'crypto' | 'vn_stock';
  direction: 'long' | 'short';
  leverage?: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  liquidationPrice?: number;
  riskRewardRatio: number;
  positionSize: string;
  riskAmount: string;
  p2pProfitEstimateVnd?: string;
  watermark: string;
}
