import React, { useState, useMemo, useEffect } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  Sliders, 
  ArrowUpRight, 
  ArrowDownRight, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  Zap
} from 'lucide-react';
import { CryptoDirection, MarginMode, TradePlanExportData } from '../../types';
import { calculateCryptoLiquidation } from '../../utils/calculations';
import { formatUsdt, formatPercent, formatTokenPrice } from '../../utils/formatters';
import { RiskGauge } from '../common/RiskGauge';
import { TradePlanShareModal } from '../common/TradePlanShareModal';
import { SymbolSelector } from '../common/SymbolSelector';
import { POPULAR_SYMBOLS, CryptoSymbolInfo } from '../../data/symbols';
import { useBinancePrice } from '../../hooks/useBinancePrice';

interface CryptoLiquidationCardProps {
  onSaveHistory?: (item: any) => void;
}

export const CryptoLiquidationCard: React.FC<CryptoLiquidationCardProps> = () => {
  const [currentSymbol, setCurrentSymbol] = useState<CryptoSymbolInfo>(POPULAR_SYMBOLS[0]);
  const [direction, setDirection] = useState<CryptoDirection>('long');
  const [marginMode, setMarginMode] = useState<MarginMode>('isolated');
  const [leverage, setLeverage] = useState<number>(20);
  const [entryPrice, setEntryPrice] = useState<number>(65400);
  const [margin, setMargin] = useState<number>(500);
  const [extraBalance, setExtraBalance] = useState<number>(1000);
  const [mmrRate, setMmrRate] = useState<number>(0.4); // 0.4%
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLiveSync, setIsLiveSync] = useState<boolean>(true);

  // Hook for Binance Real-time WebSocket Stream
  const {
    price: livePrice,
    priceDirection,
    isWsConnected,
    symbolInfo,
  } = useBinancePrice(currentSymbol.symbol, { autoRefresh: true });

  const safeDecimals = currentSymbol?.decimals ?? symbolInfo?.decimals ?? 2;

  // Real-time synchronization of Entry Price with WebSocket tick
  useEffect(() => {
    if (isLiveSync && livePrice > 0) {
      setEntryPrice(livePrice);
    }
  }, [livePrice, isLiveSync]);

  // Leverage quick presets matching prompt: x10, x20, x50, x100, x125
  const leveragePresets = [5, 10, 20, 50, 75, 100, 125];

  const result = useMemo(() => {
    return calculateCryptoLiquidation({
      direction,
      entryPrice,
      leverage,
      margin,
      marginMode,
      extraBalance: marginMode === 'cross' ? extraBalance : 0,
      mmrRate: mmrRate / 100,
    });
  }, [direction, entryPrice, leverage, margin, marginMode, extraBalance, mmrRate]);

  // Handle symbol change
  const handleSelectSymbol = (newSymbol: CryptoSymbolInfo) => {
    setCurrentSymbol(newSymbol);
    if (newSymbol.defaultPrice) {
      setEntryPrice(newSymbol.defaultPrice);
    }
  };

  const handleCopy = () => {
    const text = `[Tính Giá Cháy Futures] ${currentSymbol?.displayName || 'BTC/USDT'} ${direction.toUpperCase()} ${leverage}x | Entry: $${formatTokenPrice(entryPrice, safeDecimals)} -> Giá Cháy: $${formatTokenPrice(result?.liquidationPrice ?? 0, safeDecimals)} (Cách ${formatPercent(result?.distancePercent ?? 0, false)}) | Rủi ro: ${result?.riskLabel || 'An toàn'}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tradePlanData: TradePlanExportData = {
    pair: currentSymbol?.displayName || 'BTC/USDT',
    marketType: 'crypto',
    direction,
    leverage: leverage || 1,
    entryPrice: entryPrice || 0,
    stopLossPrice: direction === 'long' 
      ? +((entryPrice || 0) * 0.96).toFixed(safeDecimals) 
      : +((entryPrice || 0) * 1.04).toFixed(safeDecimals),
    takeProfitPrice: direction === 'long' 
      ? +((entryPrice || 0) * 1.08).toFixed(safeDecimals) 
      : +((entryPrice || 0) * 0.92).toFixed(safeDecimals),
    liquidationPrice: result?.liquidationPrice || 0,
    riskRewardRatio: 2.0,
    positionSize: `${(result?.positionSizeCoins ?? 0).toFixed(4)} ${currentSymbol?.baseAsset || 'COIN'} ($${(result?.notionalValueUsdt ?? 0).toLocaleString()})`,
    riskAmount: `$${margin || 0} (${leverage || 1}x)`,
    watermark: 'TRADING CALC PRO',
  };

  return (
    <div id="crypto-liquidation-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F6465D]/10 text-[#F6465D] border border-[#F6465D]/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Tính Giá Cháy (Liquidation Price)
              </h3>
              <p className="text-xs text-[#848E9C]">
                Chuẩn công thức Binance Futures • Đòn bẩy x1 &rarr; x125
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="export-liq-image-btn"
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1 text-xs text-[#0ECB81] hover:text-white px-2.5 py-1 rounded-lg bg-[#0ECB81]/10 border border-[#0ECB81]/30 hover:bg-[#0ECB81] hover:text-black font-semibold transition-all"
              title="Xuất ảnh share kế hoạch giao dịch"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Kèo</span>
            </button>

            <button
              id="copy-liq-result-btn"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
              title="Sao chép kết quả"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Symbol Selector Dropdown & Price Badge */}
        <div className="mb-4">
          <SymbolSelector
            selectedSymbol={currentSymbol.symbol}
            onSelectSymbol={handleSelectSymbol}
            onApplyPrice={(livePrice) => setEntryPrice(livePrice)}
            showRangeBar={true}
          />
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          {/* Direction Toggle (Long / Short) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#161A25] rounded-xl border border-[#232936]">
            <button
              id="liq-dir-long"
              type="button"
              onClick={() => setDirection('long')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                direction === 'long'
                  ? 'bg-[#0ECB81] text-black shadow-md shadow-[#0ECB81]/20'
                  : 'text-[#848E9C] hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>LONG (Đánh Lên)</span>
            </button>

            <button
              id="liq-dir-short"
              type="button"
              onClick={() => setDirection('short')}
              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                direction === 'short'
                  ? 'bg-[#F6465D] text-white shadow-md shadow-[#F6465D]/20'
                  : 'text-[#848E9C] hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>SHORT (Đánh Xuống)</span>
            </button>
          </div>

          {/* Margin Mode (Isolated / Cross) */}
          <div className="flex items-center justify-between gap-3 text-xs bg-[#161A25] p-2.5 rounded-xl border border-[#232936]">
            <span className="text-[#848E9C] font-medium">Chế độ Margin:</span>
            <div className="flex gap-1">
              <button
                id="liq-mode-isolated"
                type="button"
                onClick={() => setMarginMode('isolated')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  marginMode === 'isolated'
                    ? 'bg-[#2B313F] text-white border border-[#3E4556]'
                    : 'text-[#848E9C] hover:text-white'
                }`}
              >
                Isolated (Cô lập)
              </button>
              <button
                id="liq-mode-cross"
                type="button"
                onClick={() => setMarginMode('cross')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  marginMode === 'cross'
                    ? 'bg-[#2B313F] text-white border border-[#3E4556]'
                    : 'text-[#848E9C] hover:text-white'
                }`}
              >
                Cross (Toàn phần)
              </button>
            </div>
          </div>

          {/* Leverage Slider (x1 to x125) with Quick Buttons */}
          <div className="space-y-2.5 bg-[#161A25] p-3.5 rounded-xl border border-[#232936]">
            <div className="flex items-center justify-between">
              <label htmlFor="input-leverage-slider" className="text-xs text-[#848E9C] font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#F0B90B]" />
                Đòn bẩy (Leverage):
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#848E9C]">Biên chịu đựng:</span>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  result.distancePercent < 2
                    ? 'bg-[#F6465D]/20 text-[#F6465D] border border-[#F6465D]/40'
                    : result.distancePercent < 5
                    ? 'bg-[#F6465D]/15 text-[#F6465D]'
                    : result.distancePercent <= 10
                    ? 'bg-[#F0B90B]/15 text-[#F0B90B]'
                    : 'bg-[#0ECB81]/15 text-[#0ECB81]'
                }`}>
                  ±{result.distancePercent.toFixed(2)}%
                </span>
                <span className="text-base font-extrabold font-mono text-[#F0B90B]">{leverage}x</span>
              </div>
            </div>

            {/* Slider with Realtime Smooth Drag */}
            <input
              id="input-leverage-slider"
              type="range"
              min="1"
              max="125"
              step="1"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value) || 1)}
              className="w-full h-2.5 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#F0B90B]"
            />

            {/* Quick Presets: x5, x10, x20, x50, x75, x100, x125 */}
            <div className="flex items-center justify-between gap-1 pt-1 overflow-x-auto">
              {leveragePresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setLeverage(preset)}
                  className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all shrink-0 ${
                    leverage === preset
                      ? 'bg-[#F0B90B] text-black shadow-sm'
                      : 'bg-[#232936] text-[#848E9C] hover:text-white hover:bg-[#2B313F]'
                  }`}
                >
                  {preset}x
                </button>
              ))}
            </div>

            {/* Direct Warning Callout: What Binance Hides */}
            <div className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 transition-all ${
              result.distancePercent < 2
                ? 'bg-[#F6465D]/15 border-[#F6465D]/40 text-[#F6465D]'
                : result.distancePercent < 5
                ? 'bg-[#F6465D]/10 border-[#F6465D]/30 text-[#F6465D]'
                : result.distancePercent <= 10
                ? 'bg-[#F0B90B]/10 border-[#F0B90B]/30 text-[#F0B90B]'
                : 'bg-[#0ECB81]/10 border-[#0ECB81]/30 text-[#0ECB81]'
            }`}>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 shrink-0" />
                <span className="font-semibold">
                  Chỉ cần giá đi ngược <span className="underline font-bold font-mono">{result.distancePercent.toFixed(2)}%</span> là cháy sạch tài khoản!
                </span>
              </div>
              <span className="text-[10px] opacity-80 shrink-0 font-mono">
                {leverage}x
              </span>
            </div>
          </div>

          {/* Numeric Inputs: Entry Price & Margin with Token Precision */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <label htmlFor="input-entry-price" className="text-xs text-[#848E9C] font-medium">
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

                {/* Live Sync Toggle */}
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
                  id="input-entry-price"
                  type="number"
                  step={currentSymbol.tickSize || 'any'}
                  value={entryPrice || ''}
                  onChange={(e) => {
                    setIsLiveSync(false); // pause auto-sync when user manually edits
                    setEntryPrice(parseFloat(e.target.value) || 0);
                  }}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none transition-colors"
                  placeholder={currentSymbol.defaultPrice.toString()}
                />
                <span className="absolute right-3 top-2 text-xs text-[#848E9C] font-mono">
                  {currentSymbol.quoteAsset}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="input-margin-usdt" className="text-xs text-[#848E9C] font-medium block mb-1">
                Ký quỹ (Margin):
              </label>
              <div className="relative">
                <input
                  id="input-margin-usdt"
                  type="number"
                  step="any"
                  value={margin || ''}
                  onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none transition-colors"
                  placeholder="500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">USDT</span>
              </div>
            </div>
          </div>

          {/* Extra Balance if Cross */}
          {marginMode === 'cross' && (
            <div>
              <label htmlFor="input-extra-balance" className="text-xs text-[#848E9C] font-medium block mb-1">
                Số dư ví dự phòng (Cross Balance):
              </label>
              <div className="relative">
                <input
                  id="input-extra-balance"
                  type="number"
                  step="any"
                  value={extraBalance || ''}
                  onChange={(e) => setExtraBalance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none transition-colors"
                  placeholder="1000"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">USDT</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Output Results Section */}
      <div className="mt-6 pt-5 border-t border-[#1E232F] space-y-4">
        {/* Main Liquidation Price Highlight */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.riskLevel === 'critical'
            ? 'bg-[#F6465D]/15 border-[#F6465D]/40 text-[#F6465D]'
            : result.riskLevel === 'high'
            ? 'bg-[#F6465D]/10 border-[#F6465D]/30'
            : result.riskLevel === 'moderate'
            ? 'bg-[#F0B90B]/10 border-[#F0B90B]/30'
            : 'bg-[#0ECB81]/10 border-[#0ECB81]/30'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#848E9C]">
              GIÁ THANH LÝ ({currentSymbol?.displayName || 'BTC/USDT'})
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              result?.riskLevel === 'critical' || result?.riskLevel === 'high'
                ? 'bg-[#F6465D]/20 text-[#F6465D] border-[#F6465D]/30'
                : result?.riskLevel === 'moderate'
                ? 'bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/30'
                : 'bg-[#0ECB81]/20 text-[#0ECB81] border-[#0ECB81]/30'
            }`}>
              {result?.riskLabel || 'An toàn'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              ${formatTokenPrice(result?.liquidationPrice ?? 0, safeDecimals)}
            </span>
            <span className="text-xs text-[#848E9C] font-mono">{currentSymbol?.quoteAsset || 'USDT'}</span>
          </div>
        </div>

        {/* Visual Risk Gauge (Semi-circle meter with Safe/Warning/Danger zones) */}
        <RiskGauge
          distancePercent={result?.distancePercent ?? 0}
          entryPrice={entryPrice || 0}
          liquidationPrice={result?.liquidationPrice ?? 0}
        />

        {/* Detailed Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Tổng Vị Thế:</span>
            <span className="font-mono font-bold text-white text-sm">
              ${formatUsdt(result?.notionalValueUsdt ?? 0)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Khối Lượng {currentSymbol?.baseAsset || 'COIN'}:</span>
            <span className="font-mono font-bold text-white text-sm">
              {(result?.positionSizeCoins ?? 0).toFixed(safeDecimals > 4 ? 2 : 4)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936] col-span-2 sm:col-span-1">
            <span className="text-[#848E9C] text-[11px] block">Giá Phá Sản (0 Margin):</span>
            <span className="font-mono font-bold text-[#848E9C] text-sm">
              ${formatTokenPrice(result?.bankruptcyPrice ?? 0, safeDecimals)}
            </span>
          </div>
        </div>

        {/* Leverage vs Safety Buffer Quick Reference Table */}
        <div className="bg-[#161A25] rounded-xl border border-[#232936] p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-[#F0B90B]" />
              Bảng Biên Độ Cháy Theo Đòn Bẩy (Tra cứu nhanh):
            </span>
            <span className="text-[10px] text-[#848E9C]">Click để chọn</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 text-center font-mono">
            {[5, 10, 20, 50, 100, 125].map((lev) => {
              const mmrDec = (mmrRate || 0.4) / 100;
              const bufferPct = Math.max(0.1, (1 / lev - mmrDec) * 100);
              const isSelected = leverage === lev;
              return (
                <button
                  key={lev}
                  type="button"
                  onClick={() => setLeverage(lev)}
                  className={`p-2 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? 'bg-[#F0B90B]/15 border-[#F0B90B] text-white shadow-sm ring-1 ring-[#F0B90B]'
                      : 'bg-[#0B0E14] border-[#232936] hover:border-[#384152] text-[#848E9C] hover:text-white'
                  }`}
                >
                  <div className={`font-bold text-xs ${isSelected ? 'text-[#F0B90B]' : 'text-white'}`}>
                    {lev}x
                  </div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${
                    bufferPct < 2
                      ? 'text-[#F6465D]'
                      : bufferPct < 5
                      ? 'text-[#F6465D]'
                      : bufferPct <= 10
                      ? 'text-[#F0B90B]'
                      : 'text-[#0ECB81]'
                  }`}>
                    ±{bufferPct.toFixed(1)}%
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#848E9C] text-center pt-0.5">
            * Càng tăng đòn bẩy, biên an toàn càng teo nhỏ. Đòn bẩy x50 chỉ chịu được rung lắc &lt; 2%.
          </p>
        </div>
      </div>

      {/* Share Modal */}
      <TradePlanShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        defaultData={tradePlanData}
      />
    </div>
  );
};
