import React, { useState } from 'react';
import { 
  TrendingUp, 
  Globe2, 
  RotateCcw, 
  DollarSign, 
  SlidersHorizontal,
  Layers,
  HelpCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { TradingCategory } from '../types';
import { formatVnd } from '../utils/formatters';

interface HeaderProps {
  activeCategory: TradingCategory;
  onSelectCategory: (category: TradingCategory) => void;
  p2pRate: number;
  onUpdateP2pRate: (rate: number) => void;
  onResetAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  p2pRate,
  onUpdateP2pRate,
  onResetAll,
}) => {
  const [isEditingP2p, setIsEditingP2p] = useState(false);
  const [tempRate, setTempRate] = useState(p2pRate.toString());
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleSaveRate = () => {
    const val = parseFloat(tempRate.replace(/,/g, ''));
    if (!isNaN(val) && val > 0) {
      onUpdateP2pRate(val);
    }
    setIsEditingP2p(false);
  };

  return (
    <>
      <header id="main-header" className="sticky top-0 z-30 bg-[#0B0E14]/90 backdrop-blur-md border-b border-[#1E232F] px-4 lg:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo and Brand */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <button
              id="brand-home-btn"
              onClick={() => onSelectCategory('selector')}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0ECB81] via-[#00B4D8] to-[#6366F1] p-0.5 shadow-lg shadow-[#0ECB81]/15">
                <div className="w-full h-full bg-[#0B0E14] rounded-[10px] flex items-center justify-center group-hover:bg-[#121722] transition-colors">
                  <TrendingUp className="w-5 h-5 text-[#0ECB81]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base lg:text-lg text-white tracking-tight">
                    TRADING CALC
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30 uppercase tracking-wide">
                    PRO
                  </span>
                </div>
                <p className="text-[11px] text-[#848E9C] hidden sm:block">
                  Dashboard Tính Toán Siêu Tốc Cho Trader VN & Quốc Tế
                </p>
              </div>
            </button>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 md:hidden">
              <button
                id="header-mobile-help-btn"
                onClick={() => setShowGuideModal(true)}
                className="p-2 text-[#848E9C] hover:text-white rounded-lg hover:bg-[#1E232F]"
                title="Hướng dẫn & Quy chuẩn"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
              <button
                id="header-mobile-reset-btn"
                onClick={onResetAll}
                className="p-2 text-[#848E9C] hover:text-[#F6465D] rounded-lg hover:bg-[#1E232F]"
                title="Đặt lại tất cả"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Category Switcher */}
          <nav id="category-nav" className="flex items-center bg-[#161A25] p-1 rounded-xl border border-[#232936] w-full md:w-auto">
            <button
              id="nav-tab-selector"
              onClick={() => onSelectCategory('selector')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'selector'
                  ? 'bg-[#2B313F] text-white shadow-sm'
                  : 'text-[#848E9C] hover:text-white hover:bg-[#1E232F]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Tổng quan</span>
            </button>

            <button
              id="nav-tab-vn"
              onClick={() => onSelectCategory('vn')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'vn'
                  ? 'bg-gradient-to-r from-[#DC2626]/20 to-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] shadow-sm'
                  : 'text-[#848E9C] hover:text-white hover:bg-[#1E232F]'
              }`}
            >
              <span>🇻🇳</span>
              <span>Chứng Khoán VN</span>
            </button>

            <button
              id="nav-tab-crypto"
              onClick={() => onSelectCategory('crypto')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'crypto'
                  ? 'bg-gradient-to-r from-[#0ECB81]/20 to-[#10B981]/20 border border-[#0ECB81]/40 text-[#0ECB81] shadow-sm'
                  : 'text-[#848E9C] hover:text-white hover:bg-[#1E232F]'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>Sàn Quốc Tế</span>
            </button>
          </nav>

          {/* Right Controls: P2P Rate & Reset */}
          <div className="hidden md:flex items-center gap-3">
            {/* P2P Chip */}
            <div className="relative">
              {isEditingP2p ? (
                <div className="flex items-center gap-1.5 bg-[#161A25] border border-[#0ECB81] rounded-lg px-2 py-1">
                  <span className="text-[11px] text-[#848E9C]">P2P:</span>
                  <input
                    id="input-p2p-rate"
                    type="number"
                    value={tempRate}
                    onChange={(e) => setTempRate(e.target.value)}
                    className="w-20 bg-transparent text-white font-mono text-xs focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveRate()}
                  />
                  <button
                    id="save-p2p-btn"
                    onClick={handleSaveRate}
                    className="p-0.5 rounded bg-[#0ECB81] text-black hover:bg-[#0bb974]"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  id="toggle-edit-p2p-btn"
                  onClick={() => {
                    setTempRate(p2pRate.toString());
                    setIsEditingP2p(true);
                  }}
                  className="flex items-center gap-1.5 bg-[#161A25] hover:bg-[#1E232F] border border-[#232936] hover:border-[#384152] rounded-lg px-2.5 py-1 text-xs transition-colors group"
                  title="Nhấn để đổi tỷ giá P2P USDT/VND"
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#F0B90B]" />
                  <span className="text-[#848E9C]">USDT/VND:</span>
                  <span className="text-white font-mono font-medium">{formatVnd(p2pRate)}</span>
                  <span className="text-[10px] text-[#848E9C] group-hover:text-white">✏️</span>
                </button>
              )}
            </div>

            {/* Help & Guide */}
            <button
              id="header-help-btn"
              onClick={() => setShowGuideModal(true)}
              className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#1E232F] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quy chuẩn</span>
            </button>

            {/* Reset */}
            <button
              id="header-reset-all-btn"
              onClick={onResetAll}
              className="flex items-center gap-1 text-xs text-[#848E9C] hover:text-[#F6465D] px-2.5 py-1.5 rounded-lg hover:bg-[#1E232F] transition-colors"
              title="Đặt lại toàn bộ thông số về mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>
        </div>
      </header>

      {/* Guide Modal */}
      {showGuideModal && (
        <div id="guide-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div id="guide-modal-card" className="bg-[#121722] border border-[#232936] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-[#1E232F] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#0ECB81]" />
                <h3 className="font-bold text-white text-base">Quy chuẩn Tính toán Tài chính</h3>
              </div>
              <button
                id="close-guide-modal-btn"
                onClick={() => setShowGuideModal(false)}
                className="text-[#848E9C] hover:text-white text-sm px-2 py-1 rounded-md hover:bg-[#1E232F]"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#B7BDC6] leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <div className="p-3 bg-[#161A25] rounded-xl border border-[#232936]">
                <h4 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <span>🇻🇳</span> Chứng Khoán Việt Nam (HOSE / HNX)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[#848E9C]">
                  <li><strong>Quy định lô chẵn:</strong> Làm tròn bội số 100 cổ phiếu. Hệ thống tự động làm tròn xuống để không vượt quá mức rủi ro hoặc vốn khả dụng.</li>
                  <li><strong>Thuế & Phí hòa vốn:</strong> Phí giao dịch mua/bán mặc định 0.1% (tùy cty chứng khoán) + Thuế TNCN khi bán 0.1% theo quy định Bộ Tài chính.</li>
                  <li><strong>Tỷ lệ R/R:</strong> Khuyến nghị &gt; 1:2 (Xanh lá). Dưới 1:1.5 sẽ cảnh báo Đỏ.</li>
                </ul>
              </div>

              <div className="p-3 bg-[#161A25] rounded-xl border border-[#232936]">
                <h4 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                  <span>🌐</span> Phái Sinh Quốc Tế (Binance / Exness)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-[#848E9C]">
                  <li><strong>Giá cháy (Liquidation):</strong> Công thức chuẩn Binance Futures bao gồm Tỷ lệ ký quỹ duy trì (MMR ~0.4% - 0.5%).</li>
                  <li><strong>Đòn bẩy:</strong> Hỗ trợ thanh kéo trượt mượt mà từ x1 đến x125 kèm các nút tắt nhanh.</li>
                  <li><strong>Tỷ giá P2P:</strong> Dùng để quy đổi trực tiếp Lãi/Lỗ hoặc Vốn ra VNĐ theo giá chợ P2P thời gian thực.</li>
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#1E232F] flex justify-end">
              <button
                id="guide-modal-ok-btn"
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-2 bg-[#0ECB81] hover:bg-[#0bb974] text-black font-semibold rounded-lg text-xs"
              >
                Đã hiểu, Bắt đầu tính!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
