import React, { useState, useMemo } from 'react';
import { 
  BrainCircuit, 
  TrendingUp, 
  Percent, 
  AlertTriangle, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  LifeBuoy, 
  Coins 
} from 'lucide-react';
import { 
  calculateKellyCriterion, 
  calculateSlippageImpact, 
  calculateCompoundGrowth, 
  DRAWDOWN_RECOVERY_DATA 
} from '../../utils/calculations';
import { formatVnd, formatUsdt, formatPercent, formatTokenPrice } from '../../utils/formatters';
import { SymbolSelector } from '../common/SymbolSelector';
import { POPULAR_SYMBOLS, CryptoSymbolInfo } from '../../data/symbols';

export const KellyCompoundCard: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'kelly' | 'drawdown' | 'slippage'>('kelly');
  const [currentSymbol, setCurrentSymbol] = useState<CryptoSymbolInfo>(POPULAR_SYMBOLS[0]);

  // Kelly Inputs
  const [winRate, setWinRate] = useState<number>(55); // 55%
  const [rrRatio, setRrRatio] = useState<number>(2.0); // 1:2
  const [capital, setCapital] = useState<number>(5000); // 5,000 USDT
  const [fractionType, setFractionType] = useState<'full' | 'half' | 'quarter'>('half');

  // Slippage Inputs
  const [slipEntry, setSlipEntry] = useState<number>(65400);
  const [slipSl, setSlipSl] = useState<number>(63500);
  const [slipTp, setSlipTp] = useState<number>(68750);
  const [slippagePercent, setSlippagePercent] = useState<number>(0.1); // 0.1%
  const [spreadPercent, setSpreadPercent] = useState<number>(0.05); // 0.05%

  // Compound Simulator Inputs
  const [compoundCapital, setCompoundCapital] = useState<number>(1000);
  const [gainPerTrade, setGainPerTrade] = useState<number>(5); // 5%
  const [numberOfTrades, setNumberOfTrades] = useState<number>(20); // 20 trades
  const [reinvestRate, setReinvestRate] = useState<number>(100); // 100% compound

  // Computations
  const kellyResult = useMemo(() => {
    return calculateKellyCriterion({
      winRatePercent: winRate,
      riskRewardRatio: rrRatio,
      accountCapital: capital,
      fractionType,
    });
  }, [winRate, rrRatio, capital, fractionType]);

  const slippageResult = useMemo(() => {
    return calculateSlippageImpact({
      entryPrice: slipEntry,
      stopLossPrice: slipSl,
      takeProfitPrice: slipTp,
      slippagePercent,
      spreadPercent,
    });
  }, [slipEntry, slipSl, slipTp, slippagePercent, spreadPercent]);

  const compoundResult = useMemo(() => {
    return calculateCompoundGrowth({
      initialCapital: compoundCapital,
      gainPerTradePercent: gainPerTrade,
      numberOfTrades,
      reinvestPercent: reinvestRate,
    });
  }, [compoundCapital, gainPerTrade, numberOfTrades, reinvestRate]);

  const handleSelectSymbol = (sym: CryptoSymbolInfo) => {
    setCurrentSymbol(sym);
    if (sym.defaultPrice) {
      setSlipEntry(sym.defaultPrice);
      setSlipSl(+(sym.defaultPrice * 0.97).toFixed(sym.decimals));
      setSlipTp(+(sym.defaultPrice * 1.06).toFixed(sym.decimals));
    }
  };

  const handleApplyPrice = (livePrice: number) => {
    setSlipEntry(livePrice);
    setSlipSl(+(livePrice * 0.97).toFixed(currentSymbol.decimals));
    setSlipTp(+(livePrice * 1.06).toFixed(currentSymbol.decimals));
  };

  return (
    <div id="kelly-compound-tool" className="bg-[#121722] border border-[#232936] rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E232F]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                Toán Học Giao Dịch & Quản Trị Vốn Chuyên Sâu
              </h3>
              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-[#00B4D8]/10 text-[#00B4D8] border border-[#00B4D8]/20">
                PRO MATH
              </span>
            </div>
            <p className="text-xs text-[#848E9C]">
              Công thức Kelly Criterion • Tác động Trượt Giá Slippage • Ma trận Về Bờ & Lãi Kép
            </p>
          </div>
        </div>

        {/* Sub-Tabs Switcher */}
        <div className="flex items-center gap-1 bg-[#161A25] p-1 rounded-xl border border-[#232936] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('kelly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'kelly'
                ? 'bg-[#00B4D8] text-black font-bold shadow-sm'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            Kelly Criterion
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('drawdown')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'drawdown'
                ? 'bg-[#00B4D8] text-black font-bold shadow-sm'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            Ma Trận Về Bờ
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('slippage')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'slippage'
                ? 'bg-[#00B4D8] text-black font-bold shadow-sm'
                : 'text-[#848E9C] hover:text-white'
            }`}
          >
            Trượt Giá Slippage
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: KELLY CRITERION */}
      {activeSubTab === 'kelly' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Inputs */}
            <div className="lg:col-span-2 space-y-4">
              {/* Win Rate Slider */}
              <div className="bg-[#161A25] p-4 rounded-xl border border-[#232936] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#848E9C] font-medium">Tỷ lệ Thắng (Win Rate W):</span>
                  <span className="font-mono text-base font-bold text-[#0ECB81]">{winRate}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="1"
                  value={winRate}
                  onChange={(e) => setWinRate(parseInt(e.target.value) || 50)}
                  className="w-full h-2 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#0ECB81]"
                />
                <div className="flex justify-between text-[10px] text-[#848E9C] font-mono">
                  <span>20% (Chiến lược Trend Following)</span>
                  <span>50%</span>
                  <span>90% (Scalping)</span>
                </div>
              </div>

              {/* R:R Ratio Slider */}
              <div className="bg-[#161A25] p-4 rounded-xl border border-[#232936] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#848E9C] font-medium">Tỷ lệ Lợi Nhuận / Rủi Ro (Reward : Risk R):</span>
                  <span className="font-mono text-base font-bold text-[#F0B90B]">1 : {rrRatio.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={rrRatio}
                  onChange={(e) => setRrRatio(parseFloat(e.target.value) || 1)}
                  className="w-full h-2 bg-[#232936] rounded-lg appearance-none cursor-pointer accent-[#F0B90B]"
                />
                <div className="flex justify-between text-[10px] text-[#848E9C] font-mono">
                  <span>1:0.5</span>
                  <span>1:2.0 (Khuyên dùng)</span>
                  <span>1:6.0 (Săn sóng lớn)</span>
                </div>
              </div>

              {/* Capital & Strategy Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936]">
                  <label className="text-xs text-[#848E9C] block mb-1">Tổng Vốn Tài Khoản ($):</label>
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#0B0E14] border border-[#232936] rounded-lg px-3 py-2 text-white font-mono text-sm focus:border-[#00B4D8] focus:outline-none"
                  />
                </div>

                <div className="bg-[#161A25] p-3 rounded-xl border border-[#232936]">
                  <label className="text-xs text-[#848E9C] block mb-1">Chiến Lược Kelly:</label>
                  <div className="grid grid-cols-3 gap-1 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setFractionType('full')}
                      className={`py-1 rounded text-xs font-semibold ${
                        fractionType === 'full'
                          ? 'bg-[#F6465D] text-white'
                          : 'bg-[#0B0E14] text-[#848E9C] hover:text-white'
                      }`}
                    >
                      Full Kelly
                    </button>
                    <button
                      type="button"
                      onClick={() => setFractionType('half')}
                      className={`py-1 rounded text-xs font-semibold ${
                        fractionType === 'half'
                          ? 'bg-[#00B4D8] text-black font-bold'
                          : 'bg-[#0B0E14] text-[#848E9C] hover:text-white'
                      }`}
                    >
                      Half (1/2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFractionType('quarter')}
                      className={`py-1 rounded text-xs font-semibold ${
                        fractionType === 'quarter'
                          ? 'bg-[#0ECB81] text-black font-bold'
                          : 'bg-[#0B0E14] text-[#848E9C] hover:text-white'
                      }`}
                    >
                      1/4 Kelly
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Kelly Result Card */}
            <div className="bg-[#161A25] border border-[#232936] rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-[#848E9C] pb-2 border-b border-[#232936]">
                  <span>KẾT QUẢ TỐI ƯU TOÁN HỌC</span>
                  <span className="font-mono text-[#00B4D8] font-bold">f* Kelly</span>
                </div>

                <div className="my-4">
                  <span className="text-xs text-[#848E9C] block">% Vốn Nên Đi Mỗi Lệnh:</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-4xl font-extrabold font-mono tracking-tight ${
                      kellyResult.fractionalKellyPercent > 0 ? 'text-[#00B4D8]' : 'text-[#F6465D]'
                    }`}>
                      {kellyResult.fractionalKellyPercent.toFixed(1)}%
                    </span>
                    <span className="text-xs text-[#848E9C]">/ lệnh</span>
                  </div>
                  <span className="text-sm font-bold font-mono text-white block mt-1">
                    ~ ${formatUsdt(kellyResult.recommendedRiskAmount)}
                  </span>
                </div>

                {/* Status Advice Box */}
                <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                  kellyResult.isWarning
                    ? 'bg-[#F6465D]/10 border-[#F6465D]/30 text-[#F6465D]'
                    : 'bg-[#0ECB81]/10 border-[#0ECB81]/30 text-[#0ECB81]'
                }`}>
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    {kellyResult.isWarning ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
                    <span>{kellyResult.warningMessage}</span>
                  </div>
                  <p className="text-[#848E9C] text-[11px]">{kellyResult.advice}</p>
                </div>
              </div>

              {/* Mathematical Expectancy */}
              <div className="pt-3 border-t border-[#232936] flex items-center justify-between text-xs">
                <span className="text-[#848E9C]">Kỳ Vọng Toán Học (EV/lệnh):</span>
                <span className={`font-mono font-bold ${
                  kellyResult.expectedValuePerTradePercent > 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                }`}>
                  {formatPercent(kellyResult.expectedValuePerTradePercent, true)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DRAWDOWN & RECOVERY */}
      {activeSubTab === 'drawdown' && (
        <div className="space-y-6">
          {/* Drawdown Matrix Table */}
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <LifeBuoy className="w-3.5 h-3.5 text-[#F6465D]" />
                Bảng Quy Đổi Ma Sát Gồng Lỗ (Drawdown vs Recovery %):
              </span>
              <span className="text-[11px] text-[#848E9C]">Toán học về sự bất đối xứng khi lỗ</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {DRAWDOWN_RECOVERY_DATA.slice(0, 8).map((row) => (
                <div
                  key={row.lossPercent}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                    row.lossPercent >= 50
                      ? 'bg-[#F6465D]/10 border-[#F6465D]/30'
                      : row.lossPercent >= 20
                      ? 'bg-[#F0B90B]/10 border-[#F0B90B]/30'
                      : 'bg-[#161A25] border-[#232936]'
                  }`}
                >
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-[#F6465D] font-bold">Lỗ -{row.lossPercent}%</span>
                    <ArrowRight className="w-3 h-3 text-[#848E9C]" />
                    <span className="text-[#0ECB81] font-bold">+{row.gainNeededPercent}%</span>
                  </div>
                  <span className="text-[10px] text-[#848E9C] mt-1">{row.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Compound Profit Simulator */}
          <div className="bg-[#161A25] p-4 rounded-xl border border-[#232936] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-[#0ECB81]" />
                Mô Phỏng Lãi Kép Chuỗi Thắng (Compound Growth Simulator):
              </span>
              <span className="text-[#0ECB81] font-mono font-bold">
                Tăng trưởng +{compoundResult.totalGainPercent.toFixed(1)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[#848E9C] block mb-1">Vốn Ban Đầu ($):</label>
                <input
                  type="number"
                  value={compoundCapital}
                  onChange={(e) => setCompoundCapital(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0B0E14] border border-[#232936] rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#848E9C] block mb-1">Lãi Mục Tiêu Mỗi Lệnh (%):</label>
                <input
                  type="number"
                  step="0.5"
                  value={gainPerTrade}
                  onChange={(e) => setGainPerTrade(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0B0E14] border border-[#232936] rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[#848E9C] block mb-1">Số Lệnh Thắng Liên Tiếp (N):</label>
                <input
                  type="number"
                  value={numberOfTrades}
                  onChange={(e) => setNumberOfTrades(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#0B0E14] border border-[#232936] rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-[#0B0E14] rounded-xl border border-[#1E232F] flex items-center justify-between text-xs">
              <div>
                <span className="text-[#848E9C] block text-[11px]">Vốn Sau {numberOfTrades} Lệnh:</span>
                <span className="text-xl font-bold font-mono text-[#0ECB81]">
                  ${compoundResult.finalCapital.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[#848E9C] block text-[11px]">Lợi Nhuận Thuần:</span>
                <span className="text-sm font-bold font-mono text-white">
                  +${compoundResult.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })} ({compoundResult.growthMultiplier.toFixed(2)}x)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SLIPPAGE & SPREAD IMPACT */}
      {activeSubTab === 'slippage' && (
        <div className="space-y-4">
          <div className="p-3 bg-[#161A25] rounded-xl border border-[#232936] text-xs text-[#848E9C]">
            Phí trượt giá (Slippage) khi khớp lệnh Market và chênh lệch Bid/Ask (Spread) là các chi phí ẩn ăn mòn nghiêm trọng tỷ lệ Risk/Reward thực tế của trader. Chọn token bên dưới để tính toán tự động:
          </div>

          {/* Symbol Selector inside Slippage */}
          <SymbolSelector
            selectedSymbol={currentSymbol.symbol}
            onSelectSymbol={handleSelectSymbol}
            onApplyPrice={handleApplyPrice}
          />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-[#848E9C] block mb-1">Giá Vào (Entry):</label>
              <input
                type="number"
                step={currentSymbol.tickSize || 'any'}
                value={slipEntry}
                onChange={(e) => setSlipEntry(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[#848E9C] block mb-1">Cắt Lỗ (SL):</label>
              <input
                type="number"
                step={currentSymbol.tickSize || 'any'}
                value={slipSl}
                onChange={(e) => setSlipSl(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[#848E9C] block mb-1">Chốt Lời (TP):</label>
              <input
                type="number"
                step={currentSymbol.tickSize || 'any'}
                value={slipTp}
                onChange={(e) => setSlipTp(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2 py-1.5 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[#848E9C] block mb-1">Trượt Giá (% Slippage):</label>
              <input
                type="number"
                step="0.05"
                value={slippagePercent}
                onChange={(e) => setSlippagePercent(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2 py-1.5 text-[#F0B90B] font-mono font-bold"
              />
            </div>
          </div>

          {/* Result Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Nominal R/R */}
            <div className="p-3.5 rounded-xl bg-[#161A25] border border-[#232936]">
              <span className="text-[11px] text-[#848E9C] block">Tỷ lệ R/R Lý Thuyết (Trên Chart):</span>
              <span className="text-2xl font-mono font-bold text-white block mt-1">
                1 : {slippageResult.nominalRatio.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#848E9C]">Chưa tính trượt giá & phí chênh lệch</span>
            </div>

            {/* Effective R/R */}
            <div className="p-3.5 rounded-xl bg-[#F6465D]/10 border border-[#F6465D]/30">
              <span className="text-[11px] text-[#F6465D] block font-semibold">Tỷ lệ R/R Thực Tế Sau Trượt Giá:</span>
              <span className="text-2xl font-mono font-bold text-[#F6465D] block mt-1">
                1 : {slippageResult.effectiveRatio.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#F6465D] font-bold">
                Bị ăn mòn -{slippageResult.ratioErosionPercent.toFixed(1)}% biên lợi nhuận
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
