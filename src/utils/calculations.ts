import {
  VnPositionSizeInput,
  VnPositionSizeResult,
  VnBreakEvenInput,
  VnBreakEvenResult,
  DcaPurchase,
  VnDcaResult,
  RiskRewardInput,
  RiskRewardResult,
  CryptoLiquidationInput,
  CryptoLiquidationResult,
  CryptoPositionSizeInput,
  CryptoPositionSizeResult,
  FuturesFeeInput,
  FuturesFeeResult,
  CryptoPnlInput,
  CryptoPnlResult,
} from '../types';

/**
 * 1. VN Stock Position Size (Bội số lô 100 cổ phiếu)
 */
export function calculateVnPositionSize(input: VnPositionSizeInput): VnPositionSizeResult {
  const { capital, riskPercent, entryPrice, stopLossPrice } = input;
  
  if (capital <= 0 || entryPrice <= 0 || stopLossPrice <= 0 || riskPercent <= 0) {
    return {
      maxRiskAmount: 0,
      riskPerShare: 0,
      riskPercentPerShare: 0,
      lotCount: 0,
      shareCount: 0,
      totalInvestment: 0,
      actualRiskAmount: 0,
      capitalUtilizationPercent: 0,
      maxAffordableShares: 0,
      isCappedByCapital: false,
    };
  }

  const maxRiskAmount = capital * (riskPercent / 100);
  const riskPerShare = Math.max(0, entryPrice - stopLossPrice);
  const riskPercentPerShare = entryPrice > 0 ? (riskPerShare / entryPrice) * 100 : 0;

  if (riskPerShare <= 0) {
    return {
      maxRiskAmount,
      riskPerShare: 0,
      riskPercentPerShare: 0,
      lotCount: 0,
      shareCount: 0,
      totalInvestment: 0,
      actualRiskAmount: 0,
      capitalUtilizationPercent: 0,
      maxAffordableShares: Math.floor(capital / entryPrice / 100) * 100,
      isCappedByCapital: false,
    };
  }

  const theoreticalShares = maxRiskAmount / riskPerShare;
  let shareCount = Math.floor(theoreticalShares / 100) * 100;
  const maxAffordableShares = Math.floor(capital / entryPrice / 100) * 100;

  let isCappedByCapital = false;
  if (shareCount > maxAffordableShares) {
    shareCount = maxAffordableShares;
    isCappedByCapital = true;
  }

  const lotCount = Math.floor(shareCount / 100);
  const totalInvestment = shareCount * entryPrice;
  const actualRiskAmount = shareCount * riskPerShare;
  const capitalUtilizationPercent = capital > 0 ? (totalInvestment / capital) * 100 : 0;

  return {
    maxRiskAmount,
    riskPerShare,
    riskPercentPerShare,
    lotCount,
    shareCount,
    totalInvestment,
    actualRiskAmount,
    capitalUtilizationPercent,
    maxAffordableShares,
    isCappedByCapital,
  };
}

/**
 * 2. VN Stock Break-even & Fee Calculator (Phí mua + Phí bán + Thuế TNCN 0.1%)
 */
export function calculateVnBreakEven(input: VnBreakEvenInput): VnBreakEvenResult {
  const { buyPrice, quantity, buyFeeRate, sellFeeRate, taxRate } = input;

  if (buyPrice <= 0 || quantity <= 0) {
    return {
      breakEvenPrice: 0,
      minGainAmount: 0,
      minGainPercent: 0,
      totalBuyAmount: 0,
      buyFee: 0,
      totalSellAmountAtBreakEven: 0,
      sellFee: 0,
      taxAmount: 0,
      totalCostAndTax: 0,
    };
  }

  const buyRateDec = buyFeeRate / 100;
  const sellRateDec = sellFeeRate / 100;
  const taxRateDec = taxRate / 100;

  const totalBuyAmount = buyPrice * quantity;
  const buyFee = totalBuyAmount * buyRateDec;
  const totalCapitalSpent = totalBuyAmount + buyFee;

  // Formula: P_sell * quantity * (1 - sellFeeRate - taxRate) = totalCapitalSpent
  const exitDeduction = 1 - (sellRateDec + taxRateDec);
  const breakEvenPrice = exitDeduction > 0 
    ? (buyPrice * (1 + buyRateDec)) / exitDeduction 
    : buyPrice;

  const totalSellAmountAtBreakEven = breakEvenPrice * quantity;
  const sellFee = totalSellAmountAtBreakEven * sellRateDec;
  const taxAmount = totalSellAmountAtBreakEven * taxRateDec;
  const totalCostAndTax = buyFee + sellFee + taxAmount;

  const minGainAmount = Math.max(0, breakEvenPrice - buyPrice);
  const minGainPercent = buyPrice > 0 ? (minGainAmount / buyPrice) * 100 : 0;

  return {
    breakEvenPrice,
    minGainAmount,
    minGainPercent,
    totalBuyAmount,
    buyFee,
    totalSellAmountAtBreakEven,
    sellFee,
    taxAmount,
    totalCostAndTax,
  };
}

