import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  LifeBuoy, 
  Sparkles 
} from 'lucide-react';
import { DcaPurchase } from '../../types';
import { calculateVnDca } from '../../utils/calculations';
import { formatVnd, formatPercent } from '../../utils/formatters';

export const VnDcaCard: React.FC = () => {
  const [purchases, setPurchases] = useState<DcaPurchase[]>([
    { id: '1', price: 32000, quantity: 2000 },
    { id: '2', price: 26000, quantity: 3000 },
    { id: '3', price: 22000, quantity: 5000 },
  ]);
  const [currentPrice, setCurrentPrice] = useState<number>(24000);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    return calculateVnDca(purchases, currentPrice);
  }, [purchases, currentPrice]);

  const handleAddRow = () => {
    const nextId = (purchases.length + 1).toString();
    const lastPrice = purchases.length > 0 ? purchases[purchases.length - 1].price * 0.9 : 20000;
    setPurchases([...purchases, { id: nextId, price: Math.round(lastPrice / 100) * 100, quantity: 1000 }]);
  };

  const handleRemoveRow = (id: string) => {
    if (purchases.length <= 1) return;
    setPurchases(purchases.filter((p) => p.id !== id));
  };

  const handleUpdateRow = (id: string, field: 'price' | 'quantity', val: number) => {
    setPurchases(
      purchases.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleCopy = () => {
    const text = `[DCA Về Bờ CK VN] ${purchases.length} đợt gom | Tổng: ${result.totalQuantity.toLocaleString()} CP | Giá vốn TB: ${formatVnd(result.averagePrice)} | Giá hiện tại: ${formatVnd(currentPrice)} (${formatPercent(result.currentPnlPercent, true)}) -> CẦN TĂNG +${formatPercent(result.percentNeededToBreakEven, false)} TỪ ĐÁY ĐỂ VỀ BỜ!`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="vn-dca-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                DCA Trung Bình Giá & % Về Bờ
              </h3>
              <p className="text-xs text-[#848E9C]">
                Tính giá vốn trung bình nhiều lần mua và % giá cần tăng để hòa vốn
              </p>
            </div>
          </div>

          <button
            id="copy-vn-dca-btn"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Current Market Price */}
        <div className="p-3 bg-[#161A25] rounded-xl border border-[#232936] mb-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <label htmlFor="input-dca-current-price" className="text-xs font-semibold text-white flex items-center gap-1.5 w-full sm:w-auto">
            <Sparkles className="w-3.5 h-3.5 text-[#0ECB81]" />
            Giá thị trường hiện tại (Để tính % Về Bờ):
          </label>
          <div className="relative w-full sm:w-44">
            <input
              id="input-dca-current-price"
              type="number"
              step="100"
              value={currentPrice || ''}
              onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#0B0E14] border border-[#2B313F] focus:border-[#0ECB81] rounded-lg px-3 py-1.5 text-xs text-white font-mono"
              placeholder="24000"
            />
            <span className="absolute right-3 top-1.5 text-[11px] text-[#848E9C]">đ</span>
          </div>
        </div>

        {/* Purchases List */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-[#848E9C] px-1">
            <span>Danh sách các lần gom cổ phiếu:</span>
            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center gap-1 text-[#00B4D8] hover:text-[#38cbf0] font-semibold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm đợt mua</span>
            </button>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {purchases.map((row, idx) => (
              <div
                key={row.id}
                className="flex items-center gap-2 bg-[#161A25] p-2.5 rounded-xl border border-[#232936]"
              >
                <span className="text-[11px] font-mono font-bold text-[#848E9C] w-5 text-center shrink-0">
                  #{idx + 1}
                </span>

                <div className="flex-1">
                  <span className="text-[10px] text-[#848E9C] block">Giá mua</span>
                  <input
                    type="number"
                    step="100"
                    value={row.price || ''}
                    onChange={(e) => handleUpdateRow(row.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0E14] border border-[#232936] rounded-lg px-2 py-1 text-xs text-white font-mono"
                    placeholder="Giá mua"
                  />
                </div>

                <div className="flex-1">
                  <span className="text-[10px] text-[#848E9C] block">Khối lượng (CP)</span>
                  <input
                    type="number"
                    step="100"
                    value={row.quantity || ''}
                    onChange={(e) => handleUpdateRow(row.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0B0E14] border border-[#232936] rounded-lg px-2 py-1 text-xs text-white font-mono"
                    placeholder="Số lượng"
                  />
                </div>

                <div className="text-right w-24 shrink-0 hidden sm:block">
                  <span className="text-[10px] text-[#848E9C] block">Thành tiền</span>
                  <span className="text-xs font-mono text-white block truncate">
                    {formatVnd(row.price * row.quantity, false)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={purchases.length <= 1}
                  onClick={() => handleRemoveRow(row.id)}
                  className="p-1.5 text-[#848E9C] hover:text-[#EF4444] disabled:opacity-20 shrink-0"
                  title="Xóa đợt mua này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Output Results */}
      <div className="mt-5 pt-4 border-t border-[#1E232F] space-y-4">
        {/* Average Price & Break-even % Highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Average Cost */}
          <div className="p-3.5 rounded-xl bg-[#00B4D8]/10 border border-[#00B4D8]/30">
            <span className="text-xs font-semibold text-[#848E9C] uppercase tracking-wider block">
              GIÁ VỐN TRUNG BÌNH
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold font-mono text-white">
                {formatVnd(result.averagePrice)}
              </span>
              <span className="text-xs text-[#848E9C] font-mono">/ cp</span>
            </div>
            <span className="text-[11px] text-[#848E9C] block mt-1">
              Tổng {result.totalQuantity.toLocaleString()} CP ({Math.floor(result.totalQuantity / 100)} lô)
            </span>
          </div>

          {/* Về Bờ % */}
          <div className={`p-3.5 rounded-xl border ${
            result.percentNeededToBreakEven > 0
              ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
              : 'bg-[#0ECB81]/10 border-[#0ECB81]/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#848E9C] flex items-center gap-1">
                <LifeBuoy className="w-3.5 h-3.5" />
                CẦN TĂNG ĐỂ VỀ BỜ
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-extrabold font-mono ${
                result.percentNeededToBreakEven > 0 ? 'text-[#EF4444]' : 'text-[#0ECB81]'
              }`}>
                {result.percentNeededToBreakEven > 0 
                  ? `+${formatPercent(result.percentNeededToBreakEven, false)}` 
                  : 'ĐÃ CÓ LÃI!'}
              </span>
            </div>
            <span className="text-[11px] text-[#848E9C] block mt-1">
              {result.percentNeededToBreakEven > 0 
                ? `Biên độ từ giá ${formatVnd(currentPrice)} lên ${formatVnd(result.averagePrice)}`
                : 'Thị giá hiện tại cao hơn giá vốn trung bình'}
            </span>
          </div>
        </div>

        {/* Current PnL stats */}
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Tổng Vốn Đã Gom:</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatVnd(result.totalCost)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Lãi/Lỗ Hiện Tại:</span>
            <span className={`font-mono font-bold text-sm ${
              result.currentPnlAmount >= 0 ? 'text-[#0ECB81]' : 'text-[#EF4444]'
            }`}>
              {result.currentPnlAmount >= 0 ? '+' : ''}{formatVnd(result.currentPnlAmount)} ({formatPercent(result.currentPnlPercent, true)})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
