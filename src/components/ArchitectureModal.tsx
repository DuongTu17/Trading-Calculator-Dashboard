import React, { useState } from 'react';
import { 
  Code2, 
  Layers, 
  Copy, 
  Check, 
  FileText, 
  Terminal, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface ArchitectureViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureViewer: React.FC<ArchitectureViewerProps> = ({ isOpen, onClose }) => {
  const [activeSnippetTab, setActiveSnippetTab] = useState<'structure' | 'home_code' | 'liq_code'>('structure');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const componentStructureText = `
📂 Trading Calculator Dashboard - Component Architecture:
├── src/
│   ├── types.ts                    # Toàn bộ Types & Interfaces tài chính (VN Stock & Crypto)
│   ├── utils/
│   │   ├── formatters.ts           # Định dạng tiền tệ VNĐ, USDT, Lot, Tỷ lệ %
│   │   └── calculations.ts         # Thuật toán: Giá cháy, Hòa vốn, DCA Về bờ, R/R, Risk Size
│   ├── components/
│   │   ├── Header.tsx              # Thanh điều hướng, Switcher phân vùng, tỷ giá P2P thực tế
│   │   ├── HomeSelector.tsx        # Màn hình 2 Card lớn: 🇻🇳 CK Việt Nam & 🌐 Sàn Quốc Tế
│   │   ├── vn/
│   │   │   ├── VnStockDashboard.tsx    # Dashboard phân vùng Chứng Khoán VN
│   │   │   ├── VnPositionSizeCard.tsx  # 1. Position Size (Lô chẵn 100)
│   │   │   ├── VnBreakEvenCard.tsx     # 2. Hòa vốn + Phí mua/bán + Thuế TNCN 0.1%
│   │   │   ├── VnDcaCard.tsx           # 3. DCA Trung bình giá & % Về Bờ
│   │   │   └── VnRiskRewardCard.tsx    # 4. Tỷ lệ R/R (Báo Xanh >1:2, Đỏ <1:1.5)
│   │   └── crypto/
│   │       ├── CryptoDashboard.tsx     # Dashboard phân vùng Quốc Tế
│   │       ├── CryptoLiquidationCard.tsx # 1. Tính Giá Cháy (x1 - x125, Cross/Iso)
│   │       ├── CryptoPositionSizeCard.tsx# 2. Risk % Position Size (USDT / Lot)
│   │       ├── CryptoFeeCard.tsx       # 3. Phí Futures Taker/Maker & Funding 8h
│   │       └── CryptoPnlCard.tsx       # 4. PnL & Quy đổi tiền mặt P2P VNĐ
│   └── App.tsx                     # State phân vùng, router điều hướng mượt mà
`.trim();

  const sampleLiquidationCode = `
// Code mẫu: Thuật toán Tính Giá Cháy (Liquidation Price) chuẩn Binance Futures:
export function calcLiquidation({
  direction,   // 'long' | 'short'
  entryPrice,  // Giá vào lệnh (USDT)
  leverage,    // Đòn bẩy 1 -> 125
  margin,      // Tiền ký quỹ (USDT)
  mmr = 0.004  // Maintenance Margin Rate (chuẩn Binance ~0.4%)
}) {
  let liqPrice = 0;
  if (direction === 'long') {
    // Long: entry * (1 - 1/leverage + mmr)
    liqPrice = entryPrice * (1 - (1 / leverage) + mmr);
  } else {
    // Short: entry * (1 + 1/leverage - mmr)
    liqPrice = entryPrice * (1 + (1 / leverage) - mmr);
  }
  const distancePercent = Math.abs((entryPrice - liqPrice) / entryPrice) * 100;
  return {
    liquidationPrice: Math.max(0, liqPrice),
    distancePercent,
    riskLevel: distancePercent <= 2 ? 'CRITICAL' : distancePercent <= 5 ? 'HIGH' : 'SAFE'
  };
}
`.trim();

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#121722] border border-[#232936] rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Cấu Trúc Code & Component Layout</h3>
              <p className="text-xs text-[#848E9C]">Tài liệu cấu trúc theo yêu cầu Design Brief của bạn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#848E9C] hover:text-white px-3 py-1.5 rounded-lg bg-[#161A25] border border-[#232936] text-xs font-semibold"
          >
            ✕ Đóng
          </button>
        </div>

        {/* Snippet Tabs */}
        <div className="flex items-center gap-2 mb-4 bg-[#161A25] p-1 rounded-xl border border-[#232936]">
          <button
            type="button"
            onClick={() => setActiveSnippetTab('structure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSnippetTab === 'structure' ? 'bg-[#2B313F] text-white shadow-sm' : 'text-[#848E9C] hover:text-white'
            }`}
          >
            1. Cấu Trúc Component Layout
          </button>
          <button
            type="button"
            onClick={() => setActiveSnippetTab('liq_code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSnippetTab === 'liq_code' ? 'bg-[#2B313F] text-white shadow-sm' : 'text-[#848E9C] hover:text-white'
            }`}
          >
            2. Logic Tính Giá Cháy Liquidation
          </button>
        </div>

        {/* Content Box */}
        <div className="relative flex-1 overflow-y-auto bg-[#0B0E14] border border-[#1E232F] rounded-xl p-4 font-mono text-xs text-[#0ECB81] leading-relaxed">
          <button
            onClick={() => handleCopy(activeSnippetTab === 'structure' ? componentStructureText : sampleLiquidationCode)}
            className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-white bg-[#1E232F] hover:bg-[#2B313F] px-2.5 py-1 rounded-lg border border-[#3E4556] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#0ECB81]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Đã chép' : 'Sao chép code'}</span>
          </button>

          <pre className="whitespace-pre font-mono">
            {activeSnippetTab === 'structure' ? componentStructureText : sampleLiquidationCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-[#1E232F] flex justify-between items-center text-xs text-[#848E9C]">
          <span>Tuân thủ Tailwind CSS v4, TypeScript chuẩn nghiêm ngặt và React 19.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0ECB81] hover:bg-[#0bb974] text-black font-bold rounded-lg text-xs"
          >
            Hoàn tất xem
          </button>
        </div>
      </div>
    </div>
  );
};