/**
 * 3. VN Stock DCA & Về bờ Calculator
 */
export function calculateVnDca(purchases: DcaPurchase[], currentPrice: number): VnDcaResult {
  const validPurchases = purchases.filter(p => p.price > 0 && p.quantity > 0);
  
  const totalQuantity = validPurchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalCost = validPurchases.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const averagePrice = totalQuantity > 0 ? totalCost / totalQuantity : 0;

  const currentValue = totalQuantity * currentPrice;
  const currentPnlAmount = currentValue - totalCost;
  const currentPnlPercent = totalCost > 0 ? (currentPnlAmount / totalCost) * 100 : 0;

  let percentNeededToBreakEven = 0;
  if (currentPrice > 0 && averagePrice > currentPrice) {
    percentNeededToBreakEven = ((averagePrice - currentPrice) / currentPrice) * 100;
  }

  return {
    totalQuantity,
    totalCost,
    averagePrice,
    currentValue,
    currentPnlAmount,
    currentPnlPercent,
    percentNeededToBreakEven,
  };
}

/**
 * 4. Risk/Reward (R/R) Ratio
 */
export function calculateRiskReward(input: RiskRewardInput): RiskRewardResult {
  const { entryPrice, stopLossPrice, takeProfitPrice, isShort = false } = input;

  if (entryPrice <= 0 || stopLossPrice <= 0 || takeProfitPrice <= 0) {
    return {
      riskAmount: 0,
      rewardAmount: 0,
      riskPercent: 0,
      rewardPercent: 0,
      ratio: 0,
      rating: 'high_risk',
      ratingLabel: 'Chưa đủ dữ liệu',
      ratingDescription: 'Vui lòng nhập đầy đủ Giá vào lệnh, Cắt lỗ và Chốt lời.',
    };
  }

  const riskAmount = isShort 
    ? Math.max(0, stopLossPrice - entryPrice)
    : Math.max(0, entryPrice - stopLossPrice);

  const rewardAmount = isShort
    ? Math.max(0, entryPrice - takeProfitPrice)
    : Math.max(0, takeProfitPrice - entryPrice);

  const riskPercent = entryPrice > 0 ? (riskAmount / entryPrice) * 100 : 0;
  const rewardPercent = entryPrice > 0 ? (rewardAmount / entryPrice) * 100 : 0;

  const ratio = riskAmount > 0 ? rewardAmount / riskAmount : 0;

  let rating: 'optimal' | 'acceptable' | 'high_risk' = 'high_risk';
  let ratingLabel = 'Tỷ lệ rủi ro cao (< 1:1.5)';
  let ratingDescription = 'Kèo này rủi ro cao hơn lợi nhuận tiềm năng. Khuyến nghị KHÔNG NÊN vào lệnh!';

  if (ratio >= 2.0) {
    rating = 'optimal';
    ratingLabel = `Tỷ lệ Vàng (> 1:2.0) • Đạt 1:${ratio.toFixed(2)}`;
    ratingDescription = 'Kèo rất đẹp! Tiềm năng lợi nhuận gấp đôi rủi ro. Đạt chuẩn kỷ luật quản trị vốn.';
  } else if (ratio >= 1.5) {
    rating = 'acceptable';
    ratingLabel = `Tỷ lệ chấp nhận được (1:1.5 - 1:2.0) • Đạt 1:${ratio.toFixed(2)}`;
    ratingDescription = 'Tỷ lệ vừa đủ chuẩn. Cân nhắc kỹ biến động thị trường và xu hướng trước khi giải ngân.';
  } else {
    rating = 'high_risk';
    ratingLabel = `Cảnh báo Rủi Ro Cao (< 1:1.5) • Chỉ đạt 1:${ratio.toFixed(2)}`;
    ratingDescription = 'Tỷ lệ R/R dưới 1:1.5 dễ bào mòn tài khoản về dài hạn. Không khuyến khích giao dịch!';
  }

  return {
    riskAmount,
    rewardAmount,
    riskPercent,
    rewardPercent,
    ratio,
    rating,
    ratingLabel,
    ratingDescription,
  };
}

