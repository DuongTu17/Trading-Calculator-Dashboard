import React from 'react';
import { formatTokenPrice } from '../../utils/formatters';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface PriceRange24hBarProps {
  low24h: number;
  high24h: number;
  currentPrice: number;
  decimals?: number;
  quoteAsset?: string;
  onSetStopLoss?: (price: number) => void;
  onSetTakeProfit?: (price: number) => void;
  className?: string;
}

export const PriceRange24hBar: React.FC<PriceRange24hBarProps> = ({
  low24h,
  high24h,
  currentPrice,
  decimals = 2,
  quoteAsset = 'USDT',
  onSetStopLoss,
  onSetTakeProfit,
  className = '',
}) => {
  const safeLow = low24h > 0 ? low24h : currentPrice * 0.98;
  const safeHigh = high24h > safeLow ? high24h : safeLow * 1.04;
  const spread = safeHigh - safeLow;

  // Calculate position percentage between 0 and 100
  const positionPercent = spread > 0
    ? Math.min(Math.max(((currentPrice - safeLow) / spread) * 100, 0), 100)
    : 50;

  return (
    <div className={`bg-[#0B0E14] border border-[#232936] rounded-xl p-2.5 space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-[11px]">
        {/* 24h Low with optional click to set SL */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#848E9C] font-mono">24h L:</span>
          <span className="font-mono text-[#F6465D] font-bold">
            ${formatTokenPrice(safeLow, decimals)}
          </span>
          {onSetStopLoss && (
            <button
              type="button"
              onClick={() => onSetStopLoss(safeLow)}
              className="px-1.5 py-0.5 rounded bg-[#F6465D]/10 hover:bg-[#F6465D] text-[#F6465D] hover:text-white text-[10px] font-mono font-semibold transition-all flex items-center gap-0.5"
              title="Đặt mức giá 24h Low này vào ô Stop Loss"
            >
              <ArrowDownRight className="w-2.5 h-2.5" />
              <span>SL</span>
            </button>
          )}
        </div>

        {/* Current price marker indicator */}
        <div className="text-[10px] font-mono text-[#848E9C] hidden sm:flex items-center gap-1">
          <span>Vị trí:</span>
          <strong className="text-white">{positionPercent.toFixed(1)}%</strong>
        </div>

        {/* 24h High with optional click to set TP */}
        <div className="flex items-center gap-1.5">
          {onSetTakeProfit && (
            <button
              type="button"
              onClick={() => onSetTakeProfit(safeHigh)}
              className="px-1.5 py-0.5 rounded bg-[#0ECB81]/10 hover:bg-[#0ECB81] text-[#0ECB81] hover:text-black text-[10px] font-mono font-semibold transition-all flex items-center gap-0.5"
              title="Đặt mức giá 24h High này vào ô Take Profit"
            >
              <ArrowUpRight className="w-2.5 h-2.5" />
              <span>TP</span>
            </button>
          )}
          <span className="text-[#848E9C] font-mono">24h H:</span>
          <span className="font-mono text-[#0ECB81] font-bold">
            ${formatTokenPrice(safeHigh, decimals)}
          </span>
        </div>
      </div>

      {/* Visual Range Slider Track */}
      <div className="relative w-full h-2 bg-[#1A1F2C] rounded-full overflow-visible">
        {/* Gradient fill */}
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#F6465D]/60 via-[#F0B90B]/60 to-[#0ECB81]/60 rounded-full"
          style={{ width: '100%' }}
        />

        {/* Active position cursor */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white rounded-full border-2 border-[#121722] shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10 transition-all duration-300"
          style={{ left: `${positionPercent}%` }}
          title={`Giá hiện tại: $${formatTokenPrice(currentPrice, decimals)} ${quoteAsset} (${positionPercent.toFixed(1)}% biên 24h)`}
        />
      </div>

      <div className="flex justify-between items-center text-[9px] text-[#848E9C] font-mono pt-0.5">
        <span>Vùng hỗ trợ (Đáy ngày)</span>
        <span className="text-white font-semibold">${formatTokenPrice(currentPrice, decimals)}</span>
        <span>Vùng kháng cự (Đỉnh ngày)</span>
      </div>
    </div>
  );
};
