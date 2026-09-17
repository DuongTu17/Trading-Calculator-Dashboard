import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Copy, 
  Check, 
  HelpCircle, 
  TrendingUp, 
  Receipt 
} from 'lucide-react';
import { calculateVnBreakEven } from '../../utils/calculations';
import { formatVnd, formatPercent } from '../../utils/formatters';

export const VnBreakEvenCard: React.FC = () => {
  const [buyPrice, setBuyPrice] = useState<number>(30000);
  const [quantity, setQuantity] = useState<number>(2000);
  const [buyFeeRate, setBuyFeeRate] = useState<number>(0.1);
  const [sellFeeRate, setSellFeeRate] = useState<number>(0.1);
  const [taxRate, setTaxRate] = useState<number>(0.1); // 0.1% theo quy định thuế TNCN VN
  const [copied, setCopied] = useState(false);

  // Broker presets
  const brokerPresets = [
    { name: 'TCBS (0.03%)', fee: 0.03 },
    { name: 'Chuẩn (0.1%)', fee: 0.1 },
    { name: 'VPS (0.13%)', fee: 0.13 },
    { name: 'SSI (0.15%)', fee: 0.15 },
    { name: 'Free (0%)', fee: 0 },
  ];

  const result = useMemo(() => {
    return calculateVnBreakEven({
      buyPrice,
      quantity,
      buyFeeRate,
      sellFeeRate,
      taxRate,
    });
  }, [buyPrice, quantity, buyFeeRate, sellFeeRate, taxRate]);

  const handleApplyBroker = (fee: number) => {
    setBuyFeeRate(fee);
    setSellFeeRate(fee);
  };

  const handleCopy = () => {
    const text = `[Hòa Vốn CK Việt Nam] Mua: ${formatVnd(buyPrice)} x ${quantity.toLocaleString()} CP | Phí mua/bán: ${buyFeeRate}% + Thuế TNCN: ${taxRate}% -> Giá Bán Hòa Vốn: ${formatVnd(result.breakEvenPrice)} (Cần tăng +${formatPercent(result.minGainPercent, false)}) | Tổng thuế & phí: ${formatVnd(result.totalCostAndTax)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="vn-breakeven-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 pb-4 mb-5 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F0B90B]/10 text-[#F0B90B] border border-[#F0B90B]/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Hòa Vốn & Phí Thuế Nhà Nước
              </h3>
              <p className="text-xs text-[#848E9C]">
                Tự động cộng Phí mua/bán (0.1%) + Thuế TNCN (0.1%)
              </p>
            </div>
          </div>

          <button
            id="copy-vn-be-btn"
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1 rounded-lg bg-[#161A25] border border-[#232936] hover:border-[#384152] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="input-be-buy-price" className="text-xs text-[#848E9C] font-medium block mb-1">
                Giá Mua Cổ Phiếu:
              </label>
              <div className="relative">
                <input
                  id="input-be-buy-price"
                  type="number"
                  step="100"
                  value={buyPrice || ''}
                  onChange={(e) => setBuyPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#F0B90B] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                  placeholder="30000"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">đ/cp</span>
              </div>
            </div>

            <div>
              <label htmlFor="input-be-quantity" className="text-xs text-[#848E9C] font-medium block mb-1">
                Số Lượng (Cổ phiếu):
              </label>
              <div className="relative">
                <input
                  id="input-be-quantity"
                  type="number"
                  step="100"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#161A25] border border-[#232936] focus:border-[#F0B90B] rounded-xl px-3 py-2.5 text-sm font-mono text-white focus:outline-none"
                  placeholder="2000"
                />
                <span className="absolute right-3 top-2.5 text-xs text-[#848E9C] font-mono">CP</span>
              </div>
            </div>
          </div>

          {/* Broker Presets */}
          <div className="space-y-2 bg-[#161A25] p-3 rounded-xl border border-[#232936]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#848E9C] font-medium">Mức phí CTCK phổ biến:</span>
              <span className="text-white font-mono">{buyFeeRate}%</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {brokerPresets.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => handleApplyBroker(b.fee)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    buyFeeRate === b.fee
                      ? 'bg-[#F0B90B] text-black font-bold'
                      : 'bg-[#0B0E14] text-[#848E9C] hover:text-white border border-[#232936]'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Fee & Tax Breakdown Settings */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <label htmlFor="input-buy-fee" className="text-[#848E9C] block mb-1">Phí Mua (%):</label>
              <input
                id="input-buy-fee"
                type="number"
                step="0.01"
                value={buyFeeRate}
                onChange={(e) => setBuyFeeRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2 py-1.5 text-white font-mono"
              />
            </div>

            <div>
              <label htmlFor="input-sell-fee" className="text-[#848E9C] block mb-1">Phí Bán (%):</label>
              <input
                id="input-sell-fee"
                type="number"
                step="0.01"
                value={sellFeeRate}
                onChange={(e) => setSellFeeRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2 py-1.5 text-white font-mono"
              />
            </div>

            <div>
              <label htmlFor="input-tax-fee" className="text-[#848E9C] block mb-1">Thuế TNCN (%):</label>
              <input
                id="input-tax-fee"
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2 py-1.5 text-white font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Output Results */}
      <div className="mt-6 pt-5 border-t border-[#1E232F] space-y-4">
        {/* Main Break-even Price */}
        <div className="p-4 rounded-xl bg-[#F0B90B]/10 border border-[#F0B90B]/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#848E9C] uppercase tracking-wider">
              GIÁ BÁN THỰC TẾ ĐỂ HÒA VỐN
            </span>
            <span className="text-xs font-mono font-bold text-[#F0B90B] bg-[#F0B90B]/15 px-2 py-0.5 rounded border border-[#F0B90B]/30">
              Cần tăng +{formatPercent(result.minGainPercent, false)}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {formatVnd(result.breakEvenPrice)}
            </span>
            <span className="text-xs text-[#848E9C] font-mono">/ cổ phiếu</span>
          </div>

          <div className="mt-2 text-xs text-[#848E9C]">
            Phải bán từ mức giá này trở lên bạn mới bắt đầu có lãi thực nhận vào tài khoản.
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Phí Mua:</span>
            <span className="font-mono font-bold text-white text-xs">
              {formatVnd(result.buyFee)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Phí Bán:</span>
            <span className="font-mono font-bold text-white text-xs">
              {formatVnd(result.sellFee)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Thuế TNCN (0.1%):</span>
            <span className="font-mono font-bold text-[#EF4444] text-xs">
              {formatVnd(result.taxAmount)}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#161A25] border border-[#232936]">
            <span className="text-[#848E9C] text-[11px] block">Tổng Thuế & Phí:</span>
            <span className="font-mono font-bold text-[#F0B90B] text-xs">
              {formatVnd(result.totalCostAndTax)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
