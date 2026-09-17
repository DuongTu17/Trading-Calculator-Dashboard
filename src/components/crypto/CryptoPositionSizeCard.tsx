import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, 
  Percent, 
  DollarSign, 
  Copy, 
  Check, 
  HelpCircle,
  Sliders,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Scale,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react';
import { calculateCryptoPositionSize, calculateCryptoLiquidation } from '../../utils/calculations';
import { formatUsdt, formatPercent, formatTokenPrice } from '../../utils/formatters';
import { SymbolSelector } from '../common/SymbolSelector';
import { POPULAR_SYMBOLS, CryptoSymbolInfo } from '../../data/symbols';
import { CryptoDirection } from '../../types';
import { useBinancePrice } from '../../hooks/useBinancePrice';
import { PriceRange24hBar } from '../common/PriceRange24hBar';

export const CryptoPositionSizeCard: React.FC = () => {
  const [currentSymbol, setCurrentSymbol] = useState<CryptoSymbolInfo>(POPULAR_SYMBOLS[0]);
  const [direction, setDirection] = useState<CryptoDirection>('long');
  const [accountCapital, setAccountCapital] = useState<number>(2000);
  const [riskType, setRiskType] = useState<'percent' | 'fixed'>('percent');
  const [riskPercentValue, setRiskPercentValue] = useState<number>(2); // 2%
  const [riskFixedValue, setRiskFixedValue] = useState<number>(50); // $50
  const [entryPrice, setEntryPrice] = useState<number>(65400);
  const [stopLossPrice, setStopLossPrice] = useState<number>(63500);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(69200);
  const [customLeverage, setCustomLeverage] = useState<number>(10);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isLiveSync, setIsLiveSync] = useState<boolean>(true);

  // Hook for Binance Real-time WebSocket Stream
  const {
    price: livePrice,
    high24h,
    low24h,
    change24h,
    priceDirection,
    isWsConnected,
    isLive,
    symbolInfo,
  } = useBinancePrice(currentSymbol.symbol, { autoRefresh: true });

  const safeDecimals = currentSymbol?.decimals ?? symbolInfo?.decimals ?? 2;

  // Real-time synchronization of Entry Price with WebSocket tick
  useEffect(() => {
    if (isLiveSync && livePrice > 0) {
      setEntryPrice(livePrice);
    }
  }, [livePrice, isLiveSync]);

  const activeRiskValue = riskType === 'percent' ? riskPercentValue : riskFixedValue;

  const result = useMemo(() => {
    return calculateCryptoPositionSize({
      accountCapital,
      riskType,
      riskValue: activeRiskValue,
      entryPrice,
      stopLossPrice,
      customLeverage,
    });
  }, [accountCapital, riskType, activeRiskValue, entryPrice, stopLossPrice, customLeverage]);

  // Risk / Reward Calculation
  const riskRewardInfo = useMemo(() => {
    const riskDistance = Math.abs(entryPrice - stopLossPrice);
    const rewardDistance = Math.abs(takeProfitPrice - entryPrice);
    const ratio = riskDistance > 0 ? rewardDistance / riskDistance : 0;
    const isTargetValid = direction === 'long' 
      ? takeProfitPrice > entryPrice && stopLossPrice < entryPrice
      : takeProfitPrice < entryPrice && stopLossPrice > entryPrice;

    return {
      riskDistance,
      rewardDistance,
      ratio,
      isTargetValid,
    };
  }, [entryPrice, stopLossPrice, takeProfitPrice, direction]);

  // Liquidation Price vs Stop Loss check
  const liqCheck = useMemo(() => {
    const marginAtLev = result?.requiredMarginAtLeverage || (result.notionalValueUsdt / customLeverage);
    const liqRes = calculateCryptoLiquidation({
      direction,
      entryPrice,
      leverage: customLeverage,
      margin: marginAtLev,
      marginMode: 'isolated',
      extraBalance: 0,
      mmrRate: 0.004,
    });

    const isLiquidatedBeforeSl = direction === 'long'
      ? liqRes.liquidationPrice >= stopLossPrice
      : liqRes.liquidationPrice <= stopLossPrice;

    // Max safe leverage so liquidation is beyond SL with 15% buffer
    const slDistancePct = entryPrice > 0 ? Math.abs(entryPrice - stopLossPrice) / entryPrice : 0.05;
    const maxSafeLev = slDistancePct > 0 ? Math.floor(0.85 / (slDistancePct + 0.004)) : 10;

    return {
      liqPrice: liqRes.liquidationPrice,
      isLiquidatedBeforeSl,
      maxSafeLev: Math.max(1, Math.min(125, maxSafeLev)),
    };
  }, [direction, entryPrice, customLeverage, stopLossPrice, result]);

  const handleSelectSymbol = (newSymbol: CryptoSymbolInfo) => {
    if (!newSymbol) return;
    setCurrentSymbol(newSymbol);
    if (newSymbol.defaultPrice) {
      setEntryPrice(newSymbol.defaultPrice);
      const dec = newSymbol.decimals ?? 2;
      if (direction === 'long') {
        setStopLossPrice(+(newSymbol.defaultPrice * 0.97).toFixed(dec));
        setTakeProfitPrice(+(newSymbol.defaultPrice * 1.06).toFixed(dec));
      } else {
        setStopLossPrice(+(newSymbol.defaultPrice * 1.03).toFixed(dec));
        setTakeProfitPrice(+(newSymbol.defaultPrice * 0.94).toFixed(dec));
      }
    }
  };

  const handleApplyPrice = (livePrice: number) => {
    if (typeof livePrice !== 'number' || isNaN(livePrice) || livePrice <= 0) return;
    setEntryPrice(livePrice);
    const dec = currentSymbol?.decimals ?? 2;
    if (direction === 'long') {
      setStopLossPrice(+(livePrice * 0.97).toFixed(dec));
      setTakeProfitPrice(+(livePrice * 1.06).toFixed(dec));
    } else {
      setStopLossPrice(+(livePrice * 1.03).toFixed(dec));
      setTakeProfitPrice(+(livePrice * 0.94).toFixed(dec));
    }
  };

  const tokenFormatted = (result?.positionSizeUnits ?? 0).toFixed(safeDecimals > 4 ? 2 : 4);

  const handleCopyTokenOnly = () => {
    navigator.clipboard?.writeText(tokenFormatted);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopy = () => {
    const text = `[Kế Hoạch Đi Lệnh Binance] ${currentSymbol?.displayName || 'BTC/USDT'} ${direction.toUpperCase()} ${customLeverage}x | Vốn: $${formatUsdt(accountCapital)} (Rủi ro ${result?.riskPercent ?? 2}% = $${formatUsdt(result?.riskAmountUsdt ?? 0)}) | Entry: $${formatTokenPrice(entryPrice, safeDecimals)} | SL: $${formatTokenPrice(stopLossPrice, safeDecimals)} | TP: $${formatTokenPrice(takeProfitPrice, safeDecimals)} (R/R 1:${riskRewardInfo.ratio.toFixed(2)}) -> Nhập Binance: ${tokenFormatted} ${currentSymbol?.baseAsset || 'COIN'} (Margin $${formatUsdt(result?.requiredMarginAtLeverage ?? 0)})`;
    navigator.clipboard?.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleApplyRr2 = () => {
    const dist = Math.abs(entryPrice - stopLossPrice);
    const dec = currentSymbol?.decimals ?? 2;
    if (direction === 'long') {
      setTakeProfitPrice(+(entryPrice + dist * 2).toFixed(dec));
    } else {
      setTakeProfitPrice(+(entryPrice - dist * 2).toFixed(dec));
    }
  };

  return (
    <div id="crypto-position-size-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Smart Position Size by Risk %
              </h3>
              <p className="text-xs text-[#848E9C]">
                Tính đúng số lượng Token cần nhập trên Binance để chỉ mất đúng % rủi ro cài đặt
              </p>
            </div>
          </div>

          <button
            id="copy-risk-size-btn"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Đã chép' : 'Sao chép kèo'}</span>
          </button>
        </div>

        {/* Realtime Symbol Selector */}
        <div className="mb-4">
          <SymbolSelector
            selectedSymbol={currentSymbol.symbol}
            onSelectSymbol={handleSelectSymbol}
            onApplyPrice={handleApplyPrice}
          />
        </div>

        {/* Direction Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#161A25] rounded-xl border border-[#232936] mb-4">
          <button
            type="button"
            onClick={() => {
              setDirection('long');
              const dec = currentSymbol?.decimals ?? 2;
              setStopLossPrice(+(entryPrice * 0.97).toFixed(dec));
              setTakeProfitPrice(+(entryPrice * 1.06).toFixed(dec));
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              direction === 'long'
                ? 'bg-[#0ECB81] text-black shadow-md shadow-[#0ECB81]/20'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>LONG (Đánh Lên)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDirection('short');
              const dec = currentSymbol?.decimals ?? 2;
              setStopLossPrice(+(entryPrice * 1.03).toFixed(dec));
              setTakeProfitPrice(+(entryPrice * 0.94).toFixed(dec));
            }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              direction === 'short'
                ? 'bg-[#F6465D] text-white shadow-md shadow-[#F6465D]/20'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>SHORT (Đánh Xuống)</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Account Capital */}
          <div>
            <label htmlFor="input-crypto-capital" className="text-xs text-[#848E9C] font-medium block mb-1">
              Tổng Vốn Tài Khoản (Account Balance):
            </label>
            <div className="relative">
              <input
                id="input-crypto-capital"
                type="number"
                value={accountCapital || ''}
                onChange={(e) => setAccountCapital(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] focus:border-[#00B4D8] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none transition-colors"
                placeholder="2000"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">USDT</span>
            </div>
          </div>

          {/* Risk Type Selector & Slider */}
          <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#848E9C] font-medium">Chế độ đo Rủi ro cho 1 lệnh:</span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setRiskType('percent')}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all ${
                    riskType === 'percent'
                      ? 'bg-[#00B4D8] text-black shadow-sm'
                      : 'text-[#848E9C] hover:text-white'
                  }`}
                >
                  % Vốn
                </button>
                <button
                  type="button"
                  onClick={() => setRiskType('fixed')}
                  className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-all ${
                    riskType === 'fixed'
                      ? 'bg-[#00B4D8] text-black shadow-sm'
                      : 'text-[#848E9C] hover:text-white'
                  }`}
                >
                  Số tiền ($)
                </button>
              </div>
            </div>

            {riskType === 'percent' ? (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#848E9C]">Tỷ lệ rủi ro chấp nhận mất:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#848E9C] font-mono">
                      (~${formatUsdt(accountCapital * (riskPercentValue / 100))})
                    </span>
                    <span className="font-mono font-bold text-[#00B4D8]">{riskPercentValue}%</span>
                  </div>
                </div>
                <input
                  id="input-risk-percent-slider"
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={riskPercentValue}
                  onChange={(e) => setRiskPercentValue(parseFloat(e.target.value) || 1)}
                  className="w-full h-2 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#00B4D8]"
                />
                
                {/* Quick Select Buttons: 1%, 2%, 3%, 5% */}
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 5].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setRiskPercentValue(pct)}
                      className={`flex-1 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                        riskPercentValue === pct
                          ? 'bg-[#00B4D8] text-black shadow-sm'
                          : 'bg-[#0B0E14] text-[#848E9C] hover:text-white border border-[#232936]'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="input-risk-fixed" className="text-xs text-[#848E9C] block mb-1">
                  Số tiền tối đa chấp nhận mất nếu dính Stop Loss:
                </label>
                <div className="relative">
                  <input
                    id="input-risk-fixed"
                    type="number"
                    value={riskFixedValue || ''}
                    onChange={(e) => setRiskFixedValue(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0E14] border border-[#232936] focus:border-[#00B4D8] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                    placeholder="50"
                  />
                  <span className="absolute right-3 top-2 text-xs text-[#848E9C] font-mono">USDT</span>
                </div>
              </div>
            )}
          </div>

          {/* Entry, Stop Loss & Take Profit (R/R Calculation) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <label htmlFor="input-risk-entry" className="text-xs text-[#848E9C] font-medium">
                    Giá Entry:
                  </label>
                  {/* Flashing LIVE badge matching priceDirection */}
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all duration-300 ${
                      priceDirection === 'up'
                        ? 'bg-[#0ECB81]/25 text-[#0ECB81] ring-1 ring-[#0ECB81]/50 scale-105'
                        : priceDirection === 'down'
                        ? 'bg-[#F6465D]/25 text-[#F6465D] ring-1 ring-[#F6465D]/50 scale-105'
                        : 'bg-[#161A25] text-[#0ECB81] border border-[#232936]'
                    }`}
                    title="Giá thị trường real-time Binance WebSocket"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      priceDirection === 'down' ? 'bg-[#F6465D]' : 'bg-[#0ECB81]'
                    } ${isWsConnected ? 'animate-ping' : ''}`} />
                    <span>{priceDirection === 'down' ? '🔴' : '🟢'} LIVE ${formatTokenPrice(livePrice, safeDecimals)}</span>
                  </span>
                </div>

                {/* Auto-sync Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    const nextSync = !isLiveSync;
                    setIsLiveSync(nextSync);
                    if (nextSync && livePrice > 0) {
                      setEntryPrice(livePrice);
                    }
                  }}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-all flex items-center gap-0.5 ${
                    isLiveSync
                      ? 'bg-[#0ECB81] text-black font-bold shadow-sm'
                      : 'bg-[#1C212E] text-[#848E9C] hover:text-white border border-[#232936]'
                  }`}
                  title={isLiveSync ? 'Đang tự động khớp giá Live thời gian thực' : 'Bấm để tự động điền giá Live'}
                >
                  <Zap className="w-2.5 h-2.5" />
                  <span>{isLiveSync ? 'Sync: BẬT' : 'Sync: TẮT'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  id="input-risk-entry"
                  type="number"
                  step={currentSymbol.tickSize || 'any'}
                  value={entryPrice || ''}
                  onChange={(e) => {
                    setIsLiveSync(false); // pause auto-sync when user manually types
                    setEntryPrice(parseFloat(e.target.value) || 0);
                  }}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none"
                  placeholder="65000"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="input-risk-sl" className="text-xs text-[#848E9C] font-medium">
                  Stop Loss (SL):
                </label>
                <span className="text-[10px] text-[#F6465D] font-mono">
                  {formatPercent(result.priceDistancePercent, false)}
                </span>
              </div>
              <div className="relative">
                <input
                  id="input-risk-sl"
                  type="number"
                  step={currentSymbol.tickSize || 'any'}
                  value={stopLossPrice || ''}
                  onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#F6465D] rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none"
                  placeholder="63500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="input-risk-tp" className="text-xs text-[#848E9C] font-medium">
                  Take Profit (TP):
                </label>
                <button
                  type="button"
                  onClick={handleApplyRr2}
                  className="text-[10px] text-[#00B4D8] hover:underline"
                  title="Tự đặt TP đạt R/R 1:2"
                >
                  Set 1:2 R/R
                </button>
              </div>
              <div className="relative">
                <input
                  id="input-risk-tp"
                  type="number"
                  step={currentSymbol.tickSize || 'any'}
                  value={takeProfitPrice || ''}
                  onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none"
                  placeholder="69200"
                />
              </div>
            </div>
          </div>

          {/* 24h High/Low Reference Bar for SL & TP Planning */}
          <PriceRange24hBar
            low24h={low24h}
            high24h={high24h}
            currentPrice={livePrice}
            decimals={safeDecimals}
            quoteAsset={currentSymbol.quoteAsset}
            onSetStopLoss={(price) => setStopLossPrice(price)}
            onSetTakeProfit={(price) => setTakeProfitPrice(price)}
          />

          {/* R/R Indicator */}
          <div className="bg-[#161A25] p-2.5 rounded-xl border border-[#232936] flex items-center justify-between text-xs">
            <span className="text-[#848E9C] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#F0B90B]" />
              Tỷ lệ Lợi Nhuận / Rủi Ro (R/R):
            </span>
            <div className="flex items-center gap-2">
              <span className={`font-mono font-bold text-sm ${
                riskRewardInfo.ratio >= 2 
                  ? 'text-[#0ECB81]' 
                  : riskRewardInfo.ratio >= 1.5 
                  ? 'text-[#F0B90B]' 
                  : 'text-[#F6465D]'
              }`}>
                1 : {riskRewardInfo.ratio.toFixed(2)}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                riskRewardInfo.ratio >= 2 
                  ? 'bg-[#0ECB81]/15 text-[#0ECB81]' 
                  : riskRewardInfo.ratio >= 1.5 
                  ? 'bg-[#F0B90B]/15 text-[#F0B90B]' 
                  : 'bg-[#F6465D]/15 text-[#F6465D]'
              }`}>
                {riskRewardInfo.ratio >= 2 ? 'Kèo R/R Đẹp' : riskRewardInfo.ratio >= 1.5 ? 'Chấp nhận được' : 'R/R Thấp'}
              </span>
            </div>
          </div>

          {/* Leverage choice */}
          <div className="space-y-1.5 bg-[#161A25] p-3 rounded-xl border border-[#232936]">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#848E9C] font-medium flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-[#F0B90B]" />
                Đòn bẩy dự định cài trên Binance:
              </span>
              <span className="text-[#F0B90B] font-mono font-bold text-sm">{customLeverage}x</span>
            </div>
            <input
              id="input-custom-leverage"
              type="range"
              min="1"
              max="50"
              value={customLeverage}
              onChange={(e) => setCustomLeverage(parseInt(e.target.value) || 1)}
              className="w-full h-2 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#00B4D8]"
            />
          </div>

          {/* CRITICAL WARNING: Liquidated Before Stop Loss */}
          {liqCheck.isLiquidatedBeforeSl && (
            <div className="p-3 rounded-xl bg-[#F6465D]/15 border border-[#F6465D]/40 text-xs text-[#F6465D] space-y-1.5 animate-pulse">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>NGUY HIỂM: BỊ THANH LÝ TRƯỚC KHI CHẠM STOP LOSS!</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#F6465D]/90">
                Ở đòn bẩy <strong>{customLeverage}x</strong>, Giá Cháy của bạn là <strong>${formatTokenPrice(liqCheck.liqPrice, safeDecimals)}</strong> (nằm TRƯỚC giá Stop Loss <strong>${formatTokenPrice(stopLossPrice, safeDecimals)}</strong>). Sàn sẽ thanh lý sạch tiền ký quỹ trước khi lệnh cắt lỗ kịp kích hoạt!
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-white font-medium">Khắc phục:</span>
                <button
                  type="button"
                  onClick={() => setCustomLeverage(liqCheck.maxSafeLev)}
                  className="px-2 py-1 rounded bg-[#F6465D] text-white font-bold text-[11px] hover:bg-[#F6465D]/80"
                >
                  Hạ đòn bẩy an toàn về &le; {liqCheck.maxSafeLev}x
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Output Results */}
      <div className="mt-6 pt-5 border-t border-[#1E232F] space-y-4">
        {/* Recommended Position Size Box (What trader inputs to Binance) */}
        <div className="p-4 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/30 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00B4D8]" />
              SỐ LƯỢNG TOKEN CẦN NHẬP VÀO BINANCE:
            </span>
            <button
              type="button"
              onClick={handleCopyTokenOnly}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#00B4D8] text-black text-xs font-bold hover:bg-[#00B4D8]/80 transition-all shadow-sm"
              title="Copy khối lượng để paste vào Binance"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToken ? 'Đã chép số' : 'Copy số lượng'}</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
              {tokenFormatted}
            </span>
            <span className="text-sm font-mono text-[#00B4D8] font-bold">
              {currentSymbol?.baseAsset || 'COIN'}
            </span>
            <span className="text-xs text-[#848E9C] ml-auto font-mono">
              (Giá trị: ${formatUsdt(result?.notionalValueUsdt ?? 0)})
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-[#848E9C] flex items-center justify-between">
            <span>Ký quỹ (Margin) bỏ ra ở {customLeverage}x:</span>
            <span className="font-mono font-extrabold text-white text-sm">
              ${formatUsdt(result?.requiredMarginAtLeverage ?? 0)} USDT
            </span>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3 rounded-xl bg-[#0ECB81]/10 border border-[#0ECB81]/25 text-xs text-[#0ECB81] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0ECB81] shrink-0" />
            <span>
              Bảo hiểm rủi ro: Nếu giá quét trúng Stop Loss, bạn chỉ mất đúng <strong>${formatUsdt(result?.riskAmountUsdt ?? 0)}</strong> (đúng {result?.riskPercent ?? 2}% vốn).
            </span>
          </div>
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Rủi Ro Tối Đa:</span>
            <span className="font-mono font-bold text-[#F6465D] text-sm">
              -${formatUsdt(result?.riskAmountUsdt ?? 0)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Khoảng Cách SL:</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatPercent(result?.priceDistancePercent ?? 0, false)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936] col-span-2 sm:col-span-1">
            <span className="text-[#848E9C] text-[11px] block">Đòn Bẩy Khuyên Dùng:</span>
            <span className="font-mono font-bold text-[#F0B90B] text-sm">
              Tối thiểu ~{result?.recommendedLeverage ?? 1}x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