/**
 * 5. Crypto Liquidation Calculator (Isolated & Cross Margin, x1 - x125)
 */
export function calculateCryptoLiquidation(input: CryptoLiquidationInput): CryptoLiquidationResult {
  const { direction, entryPrice, leverage, margin, marginMode, extraBalance, mmrRate = 0.004 } = input;

  if (entryPrice <= 0 || leverage <= 0 || margin <= 0) {
    return {
      liquidationPrice: 0,
      bankruptcyPrice: 0,
      distancePrice: 0,
      distancePercent: 0,
      positionSizeCoins: 0,
      notionalValueUsdt: 0,
      riskLevel: 'moderate',
      riskLabel: 'Chưa đủ dữ liệu',
      riskDescription: 'Vui lòng nhập Giá Entry, Đòn bẩy và Ký quỹ.',
    };
  }

  const notionalValueUsdt = margin * leverage;
  const positionSizeCoins = notionalValueUsdt / entryPrice;
  const mmr = mmrRate > 1 ? mmrRate / 100 : mmrRate; // support either 0.4% or 0.004

  let liquidationPrice = 0;
  let bankruptcyPrice = 0;

  if (marginMode === 'isolated') {
    if (direction === 'long') {
      bankruptcyPrice = entryPrice * (1 - 1 / leverage);
      liquidationPrice = entryPrice * (1 - (1 / leverage) + mmr);
    } else {
      bankruptcyPrice = entryPrice * (1 + 1 / leverage);
      liquidationPrice = entryPrice * (1 + (1 / leverage) - mmr);
    }
  } else {
    // Cross margin considers extra balance
    const totalMargin = margin + Math.max(0, extraBalance || 0);
    const maintenanceMargin = notionalValueUsdt * mmr;
    const buffer = totalMargin - maintenanceMargin;

    if (direction === 'long') {
      liquidationPrice = entryPrice - (buffer / positionSizeCoins);
      bankruptcyPrice = entryPrice - (totalMargin / positionSizeCoins);
    } else {
      liquidationPrice = entryPrice + (buffer / positionSizeCoins);
      bankruptcyPrice = entryPrice + (totalMargin / positionSizeCoins);
    }
  }

  liquidationPrice = Math.max(0, liquidationPrice);
  bankruptcyPrice = Math.max(0, bankruptcyPrice);

  const distancePrice = direction === 'long'
    ? Math.max(0, entryPrice - liquidationPrice)
    : Math.max(0, liquidationPrice - entryPrice);

  const distancePercent = entryPrice > 0 ? (distancePrice / entryPrice) * 100 : 0;

  let riskLevel: 'critical' | 'high' | 'moderate' | 'safe' = 'moderate';
  let riskLabel = 'Rủi ro Trung bình';
  let riskDescription = 'Khoảng cách thanh lý ở mức tiêu chuẩn.';

  if (distancePercent <= 2.0) {
    riskLevel = 'critical';
    riskLabel = 'CỰC KỲ NGUY HIỂM ⚠️';
    riskDescription = 'Khoảng cách cháy tài khoản < 2%! Chỉ cần 1 nến giật nhẹ sẽ thanh lý toàn bộ vị thế!';
  } else if (distancePercent <= 5.0) {
    riskLevel = 'high';
    riskLabel = 'RỦI RO CAO 🚨';
    riskDescription = 'Khoảng cách cháy chỉ < 5%. Đòn bẩy quá lớn so với biên độ dao động thông thường.';
  } else if (distancePercent <= 15.0) {
    riskLevel = 'moderate';
    riskLabel = 'TRUNG BÌNH ⚖️';
    riskDescription = 'Biên an toàn tạm ổn. Bắt buộc cài Stop Loss để tránh quét râu thị trường.';
  } else {
    riskLevel = 'safe';
    riskLabel = 'AN TOÀN TƯƠNG ĐỐI 🛡️';
    riskDescription = 'Khoảng cách giá cháy > 15%. Vị thế có đệm an toàn tốt trước các nhịp rung lắc.';
  }

  return {
    liquidationPrice,
    bankruptcyPrice,
    distancePrice,
    distancePercent,
    positionSizeCoins,
    notionalValueUsdt,
    riskLevel,
    riskLabel,
    riskDescription,
  };
}

