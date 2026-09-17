import React from 'react';
import { 
  TrendingUp, 
  Flame, 
  Percent, 
  Scale, 
  ShieldAlert, 
  Calculator, 
  ArrowRight, 
  Coins, 
  BadgePercent, 
  Sliders,
  DollarSign,
  PieChart,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { TradingCategory } from '../types';
import { formatVnd } from '../utils/formatters';

interface HomeSelectorProps {
  onSelectCategory: (category: TradingCategory) => void;
  p2pRate: number;
}

export const HomeSelector: React.FC<HomeSelectorProps> = ({ onSelectCategory, p2pRate }) => {
  return (
    <div className="space-y-8 py-4">
      {/* Hero Welcome Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E232F] border border-[#2B313F] text-xs text-[#0ECB81] font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#F0B90B]" />
          <span>Hệ thống Quản Trị Vốn & Tính Toán Siêu Tốc Chuẩn Pro</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Chọn Phân Vùng Giao Dịch
        </h1>
        <p className="text-sm sm:text-base text-[#848E9C] leading-relaxed">
          Ứng dụng thiết kế chuyên biệt cho thị trường Việt Nam (lô 100, thuế phí VNĐ) 
          và Phái sinh Quốc tế (đòn bẩy x1-x125, giá cháy, quy đổi P2P).
        </p>
      </div>

      {/* The 2 Primary Category Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* CARD 1: 🇻🇳 CHỨNG KHOÁN VIỆT NAM */}
        <div 
          id="category-card-vn"
          className="group relative rounded-2xl bg-gradient-to-b from-[#161A25] to-[#121620] border border-[#232936] hover:border-[#EF4444]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#EF4444]/10 p-6 flex flex-col justify-between"
        >
          {/* Top Badge */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🇻🇳</span>
              <div>
                <span className="text-[11px] font-bold text-[#EF4444] uppercase tracking-wider bg-[#EF4444]/10 px-2 py-0.5 rounded border border-[#EF4444]/20">
                  Spot Stock Trading
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 group-hover:text-[#EF4444] transition-colors">
                  Chứng Khoán Việt Nam
                </h2>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#848E9C] block">HOSE • HNX</span>
              <span className="text-[11px] text-[#0ECB81] font-mono bg-[#0ECB81]/10 px-2 py-0.5 rounded">Lô chẵn 100</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#848E9C] mb-5">
            Đơn vị tính: <strong>VNĐ</strong>. Tuân thủ chuẩn khớp lệnh lô 100 cổ phiếu, khấu trừ tự động phí sàn và thuế TNCN 0.1%.
          </p>

          {/* 4 Core Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#EF4444]/10 text-[#EF4444] shrink-0 mt-0.5">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">1. Position Size (Lô 100 CP)</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Nhập vốn VNĐ + % Rủi ro/lệnh &rarr; Tính chính xác số cổ phiếu được giải ngân, tự động làm tròn lô 100.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#F0B90B]/10 text-[#F0B90B] shrink-0 mt-0.5">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">2. Break-even & Phí Thuế Nhà Nước</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Cộng phí mua/bán (0.1%) + Thuế TNCN (0.1%) &rarr; Ra giá bán hòa vốn thực tế và % tăng tối thiểu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] shrink-0 mt-0.5">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">3. DCA Trung Bình Giá & % Về Bờ</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Tính giá vốn trung bình nhiều lần gom và % giá cần bật tăng từ đáy để tài khoản hoàn vốn (về bờ).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#0ECB81]/10 text-[#0ECB81] shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">4. Tỷ Lệ Risk / Reward (R/R)</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Tính tỷ lệ 1 : X. Báo <span className="text-[#0ECB81] font-semibold">Xanh</span> nếu &gt; 1:2 và cảnh báo <span className="text-[#EF4444] font-semibold">Đỏ</span> nếu &lt; 1:1.5.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <button
            id="btn-open-vn-category"
            onClick={() => onSelectCategory('vn')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#EF4444]/20 group-hover:translate-y-[-1px]"
          >
            <span>Mở Bảng Tính Chứng Khoán VN</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* CARD 2: 🌐 CRYPTO / FOREX / SÀN QUỐC TẾ */}
        <div 
          id="category-card-crypto"
          className="group relative rounded-2xl bg-gradient-to-b from-[#161A25] to-[#121620] border border-[#232936] hover:border-[#0ECB81]/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-[#0ECB81]/10 p-6 flex flex-col justify-between"
        >
          {/* Top Badge */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌐</span>
              <div>
                <span className="text-[11px] font-bold text-[#0ECB81] uppercase tracking-wider bg-[#0ECB81]/10 px-2 py-0.5 rounded border border-[#0ECB81]/20">
                  Futures & Forex
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 group-hover:text-[#0ECB81] transition-colors">
                  Crypto / Forex Quốc Tế
                </h2>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-[#848E9C] block">Binance • Exness</span>
              <span className="text-[11px] text-[#F0B90B] font-mono bg-[#F0B90B]/10 px-2 py-0.5 rounded">Đòn bẩy x1 - x125</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#848E9C] mb-5">
            Đơn vị tính: <strong>USDT / Lot</strong>. Slider kéo thả 1 tay siêu mượt, tính giá cháy chuẩn Binance và quy đổi P2P ra VNĐ.
          </p>

          {/* 4 Core Features */}
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#F6465D]/10 text-[#F6465D] shrink-0 mt-0.5">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">1. Liquidation (Tính Giá Cháy)</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Thanh trượt đòn bẩy x1 - x125, chọn Long/Short, Cross/Isolated &rarr; Ra Giá Cháy và % khoảng cách an toàn.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#00B4D8]/10 text-[#00B4D8] shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">2. Risk % Position Size (USDT / Lot)</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Nhập vốn USDT + Số tiền chấp nhận mất &rarr; Ra Volume Token (BTC/ETH), giá trị vị thế và mức đòn bẩy gợi ý.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#F0B90B]/10 text-[#F0B90B] shrink-0 mt-0.5">
                <BadgePercent className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">3. Futures Fee & Funding Rate (8h)</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Tính phí Taker (0.05%), Maker (0.02%) và Funding Rate theo tổng quy mô vị thế (Vốn &times; Đòn bẩy).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0B0E14]/80 border border-[#1E232F] hover:border-[#2B313F] transition-colors">
              <div className="p-2 rounded-lg bg-[#0ECB81]/10 text-[#0ECB81] shrink-0 mt-0.5">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">4. PnL & Quy Đổi P2P Ra VNĐ</h4>
                <p className="text-[11px] text-[#848E9C]">
                  Dự tính ROE % và Lãi/Lỗ USDT, chuyển đổi tức thời sang tiền mặt VNĐ theo giá P2P ({formatVnd(p2pRate)}).
                </p>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <button
            id="btn-open-crypto-category"
            onClick={() => onSelectCategory('crypto')}
            className="w-full py-3.5 px-4 rounded-xl bg-[#0ECB81] hover:bg-[#0bb974] text-black font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0ECB81]/20 group-hover:translate-y-[-1px]"
          >
            <span>Mở Bảng Tính Crypto & Sàn Quốc Tế</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Feature Matrix / Highlights Bar */}
      <div className="max-w-6xl mx-auto bg-[#121722] border border-[#1E232F] rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-[#1E232F]">
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#F0B90B]" />
              Tiện Ích Tính Toán 1 Chạm Siêu Tốc
            </h3>
            <p className="text-xs text-[#848E9C]">
              Tối ưu cho cả màn hình điện thoại di động và máy tính, cập nhật kết quả theo từng mili-giây.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-2.5 py-1 bg-[#161A25] border border-[#2B313F] rounded-lg text-[#0ECB81] font-mono">
              ✓ 100% Client-Side
            </span>
            <span className="px-2.5 py-1 bg-[#161A25] border border-[#2B313F] rounded-lg text-[#F0B90B] font-mono">
              ✓ Slider Đòn Bẩy x125
            </span>
            <span className="px-2.5 py-1 bg-[#161A25] border border-[#2B313F] rounded-lg text-[#00B4D8] font-mono">
              ✓ Quy Chuẩn Lô 100 VN
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-center">
          <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#1E232F]">
            <span className="text-[11px] text-[#848E9C] block">Thuế Bán VN</span>
            <span className="text-sm font-bold text-white font-mono">0.1% TNCN</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#1E232F]">
            <span className="text-[11px] text-[#848E9C] block">Quy Chuẩn Khớp</span>
            <span className="text-sm font-bold text-white font-mono">Bội Số 100</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#1E232F]">
            <span className="text-[11px] text-[#848E9C] block">MMR Binance</span>
            <span className="text-sm font-bold text-white font-mono">0.4% - 0.5%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0B0E14] border border-[#1E232F]">
            <span className="text-[11px] text-[#848E9C] block">Tỷ Giá P2P Hiện Tại</span>
            <span className="text-sm font-bold text-[#0ECB81] font-mono">{formatVnd(p2pRate)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
