import React, { useState } from 'react';
import { 
  Flame, 
  ShieldAlert, 
  BadgePercent, 
  DollarSign, 
  LayoutGrid, 
  BrainCircuit
} from 'lucide-react';
import { CryptoLiquidationCard } from './CryptoLiquidationCard';
import { CryptoPositionSizeCard } from './CryptoPositionSizeCard';
import { CryptoFeeCard } from './CryptoFeeCard';
import { CryptoPnlCard } from './CryptoPnlCard';
import { KellyCompoundCard } from '../advanced/KellyCompoundCard';

interface CryptoDashboardProps {
  p2pRate: number;
  onUpdateP2pRate: (rate: number) => void;
}

type CryptoToolTab = 'all' | 'liquidation' | 'risk_size' | 'fee' | 'pnl' | 'kelly';

export const CryptoDashboard: React.FC<CryptoDashboardProps> = ({ p2pRate, onUpdateP2pRate }) => {
  const [activeTab, setActiveTab] = useState<CryptoToolTab>('all');

  return (
    <div className="space-y-6">
      {/* Category Banner & Tool Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#121722] border border-[#232936] p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0ECB81]/15 text-[#0ECB81] flex items-center justify-center font-bold text-xl border border-[#0ECB81]/30">
            🌐
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Crypto & Sàn Quốc Tế</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/20">
                Binance • Exness • Bybit
              </span>
            </div>
            <p className="text-xs text-[#848E9C]">
              Tính giá cháy, quản trị rủi ro position size, phí futures & thuật toán Kelly
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
            onClick={() => setActiveTab('liquidation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'liquidation'
                ? 'bg-[#F6465D]/20 text-[#F6465D] border border-[#F6465D]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Giá Cháy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('risk_size')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'risk_size'
                ? 'bg-[#00B4D8]/20 text-[#00B4D8] border border-[#00B4D8]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Risk Size</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fee')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'fee'
                ? 'bg-[#F0B90B]/20 text-[#F0B90B] border border-[#F0B90B]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <BadgePercent className="w-3.5 h-3.5" />
            <span>Phí & Funding</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pnl')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'pnl'
                ? 'bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/40'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>PnL & P2P</span>
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
            <span>Kelly & Slippage</span>
          </button>
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(activeTab === 'all' || activeTab === 'liquidation') && (
          <CryptoLiquidationCard />
        )}

        {(activeTab === 'all' || activeTab === 'risk_size') && (
          <CryptoPositionSizeCard />
        )}

        {(activeTab === 'all' || activeTab === 'fee') && (
          <CryptoFeeCard p2pRate={p2pRate} />
        )}

        {(activeTab === 'all' || activeTab === 'pnl') && (
          <CryptoPnlCard p2pRate={p2pRate} onUpdateP2pRate={onUpdateP2pRate} />
        )}
      </div>

      {/* Kelly Criterion, Slippage & Compound Growth Suite */}
      {(activeTab === 'all' || activeTab === 'kelly') && (
        <KellyCompoundCard />
      )}
    </div>
  );
};