/**
 * 6. Crypto Position Size theo Risk % hoặc Số $ Chấp Nhận Lỗ
 */
export function calculateCryptoPositionSize(input: CryptoPositionSizeInput): CryptoPositionSizeResult {
  const { accountCapital, riskType, riskValue, entryPrice, stopLossPrice, customLeverage = 10 } = input;

  if (accountCapital <= 0 || entryPrice <= 0 || stopLossPrice <= 0 || riskValue <= 0) {
    return {
      riskAmountUsdt: 0,
      riskPercent: 0,
      priceDistance: 0,
      priceDistancePercent: 0,
      positionSizeUnits: 0,
      notionalValueUsdt: 0,
      recommendedLeverage: 1,
      requiredMarginAtLeverage: 0,
      forexStandardLots: 0,
    };
  }

  const riskAmountUsdt = riskType === 'percent'
    ? accountCapital * (riskValue / 100)
    : riskValue;

  const riskPercent = accountCapital > 0 ? (riskAmountUsdt / accountCapital) * 100 : 0;
  const priceDistance = Math.abs(entryPrice - stopLossPrice);
  const priceDistancePercent = entryPrice > 0 ? (priceDistance / entryPrice) * 100 : 0;

  const positionSizeUnits = priceDistance > 0 ? riskAmountUsdt / priceDistance : 0;
  const notionalValueUsdt = positionSizeUnits * entryPrice;

  const recommendedLeverage = accountCapital > 0 
    ? Math.max(1, Math.ceil(notionalValueUsdt / accountCapital)) 
    : 1;

  const lev = Math.max(1, customLeverage);
  const requiredMarginAtLeverage = notionalValueUsdt / lev;

  // Forex standard lot is typically 100,000 units
  const forexStandardLots = positionSizeUnits / 100000;

  return {
    riskAmountUsdt,
    riskPercent,
    priceDistance,
    priceDistancePercent,
    positionSizeUnits,
    notionalValueUsdt,
    recommendedLeverage,
    requiredMarginAtLeverage,
    forexStandardLots,
  };
}

/**
 * 7. Futures Fee Calculator (Taker, Maker & Funding Rate)
 */
export function calculateFuturesFee(input: FuturesFeeInput): FuturesFeeResult {
  const { margin, leverage, orderType, feeRate, fundingRate, fundingPeriods = 1 } = input;

  if (margin <= 0 || leverage <= 0) {
    return {
      notionalValue: 0,
      openFee: 0,
      closeFee: 0,
      roundTripTradingFee: 0,
      fundingFeePerCycle: 0,
      totalFundingFee: 0,
      totalAllFees: 0,
      feeOnMarginPercent: 0,
    };
  }

  const notionalValue = margin * leverage;
  
  // Standard Binance: Maker = 0.02%, Taker = 0.05%
  let activeRate = feeRate;
  if (orderType === 'maker' && !feeRate) activeRate = 0.02;
  if (orderType === 'taker' && !feeRate) activeRate = 0.05;

  const rateDec = (activeRate || 0.05) / 100;
  const openFee = notionalValue * rateDec;
  const closeFee = notionalValue * rateDec;
  const roundTripTradingFee = openFee + closeFee;

  const fundingRateDec = (fundingRate || 0.01) / 100;
  const fundingFeePerCycle = notionalValue * fundingRateDec;
  const totalFundingFee = fundingFeePerCycle * Math.max(0, fundingPeriods);

  const totalAllFees = roundTripTradingFee + totalFundingFee;
  const feeOnMarginPercent = margin > 0 ? (totalAllFees / margin) * 100 : 0;

  return {
    notionalValue,
    openFee,
    closeFee,
    roundTripTradingFee,
    fundingFeePerCycle,
    totalFundingFee,
    totalAllFees,
    feeOnMarginPercent,
  };
}

