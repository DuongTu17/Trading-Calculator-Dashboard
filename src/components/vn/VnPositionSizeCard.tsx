import React, { useState, useMemo } from 'react';
import { 
  Percent, 
  Copy, 
  Check, 
  AlertCircle, 
  Building2, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { calculateVnPositionSize } from '../../utils/calculations';
import { formatVnd, formatPercent } from '../../utils/formatters';

export const VnPositionSizeCard: React.FC = () => {
  const [capital, setCapital] = useState<number>(100000000); // 100 triệu VNĐ
  const [riskPercent, setRiskPercent] = useState<number>(2); // 2%
  const [entryPrice, setEntryPrice] = useState<number>(25000); // 25,000 đ
  const [stopLossPrice, setStopLossPrice] = useState<number>(23250); // 23,250 đ (7% cắt lỗ)
  const [copied, setCopied] = useState(false);

  // Quick capital presets in million VND
  const capitalPresets = [
    { label: '50 Triệu', value: 50000000 },
    { label: '100 Triệu', value: 100000000 },
    { label: '200 Triệu', value: 200000000 },
    { label: '500 Triệu', value: 500000000 },
    { label: '1 Tỷ', value: 1000000000 },
  ];

  const result = useMemo(() => {
    return calculateVnPositionSize({
      capital,
      riskPercent,
      entryPrice,
      stopLossPrice,
    });
  }, [capital, riskPercent, entryPrice, stopLossPrice]);

  const handleCopy = () => {
    const text = `[Vị Thế CK Việt Nam] Vốn: ${formatVnd(capital)} | Rủi ro: ${riskPercent}% (${formatVnd(result.maxRiskAmount)}) | Mua: ${formatVnd(entryPrice)} | SL: ${formatVnd(stopLossPrice)} (-${formatPercent(result.riskPercentPerShare, false)}) -> Khối lượng: ${result.shareCount.toLocaleString()} CP (${result.lotCount} Lô) | Tổng giải ngân: ${formatVnd(result.totalInvestment)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="vn-position-size-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Position Size (Lô 100 Cổ Phiếu)
              </h3>
              <p className="text-xs text-[#848E9C]">
                Quản trị vốn chuẩn HOSE/HNX • Tự động làm tròn bội số 100
              </p>
            </div>
          </div>

          <button
            id="copy-vn-pos-btn"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Total Capital */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <label htmlFor="input-vn-capital" className="text-[#848E9C] font-medium">
                Tổng Vốn Đầu Tư (VNĐ):
              </label>
              <span className="text-white font-mono font-bold">{formatVnd(capital)}</span>
            </div>
            <div className="relative">
              <input
                id="input-vn-capital"
                type="number"
                value={capital || ''}
                onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] focus:border-[#EF4444] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                placeholder="100000000"
              />
              <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">VNĐ</span>
            </div>

            {/* Quick Capital Presets */}
            <div className="flex items-center gap-1.5 pt-2 overflow-x-auto">
              {capitalPresets.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setCapital(p.value)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold shrink-0 transition-all ${
                    capital === p.value
                      ? 'bg-[#EF4444] text-white'
                      : 'bg-[#161A25] text-[#848E9C] hover:text-white border border-[#232936]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Risk Percent Slider */}
          <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936] space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#848E9C] font-medium">% Rủi ro tối đa mỗi lệnh:</span>
              <div className="flex items-center gap-1.5 font-mono">
                <span className="font-bold text-[#EF4444]">{riskPercent}%</span>
                <span className="text-[#848E9C]">({formatVnd(result.maxRiskAmount)})</span>
              </div>
            </div>

            <input
              id="input-vn-risk-slider"
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={riskPercent}
              onChange={(e) => setRiskPercent(parseFloat(e.target.value) || 1)}
              className="w-full h-2 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#EF4444]"
            />

            {/* Quick Risk Buttons: 1%, 2%, 3%, 5% */}
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 5].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setRiskPercent(pct)}
                  className={`flex-1 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                    riskPercent === pct
                      ? 'bg-[#EF4444] text-white shadow-sm'
                      : 'bg-[#0B0E14] text-[#848E9C] hover:text-white border border-[#232936]'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Entry & Stop Loss */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-vn-entry" className="text-xs text-[#848E9C] font-medium block mb-1">
                Giá Mua Dự Kiến:
              </label>
              <div className="relative">
                <input
                  id="input-vn-entry"
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

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="input-vn-sl" className="text-[#848E9C] font-medium">
                  Giá Cắt Lỗ (Stop Loss):
                </label>
                {result.riskPercentPerShare > 0 && (
                  <span className="text-[#EF4444] font-mono text-[11px]">
                    -{formatPercent(result.riskPercentPerShare, false)}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  id="input-vn-sl"
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
          </div>
        </div>
      </div>

      {/* Output Results */}
      <div className="mt-6 pt-5 border-t border-[#1E232F] space-y-4">
        {/* Main Share Count Highlight */}
        <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#848E9C] uppercase tracking-wider">
              KHỐI LƯỢNG MUA AN TOÀN
            </span>
            <span className="text-xs font-mono font-bold text-[#0ECB81] bg-[#0ECB81]/15 px-2 py-0.5 rounded border border-[#0ECB81]/30">
              {result.lotCount} Lô Chẵn (100)
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {result.shareCount.toLocaleString()}
            </span>
            <span className="text-xs text-[#848E9C] font-mono">Cổ phiếu</span>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-white/5">
            <span className="text-[#848E9C]">Tổng tiền giải ngân:</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatVnd(result.totalInvestment)}
            </span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Rủi Ro Thực Tế:</span>
            <span className="font-mono font-bold text-[#EF4444] text-sm">
              {formatVnd(result.actualRiskAmount)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Tỷ Lệ Giải Ngân Vốn:</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatPercent(result.capitalUtilizationPercent, false)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936] col-span-2 sm:col-span-1">
            <span className="text-[#848E9C] text-[11px] block">Sức Mua Tối Đa:</span>
            <span className="font-mono font-bold text-[#848E9C] text-sm">
              {result.maxAffordableShares.toLocaleString()} CP
            </span>
          </div>
        </div>

        {result.isCappedByCapital && (
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-[#F0B90B]/10 border border-[#F0B90B]/20 text-[#F0B90B] text-[11px]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Khối lượng đã được giới hạn tối đa theo số vốn khả dụng của tài khoản.</span>
          </div>
        )}
      </div>
    </div>
  );
};
