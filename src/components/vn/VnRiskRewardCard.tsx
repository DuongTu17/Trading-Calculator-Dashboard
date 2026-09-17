import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  Target,
  Share2
} from 'lucide-react';
import { calculateRiskReward } from '../../utils/calculations';
import { formatVnd, formatPercent } from '../../utils/formatters';
import { TradePlanShareModal } from '../common/TradePlanShareModal';
import { TradePlanExportData } from '../../types';

export const VnRiskRewardCard: React.FC = () => {
  const [ticker, setTicker] = useState<string>('HPG');
  const [entryPrice, setEntryPrice] = useState<number>(25000);
  const [stopLossPrice, setStopLossPrice] = useState<number>(23250); // Risk 1,750 đ (7%)
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(29500); // Reward 4,500 đ (18%) -> R/R ~ 2.57
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const result = useMemo(() => {
    return calculateRiskReward({
      entryPrice,
      stopLossPrice,
      takeProfitPrice,
      isShort: false,
    });
  }, [entryPrice, stopLossPrice, takeProfitPrice]);

  const handleCopy = () => {
    const text = `[Tỷ lệ R:R ${ticker}] Mua: ${formatVnd(entryPrice)} | Cắt lỗ: ${formatVnd(stopLossPrice)} (-${formatPercent(result.riskPercent, false)}) | Chốt lời: ${formatVnd(takeProfitPrice)} (+${formatPercent(result.rewardPercent, false)}) -> Tỷ lệ R/R: 1 : ${result.ratio.toFixed(2)} (${result.ratingLabel})`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tradePlanData: TradePlanExportData = {
    pair: `${ticker} (HOSE)`,
    marketType: 'vn_stock',
    direction: 'long',
    entryPrice,
    stopLossPrice,
    takeProfitPrice,
    riskRewardRatio: result.ratio,
    positionSize: 'Lô 100 CP',
    riskAmount: `SL -${formatPercent(result.riskPercent, false)} (${formatVnd(result.riskAmount)}/cp)`,
    watermark: 'TRADING CALC PRO • VN STOCK',
  };

  return (
    <div id="vn-risk-reward-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Tỷ Lệ Risk / Reward (R/R)
              </h3>
              <p className="text-xs text-[#848E9C]">
                Nhập Entry, Cắt lỗ, Chốt lời &rarr; Đo lường tỷ lệ 1 : X
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="export-vn-rr-btn"
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1 text-xs text-[#0ECB81] hover:text-white px-2.5 py-1 rounded-lg bg-[#0ECB81]/10 border border-[#0ECB81]/30 hover:bg-[#0ECB81] hover:text-black font-semibold transition-all"
              title="Xuất ảnh share kế hoạch giao dịch"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share Kèo</span>
            </button>

            <button
              id="copy-rr-btn"
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã chép' : 'Chép'}</span>
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label htmlFor="input-rr-ticker" className="text-xs text-[#848E9C] font-medium block mb-1">
                Mã CP:
              </label>
              <input
                id="input-rr-ticker"
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2.5 text-sm font-mono text-white font-bold focus:outline-none"
                placeholder="HPG"
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="input-rr-entry" className="text-xs text-[#848E9C] font-medium block mb-1">
                1. Giá Mua Vào (Entry):
              </label>
              <div className="relative">
                <input
                  id="input-rr-entry"
                  type="number"
                  step="100"
                  value={entryPrice || ''}
                  onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                  placeholder="25000"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">đ/cp</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="input-rr-sl" className="text-[#848E9C] font-medium">
                  2. Giá Cắt Lỗ (Stop Loss):
                </label>
                <span className="text-[#EF4444] font-mono text-[11px]">
                  -{formatPercent(result.riskPercent, false)}
                </span>
              </div>
              <div className="relative">
                <input
                  id="input-rr-sl"
                  type="number"
                  step="100"
                  value={stopLossPrice || ''}
                  onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#EF4444] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                  placeholder="23250"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">đ/cp</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="input-rr-tp" className="text-[#848E9C] font-medium">
                  3. Giá Chốt Lời (Take Profit):
                </label>
                <span className="text-[#0ECB81] font-mono text-[11px]">
                  +{formatPercent(result.rewardPercent, false)}
                </span>
              </div>
              <div className="relative">
                <input
                  id="input-rr-tp"
                  type="number"
                  step="100"
                  value={takeProfitPrice || ''}
                  onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#0ECB81] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                  placeholder="29500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">đ/cp</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output Results */}
      <div className="mt-6 pt-5 border-t border-[#1E232F] space-y-4">
        {/* Main Ratio Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          result.rating === 'optimal'
            ? 'bg-[#0ECB81]/15 border-[#0ECB81]/40'
            : result.rating === 'acceptable'
            ? 'bg-[#F0B90B]/15 border-[#F0B90B]/40'
            : 'bg-[#EF4444]/15 border-[#EF4444]/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#848E9C] uppercase tracking-wider">
              TỶ LỆ LỢI NHUẬN / RỦI RO (R:R)
            </span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
              result.rating === 'optimal'
                ? 'bg-[#0ECB81]/20 text-[#0ECB81] border-[#0ECB81]/40'
                : result.rating === 'acceptable'
                ? 'bg-[#F0B90B]/20 text-[#F0B90B] border-[#F0B90B]/40'
                : 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/40'
            }`}>
              {result.rating === 'optimal' && '✓ KÈO TỐI ƯU (> 1:2)'}
              {result.rating === 'acceptable' && '⚖️ CHẤP NHẬN ĐƯỢC (1:1.5 - 1:2)'}
              {result.rating === 'high_risk' && '⚠️ CẢNH BÁO ĐỎ (< 1:1.5)'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
              result.rating === 'optimal'
                ? 'text-[#0ECB81]'
                : result.rating === 'acceptable'
                ? 'text-[#F0B90B]'
                : 'text-[#EF4444]'
            }`}>
              1 : {result.ratio.toFixed(2)}
            </span>
          </div>

          {/* Visual Ratio Gauge */}
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-[#848E9C]">
              <span className="text-[#EF4444]">Rủi ro: -{formatVnd(result.riskAmount)}</span>
              <span className="text-[#0ECB81]">Lợi nhuận: +{formatVnd(result.rewardAmount)}</span>
            </div>
            <div className="w-full h-2.5 bg-[#1E232F] rounded-full flex overflow-hidden">
              <div 
                className="h-full bg-[#EF4444]" 
                style={{ width: `${Math.max(10, Math.min(80, (1 / (1 + result.ratio)) * 100))}%` }}
                title="Tỷ trọng rủi ro"
              />
              <div 
                className={`h-full ${result.rating === 'optimal' ? 'bg-[#0ECB81]' : result.rating === 'acceptable' ? 'bg-[#F0B90B]' : 'bg-[#F6465D]'}`}
                style={{ width: `${Math.max(20, Math.min(90, (result.ratio / (1 + result.ratio)) * 100))}%` }}
                title="Tỷ trọng lợi nhuận"
              />
            </div>
          </div>

          <p className="text-[11px] text-[#848E9C] mt-2">
            {result.ratingDescription}
          </p>
        </div>

        {/* Rule Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className={`p-2 rounded-lg border ${result.ratio >= 2.0 ? 'bg-[#0ECB81]/10 border-[#0ECB81]/40 text-[#0ECB81]' : 'bg-[#161A25] border-[#232936] text-[#848E9C]'}`}>
            <span className="block font-bold">&gt; 1:2.0</span>
            <span className="text-[10px]">Xanh (Rất tốt)</span>
          </div>

          <div className={`p-2 rounded-lg border ${result.ratio >= 1.5 && result.ratio < 2.0 ? 'bg-[#F0B90B]/10 border-[#F0B90B]/40 text-[#F0B90B]' : 'bg-[#161A25] border-[#232936] text-[#848E9C]'}`}>
            <span className="block font-bold">1:1.5 - 1:2.0</span>
            <span className="text-[10px]">Vàng (Đạt chuẩn)</span>
          </div>

          <div className={`p-2 rounded-lg border ${result.ratio < 1.5 ? 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]' : 'bg-[#161A25] border-[#232936] text-[#848E9C]'}`}>
            <span className="block font-bold">&lt; 1:1.5</span>
            <span className="text-[10px]">Đỏ (Cảnh báo)</span>
          </div>
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
