import React, { useState, useMemo, useEffect } from 'react';
import { 
  BadgePercent, 
  Coins, 
  Clock, 
  Copy, 
  Check, 
  HelpCircle,
  Sliders,
  Calendar,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Info,
  Zap,
  Radio
} from 'lucide-react';
import { calculateFuturesFee, calculateFundingMultiPeriod } from '../../utils/calculations';
import { formatUsdt, formatPercent, formatVnd } from '../../utils/formatters';
import { CryptoDirection } from '../../types';
import { SymbolSelector } from '../common/SymbolSelector';
import { POPULAR_SYMBOLS, CryptoSymbolInfo } from '../../data/symbols';
import { useBinancePrice } from '../../hooks/useBinancePrice';

interface CryptoFeeCardProps {
  p2pRate?: number;
}

export const CryptoFeeCard: React.FC<CryptoFeeCardProps> = ({ p2pRate = 25450 }) => {
  const [currentSymbol, setCurrentSymbol] = useState<CryptoSymbolInfo>(POPULAR_SYMBOLS[0]);
  const [direction, setDirection] = useState<CryptoDirection>('long');
  const [margin, setMargin] = useState<number>(300);
  const [leverage, setLeverage] = useState<number>(20);
  const [orderType, setOrderType] = useState<'taker' | 'maker' | 'custom'>('taker');
  const [customRate, setCustomRate] = useState<number>(0.05);
  const [fundingRate, setFundingRate] = useState<number>(0.01); // 0.01% per 8h
  const [fundingPeriods, setFundingPeriods] = useState<number>(1); // e.g. 1 cycle (8h)
  const [copied, setCopied] = useState(false);
  const [isLiveFundingSync, setIsLiveFundingSync] = useState<boolean>(true);

  // Hook for Binance Real-time WebSocket & Futures stream
  const {
    fundingRate: liveFundingRate,
    nextFundingTime,
    isWsConnected,
    isLive,
    symbolInfo,
  } = useBinancePrice(currentSymbol.symbol, { autoRefresh: true });

  // Auto-bind real-time funding rate when live sync is enabled
  useEffect(() => {
    if (isLiveFundingSync && typeof liveFundingRate === 'number' && !isNaN(liveFundingRate)) {
      setFundingRate(+liveFundingRate.toFixed(4));
    }
  }, [liveFundingRate, isLiveFundingSync]);

  const activeFeeRate = orderType === 'taker' ? 0.05 : orderType === 'maker' ? 0.02 : customRate;

  const feeResult = useMemo(() => {
    return calculateFuturesFee({
      margin,
      leverage,
      orderType,
      feeRate: activeFeeRate,
      fundingRate,
      fundingPeriods,
    });
  }, [margin, leverage, orderType, activeFeeRate, fundingRate, fundingPeriods]);

  const multiFundingResult = useMemo(() => {
    return calculateFundingMultiPeriod({
      margin,
      leverage,
      fundingRate,
      direction,
      p2pRate,
    });
  }, [margin, leverage, fundingRate, direction, p2pRate]);

  const handleCopy = () => {
    const text = `[Phí Futures & Funding Rate] Vị thế: $${formatUsdt(feeResult.notionalValue)} (${margin}$ x ${leverage}x, ${direction.toUpperCase()}) | Funding Rate: ${fundingRate}% / 8h -> Sau 8h: $${formatUsdt(multiFundingResult.fee8h)} (~${formatVnd(multiFundingResult.fee8hVnd ?? 0)}) | Sau 24h: $${formatUsdt(multiFundingResult.fee24h)} (~${formatVnd(multiFundingResult.fee24hVnd ?? 0)}) | Sau 7 ngày: $${formatUsdt(multiFundingResult.fee7d)} (~${formatVnd(multiFundingResult.fee7dVnd ?? 0)}) [${multiFundingResult.actionType === 'pay' ? 'PHẢI TRẢ' : 'ĐƯỢC NHẬN'}]`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPaying = multiFundingResult.actionType === 'pay';

  return (
    <div id="crypto-fee-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20">
              <BadgePercent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Funding Rate Cost Forecast (8h • 24h • 7d)
              </h3>
              <p className="text-xs text-[#848E9C]">
                Dự tính chính xác chi phí gồng vị thế Futures bằng USDT & VNĐ
              </p>
            </div>
          </div>

          <button
            id="copy-fee-btn"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Symbol Selector to fetch Real-time Binance Futures Funding Rate */}
        <div className="mb-4">
          <SymbolSelector
            selectedSymbol={currentSymbol.symbol}
            onSelectSymbol={(sym) => setCurrentSymbol(sym)}
            showRangeBar={false}
          />
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Direction toggle for accurate pay/receive funding */}
          <div className="flex items-center justify-between gap-3 text-xs bg-[#161A25] p-2.5 rounded-xl border border-[#232936]">
            <span className="text-[#848E9C] font-medium">Vị thế đang nắm giữ:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setDirection('long')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  direction === 'long'
                    ? 'bg-[#0ECB81] text-black shadow-sm'
                    : 'text-[#848E9C] hover:text-white'
                }`}
              >
                LONG (Mua Lên)
              </button>
              <button
                type="button"
                onClick={() => setDirection('short')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  direction === 'short'
                    ? 'bg-[#F6465D] text-white shadow-sm'
                    : 'text-[#848E9C] hover:text-white'
                }`}
              >
                SHORT (Bán Khống)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-fee-margin" className="text-xs text-[#848E9C] font-medium block mb-1">
                Ký Quỹ (Margin):
              </label>
              <div className="relative">
                <input
                  id="input-fee-margin"
                  type="number"
                  value={margin || ''}
                  onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#F0B90B] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                  placeholder="300"
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
                id="input-fee-leverage"
                type="range"
                min="1"
                max="125"
                value={leverage}
                onChange={(e) => setLeverage(parseInt(e.target.value) || 1)}
                className="w-full h-2.5 mt-2 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#F0B90B]"
              />
              <div className="flex justify-between text-[10px] text-[#848E9C] pt-1">
                <span>Vị thế: <strong className="text-white font-mono">${formatUsdt(margin * leverage)}</strong></span>
                <span>{leverage}x</span>
              </div>
            </div>
          </div>

          {/* Fee Type Buttons */}
          <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936] space-y-2">
            <label className="text-xs text-[#848E9C] font-medium block">
              Loại Lệnh Mở/Đóng (Trading Fee):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setOrderType('taker')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
                  orderType === 'taker'
                    ? 'bg-[#F0B90B] text-black font-bold shadow-sm'
                    : 'bg-[#0B0E14] text-[#848E9C] hover:text-white border border-[#232936]'
                }`}
              >
                <div>Taker (Khớp Ngay)</div>
                <div className="text-[10px] opacity-80">0.05%</div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('maker')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
                  orderType === 'maker'
                    ? 'bg-[#F0B90B] text-black font-bold shadow-sm'
                    : 'bg-[#0B0E14] text-[#848E9C] hover:text-white border border-[#232936]'
                }`}
              >
                <div>Maker (Lệnh Chờ)</div>
                <div className="text-[10px] opacity-80">0.02%</div>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('custom')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
                  orderType === 'custom'
                    ? 'bg-[#F0B90B] text-black font-bold shadow-sm'
                    : 'bg-[#0B0E14] text-[#848E9C] hover:text-white border border-[#232936]'
                }`}
              >
                <div>Tùy chỉnh</div>
                <div className="text-[10px] opacity-80">{customRate}%</div>
              </button>
            </div>
          </div>

          {/* Funding Rate Input with Real Market Presets */}
          <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936] space-y-2.5">
            <div className="flex items-center justify-between text-xs flex-wrap gap-1.5">
              <div className="flex items-center gap-2">
                <label htmlFor="input-funding-rate" className="text-[#848E9C] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00B4D8]" />
                  Tỷ lệ Funding Rate (% / 8h):
                </label>
                {/* Live Binance Futures Funding Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                    liveFundingRate > 0
                      ? 'bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30'
                      : liveFundingRate < 0
                      ? 'bg-[#F6465D]/15 text-[#F6465D] border border-[#F6465D]/30'
                      : 'bg-[#232936] text-[#848E9C]'
                  }`}
                  title="Tỷ lệ Funding Rate thời gian thực từ Binance Futures"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isWsConnected ? 'bg-[#0ECB81] animate-ping' : 'bg-[#F0B90B]'}`} />
                  <span>LIVE: {liveFundingRate > 0 ? '+' : ''}{liveFundingRate?.toFixed(4)}%</span>
                </span>
              </div>

              {/* Sync Toggle Button */}
              <button
                type="button"
                onClick={() => {
                  const nextSync = !isLiveFundingSync;
                  setIsLiveFundingSync(nextSync);
                  if (nextSync && typeof liveFundingRate === 'number') {
                    setFundingRate(+liveFundingRate.toFixed(4));
                  }
                }}
                className={`text-[9px] font-mono px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                  isLiveFundingSync
                    ? 'bg-[#F0B90B] text-black font-bold shadow-sm'
                    : 'bg-[#1C212E] text-[#848E9C] hover:text-white border border-[#232936]'
                }`}
                title={isLiveFundingSync ? 'Đang tự động cập nhật theo Binance' : 'Bấm để tự động điền Funding Live'}
              >
                <Zap className="w-2.5 h-2.5" />
                <span>{isLiveFundingSync ? 'Sync Live: BẬT' : 'Sync: TẮT'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                id="input-funding-rate"
                type="number"
                step="0.0001"
                value={fundingRate}
                onChange={(e) => {
                  setIsLiveFundingSync(false); // pause auto-sync when manual typing
                  setFundingRate(parseFloat(e.target.value) || 0);
                }}
                className="w-full bg-[#0B0E14] border border-[#232936] focus:border-[#F0B90B] rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none"
                placeholder="0.01"
              />
              <span className="absolute right-3 top-2 text-xs text-[#848E9C] font-mono">% / 8h</span>
            </div>

            {nextFundingTime && (
              <div className="text-[10px] text-[#848E9C] font-mono flex items-center justify-between">
                <span>Kỳ tính phí tiếp theo:</span>
                <span className="text-[#F0B90B] font-semibold">
                  {nextFundingTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (UTC+7)
                </span>
              </div>
            )}

            {/* Quick Market Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsLiveFundingSync(false);
                  setFundingRate(0.01);
                }}
                className={`py-1 px-2 text-[11px] rounded border transition-all ${
                  fundingRate === 0.01 && !isLiveFundingSync
                    ? 'bg-[#F0B90B] text-black font-bold border-[#F0B90B]' 
                    : 'bg-[#0B0E14] border-[#232936] text-[#848E9C] hover:text-white'
                }`}
              >
                Chuẩn (+0.01%)
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsLiveFundingSync(false);
                  setFundingRate(0.05);
                }}
                className={`py-1 px-2 text-[11px] rounded border transition-all ${
                  fundingRate === 0.05 && !isLiveFundingSync
                    ? 'bg-[#0ECB81] text-black font-bold border-[#0ECB81]' 
                    : 'bg-[#0B0E14] border-[#232936] text-[#848E9C] hover:text-white'
                }`}
              >
                Bullish (+0.05%)
              </button>

              <button
                type="button"
                onClick={() => setFundingRate(0.1)}
                className={`py-1 px-2 text-[11px] rounded border transition-all ${
                  fundingRate === 0.1 
                    ? 'bg-[#F0B90B] text-black font-bold border-[#F0B90B]' 
                    : 'bg-[#0B0E14] border-[#232936] text-[#848E9C] hover:text-white'
                }`}
              >
                Cực đoan (+0.10%)
              </button>

              <button
                type="button"
                onClick={() => setFundingRate(-0.03)}
                className={`py-1 px-2 text-[11px] rounded border transition-all ${
                  fundingRate === -0.03 
                    ? 'bg-[#F6465D] text-white font-bold border-[#F6465D]' 
                    : 'bg-[#0B0E14] border-[#232936] text-[#848E9C] hover:text-white'
                }`}
              >
                Panic (-0.03%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Output Results */}
      <div className="mt-6 pt-5 border-t border-[#1E232F] space-y-4">
        {/* Total Fee Highlight */}
        <div className="p-4 rounded-xl bg-[#F0B90B]/10 border border-[#F0B90B]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#848E9C] uppercase tracking-wider">
              TỔNG CHI PHÍ GIAO DỊCH 2 CHIỀU (MỞ + ĐÓNG)
            </span>
            <span className="text-xs font-mono font-bold text-[#F0B90B]">
              Vị thế: ${formatUsdt(feeResult.notionalValue)}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              ${formatUsdt(feeResult.roundTripTradingFee)}
            </span>
            <span className="text-xs font-mono text-[#848E9C]">USDT</span>
            <span className="text-xs text-[#848E9C] ml-auto">
              (~{formatVnd(feeResult.roundTripTradingFee * (p2pRate || 25450))})
            </span>
          </div>

          <div className="mt-2 text-xs text-[#848E9C]">
            Phí mở: ${formatUsdt(feeResult.openFee)} + Phí đóng: ${formatUsdt(feeResult.closeFee)}
          </div>
        </div>

        {/* Multi-Period Funding Projections (8h, 24h, 7 Days) with VND */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-semibold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00B4D8]" />
              Dự Báo Chi Phí Funding Theo Thời Gian Gồng Vị Thế:
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
              isPaying
                ? 'bg-[#F6465D]/15 text-[#F6465D] border-[#F6465D]/30'
                : 'bg-[#0ECB81]/15 text-[#0ECB81] border-[#0ECB81]/30'
            }`}>
              {isPaying ? '💸 BẠN PHẢI TRẢ' : '💰 BẠN ĐƯỢC NHẬN'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {/* 8 Hours */}
            <div className="p-3 rounded-xl bg-[#161A25] border border-[#232936] text-center space-y-1">
              <span className="text-[11px] text-[#848E9C] block">Sau 8 Giờ (1 phiên)</span>
              <span className={`font-mono font-extrabold text-base block ${isPaying ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>
                {isPaying ? '-' : '+'}${formatUsdt(multiFundingResult.fee8h)}
              </span>
              <span className="text-[10px] text-[#848E9C] font-mono block">
                {isPaying ? '-' : '+'}{formatVnd(multiFundingResult.fee8hVnd ?? 0)}
              </span>
            </div>

            {/* 24 Hours */}
            <div className="p-3 rounded-xl bg-[#161A25] border border-[#232936] text-center space-y-1">
              <span className="text-[11px] text-[#848E9C] block">Sau 24 Giờ (3 phiên)</span>
              <span className={`font-mono font-extrabold text-base block ${isPaying ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>
                {isPaying ? '-' : '+'}${formatUsdt(multiFundingResult.fee24h)}
              </span>
              <span className="text-[10px] text-[#848E9C] font-mono block">
                {isPaying ? '-' : '+'}{formatVnd(multiFundingResult.fee24hVnd ?? 0)}
              </span>
            </div>

            {/* 7 Days */}
            <div className="p-3 rounded-xl bg-[#161A25] border border-[#232936] text-center space-y-1">
              <span className="text-[11px] text-[#848E9C] block">Sau 7 Ngày (21 phiên)</span>
              <span className={`font-mono font-extrabold text-base block ${isPaying ? 'text-[#F6465D]' : 'text-[#0ECB81]'}`}>
                {isPaying ? '-' : '+'}${formatUsdt(multiFundingResult.fee7d)}
              </span>
              <span className="text-[10px] text-[#848E9C] font-mono block">
                {isPaying ? '-' : '+'}{formatVnd(multiFundingResult.fee7dVnd ?? 0)}
              </span>
            </div>
          </div>

          {/* Detailed rule explanation */}
          <div className="p-3 rounded-xl bg-[#161A25] border border-[#232936] text-xs text-[#848E9C] space-y-1">
            <div className="flex items-start gap-1.5 text-white font-medium">
              <Info className="w-3.5 h-3.5 text-[#00B4D8] shrink-0 mt-0.5" />
              <span>{multiFundingResult.actionExplanation}</span>
            </div>
            <p className="text-[11px] text-[#848E9C] pl-5">
              Tỷ lệ lãi suất hàng năm quy đổi (APR): <strong className="text-white font-mono">{multiFundingResult.annualizedRatePercent.toFixed(2)}%/năm</strong>. Nếu gồng lệnh dài ngày khi Funding Rate ngược chiều, số tiền này sẽ âm trực tiếp vào ký quỹ của bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
