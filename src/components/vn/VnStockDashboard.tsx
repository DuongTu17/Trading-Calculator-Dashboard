import React, { useState } from 'react';
import { 
  Percent, 
  Calculator, 
  Scale, 
  TrendingUp, 
  LayoutGrid,
  BrainCircuit
} from 'lucide-react';
import { VnPositionSizeCard } from './VnPositionSizeCard';
import { VnBreakEvenCard } from './VnBreakEvenCard';
import { VnDcaCard } from './VnDcaCard';
import { VnRiskRewardCard } from './VnRiskRewardCard';
import { KellyCompoundCard } from '../advanced/KellyCompoundCard';

type VnToolTab = 'all' | 'position_size' | 'breakeven' | 'dca' | 'risk_reward' | 'kelly';

export const VnStockDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<VnToolTab>('all');

  return (
    <div className="space-y-6">
      {/* Category Banner & Tool Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121722] border border-[#232936] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 text-[#EF4444] flex items-center justify-center font-bold text-xl border border-[#EF4444]/30">
            🇻🇳
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Chứng Khoán Việt Nam</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">
                HOSE • HNX • UPCOM
              </span>
            </div>
            <p className="text-xs text-[#848E9C]">
              Quy chuẩn lô 100 cổ phiếu • Phí giao dịch & Thuế TNCN 0.1% • DCA Về Bờ & Kelly
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-[#161A25] p-1 rounded-xl border border-[#232936] overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-[#2B313F] text-white shadow-sm'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tất cả</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('position_size')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'position_size'
                ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Lô 100 CP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('breakeven')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'breakeven'
                ? 'bg-[#F0B90B]/20 text-[#F0B90B] border border-[#F0B90B]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Hòa Vốn & Thuế</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dca')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'dca'
                ? 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>DCA Về Bờ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('risk_reward')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'risk_reward'
                ? 'bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tỷ Lệ R:R</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('kelly')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'kelly'
                ? 'bg-[#00B4D8] text-black font-bold shadow-sm'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Kelly & Về Bờ</span>
          </button>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(activeTab === 'all' || activeTab === 'position_size') && (
          <VnPositionSizeCard />
        )}

        {(activeTab === 'all' || activeTab === 'breakeven') && (
          <VnBreakEvenCard />
        )}

        {(activeTab === 'all' || activeTab === 'dca') && (
          <VnDcaCard />
        )}

        {(activeTab === 'all' || activeTab === 'risk_reward') && (
          <VnRiskRewardCard />
        )}
      </div>

      {/* Kelly Criterion & Drawdown Recovery Suite */}
      {(activeTab === 'all' || activeTab === 'kelly') && (
        <KellyCompoundCard />
      )}
    </div>
  );
};