/**
 * 8. Crypto PnL & Binance Fee & P2P Converter (Lãi/Lỗ Gộp & Ròng Thực Nhận + Quy đổi VNĐ)
 */
export function calculateCryptoPnl(input: CryptoPnlInput): CryptoPnlResult {
  const { 
    direction, 
    margin, 
    leverage, 
    entryPrice, 
    exitPrice, 
    p2pRate = 25450,
    openFeeType = 'taker',
    closeFeeType = 'taker',
    customFeeRate
  } = input;

  if (margin <= 0 || leverage <= 0 || entryPrice <= 0 || exitPrice <= 0) {
    return {
      priceChangePercent: 0,
      roePercent: 0,
      grossPnlUsdt: 0,
      openFeeUsdt: 0,
      closeFeeUsdt: 0,
      totalFeeUsdt: 0,
      netPnlUsdt: 0,
      netRoePercent: 0,
      netPnlVnd: 0,
      totalReturnUsdt: 0,
      totalReturnVnd: 0,
      isProfit: true,
      breakevenExitPrice: entryPrice || 0,
      pnlUsdt: 0,
      pnlVnd: 0,
    };
  }

  const rawDiff = direction === 'long' 
    ? (exitPrice - entryPrice) 
    : (entryPrice - exitPrice);

  const priceChangePercent = entryPrice > 0 ? (rawDiff / entryPrice) * 100 : 0;
  const roePercent = priceChangePercent * leverage;
  const grossPnlUsdt = margin * (roePercent / 100);

  // Position quantity (units)
  const openNotional = margin * leverage;
  const positionUnits = entryPrice > 0 ? openNotional / entryPrice : 0;
  const closeNotional = positionUnits * exitPrice;

  // Fee rates (Standard Binance Futures: Taker 0.05%, Maker 0.02%)
  const openRate = customFeeRate !== undefined ? customFeeRate : (openFeeType === 'maker' ? 0.02 : 0.05);
  const closeRate = customFeeRate !== undefined ? customFeeRate : (closeFeeType === 'maker' ? 0.02 : 0.05);

  const openFeeUsdt = openNotional * (openRate / 100);
  const closeFeeUsdt = closeNotional * (closeRate / 100);
  const totalFeeUsdt = openFeeUsdt + closeFeeUsdt;

  const netPnlUsdt = grossPnlUsdt - totalFeeUsdt;
  const netRoePercent = margin > 0 ? (netPnlUsdt / margin) * 100 : 0;
  const totalReturnUsdt = margin + netPnlUsdt;

  const rate = p2pRate > 0 ? p2pRate : 25450;
  const netPnlVnd = netPnlUsdt * rate;
  const totalReturnVnd = totalReturnUsdt * rate;

  // Breakeven price accounting for open and close fees
  // Long: Exit * (1 - closeRate) = Entry * (1 + openRate) => Exit = Entry * (1 + openRate) / (1 - closeRate)
  // Short: Exit * (1 + closeRate) = Entry * (1 - openRate) => Exit = Entry * (1 - openRate) / (1 + closeRate)
  const openRateDec = openRate / 100;
  const closeRateDec = closeRate / 100;
  let breakevenExitPrice = entryPrice;
  if (direction === 'long') {
    breakevenExitPrice = (1 - closeRateDec) > 0 ? entryPrice * (1 + openRateDec) / (1 - closeRateDec) : entryPrice;
  } else {
    breakevenExitPrice = (1 + closeRateDec) > 0 ? entryPrice * (1 - openRateDec) / (1 + closeRateDec) : entryPrice;
  }

  return {
    priceChangePercent,
    roePercent,
    grossPnlUsdt,
    openFeeUsdt,
    closeFeeUsdt,
    totalFeeUsdt,
    netPnlUsdt,
    netRoePercent,
    netPnlVnd,
    totalReturnUsdt,
    totalReturnVnd,
    isProfit: netPnlUsdt >= 0,
    breakevenExitPrice,
    // Aliases for compatibility
    pnlUsdt: netPnlUsdt,
    pnlVnd: netPnlVnd,
  };
}

