import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  Radio, 
  Sparkles, 
  Check, 
  X, 
  ArrowRight,
  Flame,
  Globe,
  Coins,
  Loader2
} from 'lucide-react';
import { CryptoSymbolInfo, POPULAR_SYMBOLS, findOrBuildSymbol } from '../../data/symbols';
import { useBinanceSymbols } from '../../hooks/useBinanceSymbols';
import { useBinancePrice } from '../../hooks/useBinancePrice';
import { formatTokenPrice } from '../../utils/formatters';
import { PriceRange24hBar } from './PriceRange24hBar';

interface SymbolSelectorProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: CryptoSymbolInfo) => void;
  onApplyPrice?: (price: number) => void;
  onLivePriceChange?: (price: number, direction: 'up' | 'down' | 'flat', change24h: number) => void;
  autoApplyToEntry?: boolean;
  showRangeBar?: boolean;
  onSetStopLoss?: (price: number) => void;
  onSetTakeProfit?: (price: number) => void;
}

export const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  selectedSymbol,
  onSelectSymbol,
  onApplyPrice,
  onLivePriceChange,
  showRangeBar = false,
  onSetStopLoss,
  onSetTakeProfit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'hot' | 'meme' | 'altcoin' | 'major' | 'forex'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Load all 350+ Binance trading pairs dynamically
  const { 
    symbols: allSymbols, 
    popularSymbols, 
    isLoading: isLoadingSymbols, 
    totalCount,
    searchSymbols 
  } = useBinanceSymbols();

  // Hook for live Binance price stream of the selected coin
  const {
    price = 0,
    change24h = 0,
    high24h = 0,
    low24h = 0,
    isLoading = false,
    priceDirection = 'flat',
    isWsConnected = false,
    connectionType = 'websocket',
    refetch,
    isLive = true,
    symbolInfo,
  } = useBinancePrice(selectedSymbol || 'BTCUSDT');

  // Notify parent on price tick
  useEffect(() => {
    if (price > 0 && onLivePriceChange) {
      onLivePriceChange(price, priceDirection, change24h);
    }
  }, [price, priceDirection, change24h, onLivePriceChange]);

  // Filter symbols based on category and search query
  const filteredSymbols = useMemo(() => {
    let list: CryptoSymbolInfo[] = [];

    if (activeCategory === 'hot') {
      list = popularSymbols;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        list = list.filter(
          (s) =>
            s.symbol.toLowerCase().includes(q) ||
            s.baseAsset.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q)
        );
      }
    } else {
      const catParam = activeCategory === 'all' ? undefined : activeCategory;
      list = searchSymbols(searchQuery, catParam);
    }

    // Limit maximum rendered items to 60 for 60fps instant search rendering
    return list.slice(0, 60);
  }, [searchQuery, activeCategory, popularSymbols, searchSymbols]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSelect = (sym: CryptoSymbolInfo) => {
    if (!sym) return;
    onSelectSymbol(sym);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectCustomQuery = () => {
    if (!searchQuery.trim()) return;
    const custom = findOrBuildSymbol(searchQuery.trim(), allSymbols);
    handleSelect(custom);
  };

  const handleApplyCurrentPrice = () => {
    if (typeof price === 'number' && price > 0 && onApplyPrice) {
      onApplyPrice(price);
    }
  };

  // Top quick-select pills displayed on the bar for 1-click access
  const quickPills = [
    { key: 'BTCUSDT', label: 'BTC', emoji: '₿' },
    { key: 'ETHUSDT', label: 'ETH', emoji: 'Ξ' },
    { key: 'SOLUSDT', label: 'SOL', emoji: '◎' },
    { key: 'BNBUSDT', label: 'BNB', emoji: '🟡' },
    { key: 'XAUUSD', label: 'VÀNG (Gold)', emoji: '🥇' },
    { key: 'PEPEUSDT', label: 'PEPE', emoji: '🐸' },
    { key: 'SUIUSDT', label: 'SUI', emoji: '💧' },
    { key: 'WIFUSDT', label: 'WIF', emoji: '🧢' },
    { key: 'DOGEUSDT', label: 'DOGE', emoji: '🐕' },
    { key: 'RENDERUSDT', label: 'RENDER', emoji: '🎨' },
    { key: 'TIAUSDT', label: 'TIA', emoji: '🪐' },
  ];

  const safeDecimals = symbolInfo?.decimals ?? 2;
  const safeChange = typeof change24h === 'number' && !isNaN(change24h) ? change24h : 0;

  // Active symbol object for display
  const currentSymbolObject = symbolInfo || findOrBuildSymbol(selectedSymbol, allSymbols);

  return (
    <div id="crypto-symbol-selector" className="space-y-2.5 pb-3 border-b border-[#1E232F]" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Dropdown Trigger */}
        <div className="relative flex-1">
          <button
            id="btn-symbol-dropdown"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-2 bg-[#161A25] hover:bg-[#1C212E] border border-[#232936] hover:border-[#384152] px-3 py-2 rounded-xl text-left transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-base sm:text-lg flex items-center justify-center w-7 h-7 rounded-lg bg-[#232936]/90 shrink-0 group-hover:scale-105 transition-transform">
                {currentSymbolObject.iconEmoji || '🪙'}
              </span>
              <div className="truncate">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-white text-xs sm:text-sm font-mono tracking-tight">
                    {currentSymbolObject.displayName || selectedSymbol || 'BTC/USDT'}
                  </span>
                  {safeChange !== 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                        safeChange >= 0
                          ? 'bg-[#0ECB81]/20 text-[#0ECB81] border border-[#0ECB81]/30'
                          : 'bg-[#F6465D]/20 text-[#F6465D] border border-[#F6465D]/30'
                      }`}
                    >
                      {safeChange >= 0 ? '+' : ''}{safeChange.toFixed(2)}%
                    </span>
                  )}
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#232936] text-[#848E9C]">
                    {currentSymbolObject.name || 'Crypto'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 text-[#848E9C]">
              <span className="text-[10px] font-mono hidden md:inline-block px-1.5 py-0.5 rounded bg-[#0B0E14] text-[#848E9C]">
                {totalCount > 50 ? `${totalCount}+ coin` : 'Binance Live'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
            </div>
          </button>

          {/* Autocomplete Dropdown Menu */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#121722] border border-[#2B313F] rounded-2xl shadow-2xl p-3 space-y-2.5 max-h-96 overflow-hidden flex flex-col backdrop-blur-xl">
              {/* Search input with live status */}
              <div className="space-y-1.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#848E9C] absolute left-3 top-2.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && filteredSymbols.length > 0) {
                        handleSelect(filteredSymbols[0]);
                      } else if (e.key === 'Enter' && searchQuery.trim()) {
                        handleSelectCustomQuery();
                      }
                    }}
                    placeholder="Tìm kiếm 350+ coin Binance: PEPE, SUI, TIA, WIF, SOL, Vàng..."
                    className="w-full bg-[#0B0E14] border border-[#232936] focus:border-[#0ECB81] rounded-xl pl-9 pr-8 py-2 text-xs text-white font-mono placeholder:text-[#848E9C] focus:outline-none transition-colors"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-[#848E9C] hover:text-white"
                      title="Xóa tìm kiếm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    isLoadingSymbols && (
                      <Loader2 className="w-3.5 h-3.5 text-[#0ECB81] animate-spin absolute right-2.5 top-2.5" />
                    )
                  )}
                </div>

                {/* Category Filter Chips */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[10px]">
                  <button
                    type="button"
                    onClick={() => setActiveCategory('all')}
                    className={`px-2 py-0.5 rounded-lg font-mono transition-all shrink-0 ${
                      activeCategory === 'all'
                        ? 'bg-[#0ECB81] text-black font-bold'
                        : 'bg-[#181D29] text-[#848E9C] hover:text-white'
                    }`}
                  >
                    Tất cả ({totalCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('hot')}
                    className={`px-2 py-0.5 rounded-lg font-mono transition-all shrink-0 flex items-center gap-1 ${
                      activeCategory === 'hot'
                        ? 'bg-[#F0B90B] text-black font-bold'
                        : 'bg-[#181D29] text-[#848E9C] hover:text-white'
                    }`}
                  >
                    <Flame className="w-2.5 h-2.5" />
                    <span>Hot ({popularSymbols.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('meme')}
                    className={`px-2 py-0.5 rounded-lg font-mono transition-all shrink-0 ${
                      activeCategory === 'meme'
                        ? 'bg-[#0ECB81] text-black font-bold'
                        : 'bg-[#181D29] text-[#848E9C] hover:text-white'
                    }`}
                  >
                    🐸 Meme
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('altcoin')}
                    className={`px-2 py-0.5 rounded-lg font-mono transition-all shrink-0 ${
                      activeCategory === 'altcoin'
                        ? 'bg-[#0ECB81] text-black font-bold'
                        : 'bg-[#181D29] text-[#848E9C] hover:text-white'
                    }`}
                  >
                    ⚡ Altcoin
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('major')}
                    className={`px-2 py-0.5 rounded-lg font-mono transition-all shrink-0 ${
                      activeCategory === 'major'
                        ? 'bg-[#0ECB81] text-black font-bold'
                        : 'bg-[#181D29] text-[#848E9C] hover:text-white'
                    }`}
                  >
                    👑 Top Coins
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCategory('forex')}
                    className={`px-2 py-0.5 rounded-lg font-mono transition-all shrink-0 ${
                      activeCategory === 'forex'
                        ? 'bg-[#0ECB81] text-black font-bold'
                        : 'bg-[#181D29] text-[#848E9C] hover:text-white'
                    }`}
                  >
                    🥇 Vàng / Forex
                  </button>
                </div>
              </div>

              {/* Dynamic Symbol List */}
              <div className="overflow-y-auto space-y-1 pr-1 flex-1 max-h-60 scrollbar-thin">
                {filteredSymbols.map((sym) => {
                  const isSelected = sym.symbol.toUpperCase() === selectedSymbol.toUpperCase();
                  return (
                    <button
                      key={sym.symbol}
                      type="button"
                      onClick={() => handleSelect(sym)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isSelected
                          ? 'bg-[#0ECB81]/15 text-white border border-[#0ECB81]/30'
                          : 'hover:bg-[#181D29] text-[#848E9C] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#232936] text-xs shrink-0">
                          {sym.iconEmoji}
                        </span>
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs font-mono">{sym.displayName}</span>
                            <span className="text-[10px] text-[#848E9C] truncate max-w-[120px]">{sym.name}</span>
                          </div>
                          <span className="text-[9px] text-[#848E9C] block font-mono">
                            Tick: {sym.tickSize} • {sym.decimals} số thập phân
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1C212E] text-[#848E9C] font-mono uppercase">
                          {sym.category}
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-[#0ECB81]" />}
                      </div>
                    </button>
                  );
                })}

                {/* If searching a custom coin not yet in the filtered list */}
                {searchQuery.trim() && (
                  <div className="pt-1 border-t border-[#232936]">
                    <button
                      type="button"
                      onClick={handleSelectCustomQuery}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-left bg-[#0ECB81]/10 hover:bg-[#0ECB81]/20 border border-[#0ECB81]/30 text-white transition-all text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#0ECB81]" />
                        <div>
                          <span className="font-bold font-mono">Chọn mã &quot;{searchQuery.toUpperCase()}&quot;</span>
                          <span className="block text-[10px] text-[#848E9C]">Tự động kết nối WebSocket Binance Live</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#0ECB81]" />
                    </button>
                  </div>
                )}

                {filteredSymbols.length === 0 && !searchQuery.trim() && (
                  <div className="text-center py-6 text-xs text-[#848E9C]">
                    Đang tải danh sách 350+ cặp coin từ Binance...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Price Badge & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-2 bg-[#161A25] px-3 py-1.5 rounded-xl border border-[#232936]">
          {/* Live Price Tag with flash animation */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                {isLive && (
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isWsConnected ? 'bg-[#0ECB81]' : 'bg-[#F0B90B]'
                  }`}></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  !isLive ? 'bg-[#848E9C]' : isWsConnected ? 'bg-[#0ECB81]' : 'bg-[#F0B90B]'
                }`}></span>
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-[#232936] text-[#848E9C]">
                {isWsConnected ? 'WS' : 'REST'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className={`font-mono font-extrabold text-xs sm:text-sm tracking-tight transition-all duration-300 ${
                  priceDirection === 'up'
                    ? 'text-[#0ECB81] scale-105'
                    : priceDirection === 'down'
                    ? 'text-[#F6465D] scale-105'
                    : 'text-white'
                }`}
              >
                ${formatTokenPrice(price || 0, safeDecimals)}
              </span>

              {safeChange !== 0 && (
                <span
                  className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 ${
                    safeChange >= 0
                      ? 'bg-[#0ECB81]/15 text-[#0ECB81]'
                      : 'bg-[#F6465D]/15 text-[#F6465D]'
                  }`}
                >
                  {safeChange >= 0 ? '+' : ''}{safeChange.toFixed(2)}%
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons: Apply Price & Refresh */}
          <div className="flex items-center gap-1 border-l border-[#232936] pl-2">
            {onApplyPrice && (
              <button
                type="button"
                onClick={handleApplyCurrentPrice}
                className="px-2 py-1 rounded bg-[#0ECB81]/15 hover:bg-[#0ECB81] text-[#0ECB81] hover:text-black text-[11px] font-bold font-mono transition-all flex items-center gap-1"
                title="Điền giá thị trường hiện tại vào ô Giá Vào Lệnh (Entry)"
              >
                <span>Vào Entry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}

            <button
              type="button"
              onClick={() => refetch()}
              className={`p-1.5 rounded-lg text-[#848E9C] hover:text-white hover:bg-[#232936] transition-all ${
                isLoading ? 'animate-spin text-[#0ECB81]' : ''
              }`}
              title="Làm mới giá ngay lập tức"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Select Preset Pills Row (BTC, ETH, SOL, BNB, XAUUSD, PEPE, SUI, WIF...) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-0.5 scrollbar-none">
        <span className="text-[10px] text-[#848E9C] shrink-0 font-medium flex items-center gap-1">
          <Flame className="w-2.5 h-2.5 text-[#F0B90B]" />
          <span>Nhanh:</span>
        </span>
        {quickPills.map((pill) => {
          const isActive = pill.key.toUpperCase() === selectedSymbol.toUpperCase();
          return (
            <button
              key={pill.key}
              type="button"
              onClick={() => {
                const target = findOrBuildSymbol(pill.key, allSymbols);
                handleSelect(target);
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold transition-all shrink-0 flex items-center gap-1 ${
                isActive
                  ? 'bg-[#0ECB81] text-black font-bold shadow-sm'
                  : 'bg-[#161A25] text-[#848E9C] hover:text-white border border-[#232936] hover:border-[#384152]'
              }`}
            >
              <span>{pill.emoji}</span>
              <span>{pill.label}</span>
            </button>
          );
        })}
      </div>

      {/* 24h High/Low Range Bar for SL/TP Planning */}
      {showRangeBar && (
        <div className="pt-1">
          <PriceRange24hBar
            low24h={low24h}
            high24h={high24h}
            currentPrice={price}
            decimals={safeDecimals}
            quoteAsset={symbolInfo?.quoteAsset || 'USDT'}
            onSetStopLoss={onSetStopLoss}
            onSetTakeProfit={onSetTakeProfit}
          />
        </div>
      )}
    </div>
  );
};
