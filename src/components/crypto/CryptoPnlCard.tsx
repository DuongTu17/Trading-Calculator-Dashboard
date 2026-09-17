import React, { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Copy, 
  Check, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw,
  BadgePercent,
  ShieldCheck,
  Info,
  Zap
} from 'lucide-react';
import { CryptoDirection } from '../../types';
import { calculateCryptoPnl } from '../../utils/calculations';
import { formatUsdt, formatVnd, formatPercent, formatTokenPrice } from '../../utils/formatters';
import { SymbolSelector } from '../common/SymbolSelector';
import { POPULAR_SYMBOLS, CryptoSymbolInfo } from '../../data/symbols';
import { useBinancePrice } from '../../hooks/useBinancePrice';
import { PriceRange24hBar } from '../common/PriceRange24hBar';

interface CryptoPnlCardProps {
  p2pRate: number;
  onUpdateP2pRate: (rate: number) => void;
}

export const CryptoPnlCard: React.FC<CryptoPnlCardProps> = ({ p2pRate, onUpdateP2pRate }) => {
  const [currentSymbol, setCurrentSymbol] = useState<CryptoSymbolInfo>(POPULAR_SYMBOLS[0]);
  const [direction, setDirection] = useState<CryptoDirection>('long');
  const [margin, setMargin] = useState<number>(500);
  const [leverage, setLeverage] = useState<number>(20);
  const [entryPrice, setEntryPrice] = useState<number>(65400);
  const [exitPrice, setExitPrice] = useState<number>(68500);
  const [openFeeType, setOpenFeeType] = useState<'taker' | 'maker'>('taker');
  const [closeFeeType, setCloseFeeType] = useState<'taker' | 'maker'>('taker');
  const [localP2pRate, setLocalP2pRate] = useState<number>(p2pRate);
  const [copied, setCopied] = useState(false);
  const [isLiveEntrySync, setIsLiveEntrySync] = useState(false);

  // Hook for Binance Real-time WebSocket Stream
  const {
    price: livePrice,
    high24h,
    low24h,
    change24h,
    priceDirection,
    isWsConnected,
    symbolInfo,
  } = useBinancePrice(currentSymbol.symbol, { autoRefresh: true });

  const safeDecimals = currentSymbol?.decimals ?? symbolInfo?.decimals ?? 2;

  // Real-time synchronization of Entry Price when toggled
  useEffect(() => {
    if (isLiveEntrySync && livePrice > 0) {
      setEntryPrice(livePrice);
    }
  }, [livePrice, isLiveEntrySync]);

  const result = useMemo(() => {
    return calculateCryptoPnl({
      direction,
      margin,
      leverage,
      entryPrice,
      exitPrice,
      p2pRate: localP2pRate,
      openFeeType,
      closeFeeType,
    });
  }, [direction, margin, leverage, entryPrice, exitPrice, localP2pRate, openFeeType, closeFeeType]);

  // Real-time Unrealized PnL based on livePrice (lastPrice)
  const unrealizedResult = useMemo(() => {
    if (!livePrice || !entryPrice || entryPrice <= 0) return null;
    return calculateCryptoPnl({
      direction,
      margin,
      leverage,
      entryPrice,
      exitPrice: livePrice,
      p2pRate: localP2pRate,
      openFeeType,
      closeFeeType,
    });
  }, [direction, margin, leverage, entryPrice, livePrice, localP2pRate, openFeeType, closeFeeType]);

  const handleSelectSymbol = (newSymbol: CryptoSymbolInfo) => {
    if (!newSymbol) return;
    setCurrentSymbol(newSymbol);
    if (newSymbol.defaultPrice) {
      setEntryPrice(newSymbol.defaultPrice);
      const dec = newSymbol.decimals ?? 2;
      // Auto-set exit price at +5% for Long or -5% for Short
      const autoExit = direction === 'long' 
        ? +(newSymbol.defaultPrice * 1.05).toFixed(dec)
        : +(newSymbol.defaultPrice * 0.95).toFixed(dec);
      setExitPrice(autoExit);
    }
  };

  const handleApplyPrice = (livePrice: number) => {
    if (typeof livePrice !== 'number' || isNaN(livePrice) || livePrice <= 0) return;
    setEntryPrice(livePrice);
    const dec = currentSymbol?.decimals ?? 2;
    const autoExit = direction === 'long' 
      ? +(livePrice * 1.05).toFixed(dec)
      : +(livePrice * 0.95).toFixed(dec);
    setExitPrice(autoExit);
  };

  const handleSyncP2p = (rate: number) => {
    setLocalP2pRate(rate);
    onUpdateP2pRate(rate);
  };

  const handleCopy = () => {
    const isProfit = result?.isProfit ?? false;
    const pnlSign = isProfit ? '+' : '';
    const text = `[Binance Net PnL & P2P ${currentSymbol?.displayName || 'BTC/USDT'}] ${direction.toUpperCase()} ${leverage}x | Entry: $${formatTokenPrice(entryPrice, safeDecimals)} -> Exit: $${formatTokenPrice(exitPrice, safeDecimals)} | Phí sàn: $${formatUsdt(result?.totalFeeUsdt ?? 0)} -> Lãi/Lỗ RÒNG: ${pnlSign}$${formatUsdt(result?.netPnlUsdt ?? 0)} USDT (~${pnlSign}${formatVnd(result?.netPnlVnd ?? 0)} VNĐ @ ${formatVnd(localP2pRate)}) | ROE Ròng: ${formatPercent(result?.netRoePercent ?? 0, true)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="crypto-pnl-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Binance Fee & Net PnL (Lãi Thực Nhận)
              </h3>
              <p className="text-xs text-[#848E9C]">
                Tự trừ phí Taker/Maker 2 chiều & Quy đổi tiền mặt VNĐ theo tỷ giá P2P
              </p>
            </div>
          </div>

          <button
            id="copy-pnl-btn"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Realtime Symbol Selector Dropdown */}
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
            onClick={() => setDirection('long')}
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
            onClick={() => setDirection('short')}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-pnl-margin" className="text-xs text-[#848E9C] font-medium block mb-1">
                Ký Quỹ (Margin):
              </label>
              <div className="relative">
                <input
                  id="input-pnl-margin"
                  type="number"
                  value={margin || ''}
                  onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                  placeholder="500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">USDT</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-[#848E9C] font-medium">Đòn Bẩy:</span>
                <span className="text-[#F0B90B] font-mono font-bold">{leverage}x</span>
              </div>
              <input
                id="input-pnl-leverage"
                type="range"
                min="1"
                max="125"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value) || 1)}
                className="w-full h-2 mt-2 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#F0B90B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <label htmlFor="input-pnl-entry" className="text-xs text-[#848E9C] font-medium">
                    Giá Entry:
                  </label>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all duration-300 ${
                      priceDirection === 'up'
                        ? 'bg-[#0ECB81]/20 text-[#0ECB81]'
                        : priceDirection === 'down'
                        ? 'bg-[#F6465D]/20 text-[#F6465D]'
                        : 'bg-[#161A25] text-[#848E9C]'
                    }`}
                  >
                    <span>{priceDirection === 'down' ? '🔴' : '🟢'} ${formatTokenPrice(livePrice, safeDecimals)}</span>
                  </span>
                </div>
                
                {/* Auto-sync or manual apply */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isLiveEntrySync;
                      setIsLiveEntrySync(next);
                      if (next && livePrice > 0) setEntryPrice(livePrice);
                    }}
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition-all flex items-center gap-0.5 ${
                      isLiveEntrySync
                        ? 'bg-[#0ECB81] text-black font-bold shadow-sm'
                        : 'bg-[#1C212E] text-[#848E9C] hover:text-white border border-[#232936]'
                    }`}
                    title={isLiveEntrySync ? 'Đang tự động khớp giá Live thời gian thực' : 'Bật tự động khớp giá Live'}
                  >
                    <Zap className="w-2.5 h-2.5" />
                    <span>{isLiveEntrySync ? 'Sync: BẬT' : 'Sync: TẮT'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLiveEntrySync(false);
                      if (livePrice > 0) setEntryPrice(livePrice);
                    }}
                    className="text-[10px] font-mono text-[#0ECB81] hover:underline"
                    title="Điền giá Live hiện tại vào Entry một lần"
                  >
                    Lấy giá
                  </button>
                </div>
              </div>
              <div className="relative">
                <input
                  id="input-pnl-entry"
                  type="number"
                  step={currentSymbol.tickSize || 'any'}
                  value={entryPrice || ''}
                  onChange={(e) => {
                    setIsLiveEntrySync(false);
                    setEntryPrice(parseFloat(e.target.value) || 0);
                  }}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none"
                  placeholder="65000"
                />
                <span className="absolute right-3 top-2 text-xs text-[#848E9C] font-mono">
                  {currentSymbol.quoteAsset}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="input-pnl-exit" className="text-xs text-[#848E9C] font-medium">
                  Giá Exit ({currentSymbol.displayName}):
                </label>
                <button
                  type="button"
                  onClick={() => livePrice > 0 && setExitPrice(livePrice)}
                  className="text-[10px] font-mono text-[#F0B90B] hover:text-white px-1.5 py-0.5 rounded bg-[#F0B90B]/10 hover:bg-[#F0B90B] hover:text-black font-semibold transition-all flex items-center gap-0.5"
                  title="Khớp giá thị trường hiện tại để xem PnL thả nổi tức thì"
                >
                  <Zap className="w-2.5 h-2.5" />
                  <span>Chốt Giá Live</span>
                </button>
              </div>
              <div className="relative">
                <input
                  id="input-pnl-exit"
                  type="number"
                  step={currentSymbol.tickSize || 'any'}
                  value={exitPrice || ''}
                  onChange={(e) => setExitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2 text-sm font-mono text-white focus:outline-none"
                  placeholder="68500"
                />
                <span className="absolute right-3 top-2 text-xs text-[#848E9C] font-mono">
                  {currentSymbol.quoteAsset}
                </span>
              </div>
            </div>
          </div>

          {/* 24h High/Low Reference Bar */}
          <PriceRange24hBar
            low24h={low24h}
            high24h={high24h}
            currentPrice={livePrice}
            decimals={safeDecimals}
            quoteAsset={currentSymbol.quoteAsset}
            onSetStopLoss={(price) => setEntryPrice(price)}
            onSetTakeProfit={(price) => setExitPrice(price)}
          />

          {/* Fee Configuration: Open & Close Orders */}
          <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936] space-y-2">
            <div className="flex items-center justify-between text-xs text-[#848E9C]">
              <span className="font-semibold text-white flex items-center gap-1">
                <BadgePercent className="w-3.5 h-3.5 text-[#F0B90B]" />
                Phí Sàn Binance Futures:
              </span>
              <span className="font-mono text-[#F0B90B]">
                Mở {openFeeType === 'taker' ? '0.05%' : '0.02%'} + Đóng {closeFeeType === 'taker' ? '0.05%' : '0.02%'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-[#0B0E14] p-2 rounded-lg border border-[#232936]">
                <span className="text-[#848E9C]">Lệnh Mở:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setOpenFeeType('taker')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      openFeeType === 'taker' ? 'bg-[#F0B90B] text-black font-bold' : 'text-[#848E9C]'
                    }`}
                  >
                    Taker (0.05%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenFeeType('maker')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      openFeeType === 'maker' ? 'bg-[#F0B90B] text-black font-bold' : 'text-[#848E9C]'
                    }`}
                  >
                    Maker (0.02%)
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#0B0E14] p-2 rounded-lg border border-[#232936]">
                <span className="text-[#848E9C]">Lệnh Đóng:</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setCloseFeeType('taker')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      closeFeeType === 'taker' ? 'bg-[#F0B90B] text-black font-bold' : 'text-[#848E9C]'
                    }`}
                  >
                    Taker (0.05%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCloseFeeType('maker')}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                      closeFeeType === 'maker' ? 'bg-[#F0B90B] text-black font-bold' : 'text-[#848E9C]'
                    }`}
                  >
                    Maker (0.02%)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* P2P Exchange Rate Inline Bar */}
          <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#848E9C] font-medium">Tỷ Giá P2P (USDT / VNĐ):</span>
              <span className="font-mono text-[#0ECB81] font-bold">{formatVnd(localP2pRate)}</span>
            </div>
            <div className="flex gap-2">
              <input
                id="input-p2p-inline"
                type="number"
                step="50"
                value={localP2pRate}
                onChange={(e) => handleSyncP2p(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0B0E14] border border-[#232936] focus:border-[#0ECB81] rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                placeholder="25450"
              />
              <button
                type="button"
                onClick={() => handleSyncP2p(25450)}
                className="px-2.5 py-1 text-[11px] rounded bg-[#232936] text-[#848E9C] hover:text-white"
              >
                Mặc định
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Results */}
      <div className="mt-6 pt-5 border-t border-[#1E232F] space-y-4">
        {/* Real-Time Unrealized PnL Card based on lastPrice (Live Binance Stream) */}
        {unrealizedResult && livePrice > 0 && (
          <div className="p-3.5 rounded-xl bg-[#161A25] border border-[#2B313F] space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#0ECB81]" />
                  <span>PnL Thả Nổi Real-Time (Giá Live ${formatTokenPrice(livePrice, safeDecimals)}):</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    priceDirection === 'up'
                      ? 'bg-[#0ECB81]/25 text-[#0ECB81]'
                      : priceDirection === 'down'
                      ? 'bg-[#F6465D]/25 text-[#F6465D]'
                      : 'bg-[#232936] text-[#848E9C]'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isWsConnected ? 'bg-[#0ECB81] animate-ping' : 'bg-[#F0B90B]'}`} />
                  <span>{unrealizedResult.isProfit ? '🟢 ĐANG LÃI' : '🔴 ĐANG ÂM'}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                  unrealizedResult.isProfit
                    ? 'bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30'
                    : 'bg-[#F6465D]/15 text-[#F6465D] border border-[#F6465D]/30'
                }`}>
                  ROE: {formatPercent(unrealizedResult.netRoePercent, true)}
                </span>
                <button
                  type="button"
                  onClick={() => setExitPrice(livePrice)}
                  className="text-[10px] font-mono text-[#F0B90B] hover:text-white px-2 py-0.5 rounded bg-[#F0B90B]/10 hover:bg-[#F0B90B] hover:text-black font-semibold transition-all"
                  title="Gán giá Live này làm mục tiêu chốt lệnh"
                >
                  Chốt tại giá này
                </button>
              </div>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div className="flex items-baseline gap-2">
                <span className={`text-xl sm:text-2xl font-extrabold font-mono tracking-tight ${
                  unrealizedResult.isProfit ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                }`}>
                  {unrealizedResult.isProfit ? '+' : ''}${formatUsdt(unrealizedResult.netPnlUsdt)}
                </span>
                <span className="text-xs font-mono text-[#848E9C]">USDT</span>
              </div>
              <span className={`font-mono font-bold text-sm sm:text-base ${
                unrealizedResult.isProfit ? 'text-[#0ECB81]' : 'text-[#F6465D]'
              }`}>
                {unrealizedResult.isProfit ? '+' : ''}{formatVnd(unrealizedResult.netPnlVnd)}
              </span>
            </div>
          </div>
        )}

        {/* Main Net PnL Card (Highlighting real cash return at Target Exit) */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.isProfit
            ? 'bg-[#0ECB81]/15 border-[#0ECB81]/40'
            : 'bg-[#F6465D]/15 border-[#F6465D]/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0ECB81]" />
              LÃI/LỖ RÒNG THỰC NHẬN (ĐÃ TRỪ PHÍ)
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              result.isProfit
                ? 'bg-[#0ECB81]/20 text-[#0ECB81] border-[#0ECB81]/30'
                : 'bg-[#F6465D]/20 text-[#F6465D] border-[#F6465D]/30'
            }`}>
              ROE Ròng: {formatPercent(result.netRoePercent, true)}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
              result.isProfit ? 'text-[#0ECB81]' : 'text-[#F6465D]'
            }`}>
              {result.isProfit ? '+' : ''}${formatUsdt(result.netPnlUsdt)}
            </span>
            <span className="text-xs font-mono text-[#848E9C]">USDT</span>
          </div>

          {/* VNĐ Equivalent */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-white font-medium">Tiền mặt VNĐ thực nhận (P2P):</span>
            <span className={`font-mono font-extrabold text-base sm:text-lg ${
              result.isProfit ? 'text-[#0ECB81]' : 'text-[#F6465D]'
            }`}>
              {result.isProfit ? '+' : ''}{formatVnd(result.netPnlVnd)}
            </span>
          </div>
        </div>

        {/* Binance vs Real Comparison Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Lãi/Lỗ Gộp (Binance):</span>
            <span className={`font-mono font-bold text-sm ${result.grossPnlUsdt >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
              {result.grossPnlUsdt >= 0 ? '+' : ''}${formatUsdt(result.grossPnlUsdt)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Tổng Phí Sàn Thu:</span>
            <span className="font-mono font-bold text-[#F6465D] text-sm">
              -${formatUsdt(result.totalFeeUsdt)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Giá Hòa Vốn (Breakeven):</span>
            <span className="font-mono font-bold text-[#F0B90B] text-sm">
              ${formatTokenPrice(result.breakevenExitPrice, safeDecimals)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Tổng Vốn Sau Lệnh:</span>
            <span className="font-mono font-bold text-white text-sm">
              ${formatUsdt(result.totalReturnUsdt)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-[#848E9C]">
          * Binance chỉ hiển thị Lãi/Lỗ gộp trên màn hình. App này tự trừ phí mở ${formatUsdt(result.openFeeUsdt)} + phí đóng ${formatUsdt(result.closeFeeUsdt)} để tính đúng số tiền thực sự vào ví bạn.
        </p>
      </div>
    </div>
  );
};