/**
 * 9. Kelly Criterion Calculator (Quản trị vốn tối ưu theo phong độ)
 * Formula: f* = W - (1 - W) / R
 */
export function calculateKellyCriterion(input: import('../types').KellyCriterionInput): import('../types').KellyCriterionResult {
  const { winRatePercent, riskRewardRatio, accountCapital, fractionType = 'half' } = input;

  if (winRatePercent <= 0 || riskRewardRatio <= 0) {
    return {
      fullKellyPercent: 0,
      recommendedKellyPercent: 0,
      recommendedBetAmount: 0,
      isNegativeEdge: true,
      isDangerous: false,
      statusBadge: 'negative',
      verdictLabel: 'Kỳ Vọng Toán Học Âm (Negative Edge)',
      verdictDescription: 'Winrate hoặc tỷ lệ R/R không đủ để sinh lợi nhuận. Khuyến nghị KHÔNG NÊN giao dịch!',
      fractionalKellyPercent: 0,
      recommendedRiskAmount: 0,
      isWarning: true,
      warningMessage: 'Kỳ Vọng Âm (EV ≤ 0)',
      advice: 'Winrate hoặc tỷ lệ R/R không đủ để sinh lợi nhuận. Khuyến nghị KHÔNG NÊN giao dịch!',
      expectedValuePerTradePercent: 0,
    };
  }

  const W = winRatePercent / 100;
  const R = riskRewardRatio;
  
  // Kelly formula: f* = W - (1 - W) / R
  const fullKellyDec = W - (1 - W) / R;
  const fullKellyPercent = fullKellyDec * 100;

  let fractionMultiplier = 0.5; // default half-kelly (khuyên dùng trong trading để giảm drawdown)
  if (fractionType === 'full') fractionMultiplier = 1.0;
  if (fractionType === 'quarter') fractionMultiplier = 0.25;

  let recommendedKellyPercent = Math.max(0, fullKellyPercent * fractionMultiplier);
  const recommendedBetAmount = accountCapital > 0 ? (accountCapital * (recommendedKellyPercent / 100)) : 0;

  const isNegativeEdge = fullKellyPercent <= 0;
  const isDangerous = recommendedKellyPercent > 25;

  let statusBadge: 'optimal' | 'warning' | 'negative' = 'optimal';
  let verdictLabel = `Tối Ưu: Đi ${recommendedKellyPercent.toFixed(1)}% Vốn`;
  let verdictDescription = `Áp dụng ${fractionType === 'full' ? 'Full Kelly' : fractionType === 'half' ? 'Half-Kelly (khuyên dùng)' : 'Quarter-Kelly'} để tối đa hóa tốc độ tăng trưởng vốn hình học.`;

  if (isNegativeEdge) {
    statusBadge = 'negative';
    verdictLabel = 'Cảnh Báo: Kỳ Vọng Âm (f* ≤ 0)';
    verdictDescription = 'Hệ thống giao dịch đang thua lỗ về mặt xác suất thống kê. Đi tiền lệnh này là cờ bạc!';
    recommendedKellyPercent = 0;
  } else if (isDangerous) {
    statusBadge = 'warning';
    verdictLabel = `Rủi Ro Cao: Kelly Đề Xuất > 25% (${recommendedKellyPercent.toFixed(1)}%)`;
    verdictDescription = 'Tỷ lệ cược quá lớn dễ gây cháy tài khoản khi gặp chuỗi thua (Drawdown). Khuyến nghị tối đa chỉ đi 5% - 10%!';
  }

  return {
    fullKellyPercent,
    recommendedKellyPercent,
    recommendedBetAmount,
    isNegativeEdge,
    isDangerous,
    statusBadge,
    verdictLabel,
    verdictDescription,
    fractionalKellyPercent: recommendedKellyPercent,
    recommendedRiskAmount: recommendedBetAmount,
    isWarning: isDangerous || isNegativeEdge,
    warningMessage: isNegativeEdge ? 'Kỳ Vọng Âm (EV ≤ 0)' : isDangerous ? 'Kelly quá cao (>25%)' : 'Tỷ lệ an toàn',
    advice: verdictDescription,
    expectedValuePerTradePercent: (W * R - (1 - W)) * 100,
  };
}

/**
 * 10. Slippage & Spread Impact (Tính Phí trượt giá thực tế & R/R hữu dụng)
 */
export function calculateSlippageImpact(input: import('../types').SlippageImpactInput): import('../types').SlippageImpactResult {
  const { entryPrice, stopLossPrice, takeProfitPrice, slippagePercent = 0.1, spreadPercent = 0.05, isShort = false } = input;

  const nominalRisk = Math.abs(entryPrice - stopLossPrice);
  const nominalReward = Math.abs(takeProfitPrice - entryPrice);
  const nominalRatio = nominalRisk > 0 ? nominalReward / nominalRisk : 0;

  const totalFrictionPercent = slippagePercent + spreadPercent;
  const frictionDec = totalFrictionPercent / 100;

  // Slippage makes entry worse
  const effectiveEntryPrice = isShort
    ? entryPrice * (1 - frictionDec)
    : entryPrice * (1 + frictionDec);

  // Slippage on exit (Stop Loss slips further away, Take Profit slips lower)
  const exitSlippageDec = (slippagePercent / 100);
  const effectiveStopLoss = isShort
    ? stopLossPrice * (1 + exitSlippageDec)
    : stopLossPrice * (1 - exitSlippageDec);

  const effectiveTakeProfit = isShort
    ? takeProfitPrice * (1 + exitSlippageDec)
    : takeProfitPrice * (1 - exitSlippageDec);

  const effectiveRisk = isShort
    ? Math.max(0.0001, effectiveStopLoss - effectiveEntryPrice)
    : Math.max(0.0001, effectiveEntryPrice - effectiveStopLoss);

  const effectiveReward = isShort
    ? Math.max(0, effectiveEntryPrice - effectiveTakeProfit)
    : Math.max(0, effectiveTakeProfit - effectiveEntryPrice);

  const effectiveRatio = effectiveRisk > 0 ? effectiveReward / effectiveRisk : 0;
  const ratioErosionPercent = nominalRatio > 0 ? Math.max(0, ((nominalRatio - effectiveRatio) / nominalRatio) * 100) : 0;
  const slippageCostPerUnit = Math.abs(effectiveEntryPrice - entryPrice);

  return {
    nominalRatio,
    effectiveEntryPrice,
    effectiveStopLoss,
    effectiveTakeProfit,
    effectiveRatio,
    ratioErosionPercent,
    slippageCostPerUnit,
    totalHiddenCostPercent: totalFrictionPercent,
  };
}

/**
 * 11. Funding Rate x24h & 7 Days (Futures Holding Cost)
 */
export function calculateFundingMultiPeriod(input: import('../types').FundingMultiPeriodInput): import('../types').FundingMultiPeriodResult {
  const { margin, leverage, fundingRate, direction, p2pRate = 25450 } = input;
  const notionalValue = margin * leverage;

  const rateAbs = Math.abs(fundingRate) / 100;
  const fee8h = notionalValue * rateAbs;
  const fee24h = fee8h * 3;
  const fee7d = fee8h * 21;
  const annualizedRatePercent = fundingRate * 3 * 365;

  const effectiveP2p = p2pRate > 0 ? p2pRate : 25450;
  const fee8hVnd = fee8h * effectiveP2p;
  const fee24hVnd = fee24h * effectiveP2p;
  const fee7dVnd = fee7d * effectiveP2p;

  // Positive funding: Longs pay Shorts
  // Negative funding: Shorts pay Longs
  let actionType: 'pay' | 'receive' = 'pay';
  let actionExplanation = '';

  if (fundingRate > 0) {
    if (direction === 'long') {
      actionType = 'pay';
      actionExplanation = 'Funding Rate dương (> 0%): Phe Long (bạn) PHẢI TRẢ TIỀN cho phe Short mỗi 8 tiếng.';
    } else {
      actionType = 'receive';
      actionExplanation = 'Funding Rate dương (> 0%): Phe Long trả tiền, bạn (Short) ĐƯỢC NHẬN TIỀN mỗi 8 tiếng.';
    }
  } else if (fundingRate < 0) {
    if (direction === 'long') {
      actionType = 'receive';
      actionExplanation = 'Funding Rate âm (< 0%): Phe Short trả tiền, bạn (Long) ĐƯỢC NHẬN TIỀN mỗi 8 tiếng.';
    } else {
      actionType = 'pay';
      actionExplanation = 'Funding Rate âm (< 0%): Phe Short (bạn) PHẢI TRẢ TIỀN cho phe Long mỗi 8 tiếng.';
    }
  } else {
    actionType = 'receive';
    actionExplanation = 'Funding Rate = 0%: Không phát sinh chi phí hoặc lãi funding.';
  }

  return {
    notionalValue,
    ratePerCyclePercent: fundingRate,
    fee8h,
    fee8hVnd,
    fee24h,
    fee24hVnd,
    fee7d,
    fee7dVnd,
    annualizedRatePercent,
    actionType,
    actionExplanation,
  };
}

/**
 * 12. Drawdown Recovery Table Data & Compound Growth
 */
export const DRAWDOWN_RECOVERY_DATA = [
  { lossPercent: 5, gainNeededPercent: 5.3, description: 'Dễ dàng bù đắp' },
  { lossPercent: 10, gainNeededPercent: 11.1, description: 'Mức rủi ro cho phép' },
  { lossPercent: 15, gainNeededPercent: 17.6, description: 'Bắt đầu có áp lực' },
  { lossPercent: 20, gainNeededPercent: 25.0, description: 'Cần 1.25x nỗ lực' },
  { lossPercent: 30, gainNeededPercent: 42.9, description: 'Khó về bờ' },
  { lossPercent: 40, gainNeededPercent: 66.7, description: 'Tâm lý hoảng loạn' },
  { lossPercent: 50, gainNeededPercent: 100.0, description: 'Phải X2 tài khoản' },
  { lossPercent: 60, gainNeededPercent: 150.0, description: 'Nguy cơ kiệt quệ' },
  { lossPercent: 70, gainNeededPercent: 233.3, description: 'Cần tăng hơn X3' },
  { lossPercent: 80, gainNeededPercent: 400.0, description: 'Gần như bất khả thi' },
  { lossPercent: 90, gainNeededPercent: 900.0, description: 'Cần tăng gấp 10 lần' },
];

export function calculateCompoundGrowth(input: import('../types').CompoundGrowthInput): import('../types').CompoundGrowthResult {
  const { initialCapital, gainPerTradePercent, numberOfTrades, reinvestPercent = 100 } = input;
  
  if (initialCapital <= 0 || numberOfTrades <= 0) {
    return {
      finalCapital: initialCapital,
      totalProfit: 0,
      growthMultiplier: 1,
      totalGainPercent: 0,
    };
  }

  const effectiveRate = (gainPerTradePercent / 100) * (reinvestPercent / 100);
  const growthMultiplier = Math.pow(1 + effectiveRate, numberOfTrades);
  const finalCapital = initialCapital * growthMultiplier;
  const totalProfit = finalCapital - initialCapital;
  const totalGainPercent = initialCapital > 0 ? (totalProfit / initialCapital) * 100 : 0;

  return {
    finalCapital,
    totalProfit,
    growthMultiplier,
    totalGainPercent,
  };
}

