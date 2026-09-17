import { useState, useEffect, useMemo, useCallback } from 'react';
import { CryptoSymbolInfo, POPULAR_SYMBOLS } from '../data/symbols';

const CACHE_KEY = 'binance_all_symbols_cache_v2';
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// Helper to deduce emoji based on symbol name
export function getEmojiForSymbol(baseAsset: string): string {
  const b = baseAsset.toUpperCase();
  if (b.includes('BTC')) return '₿';
  if (b.includes('ETH')) return 'Ξ';
  if (b.includes('SOL')) return '◎';
  if (b.includes('BNB')) return '🟡';
  if (b.includes('XAU') || b.includes('PAXG') || b.includes('GOLD')) return '🥇';
  if (b.includes('DOGE')) return '🐕';
  if (b.includes('SHIB')) return '🐶';
  if (b.includes('PEPE')) return '🐸';
  if (b.includes('WIF')) return '🧢';
  if (b.includes('BONK')) return '🔨';
  if (b.includes('FLOKI')) return '⚔️';
  if (b.includes('POPCAT') || b.includes('MEW') || b.includes('CAT')) return '🐱';
  if (b.includes('SUI')) return '💧';
  if (b.includes('SEI')) return '🔴';
  if (b.includes('TIA')) return '🪐';
  if (b.includes('RENDER') || b.includes('RNDR')) return '🎨';
  if (b.includes('FET') || b.includes('TAO') || b.includes('AI') || b.includes('WLD')) return '🧠';
  if (b.includes('TON') || b.includes('NOT')) return '💎';
  if (b.includes('NEAR')) return 'Ⓝ';
  if (b.includes('AVAX')) return '🔺';
  if (b.includes('ADA')) return '₳';
  if (b.includes('XRP')) return '✕';
  if (b.includes('LINK')) return '🔗';
  if (b.includes('ARB') || b.includes('OP')) return '⚡';
  if (b.includes('PENDLE') || b.includes('ENA') || b.includes('UNI') || b.includes('AAVE')) return '🏦';
  if (b.includes('EUR') || b.includes('USD')) return '💶';
  return '🪙';
}

// Categorize token
export function getCategoryForSymbol(baseAsset: string): 'major' | 'altcoin' | 'meme' | 'forex' {
  const b = baseAsset.toUpperCase();
  if (['BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'AVAX'].includes(b)) return 'major';
  if (b.includes('XAU') || b.includes('PAXG') || b.includes('EUR') || b.includes('GBP')) return 'forex';
  if (
    b.includes('PEPE') ||
    b.includes('DOGE') ||
    b.includes('SHIB') ||
    b.includes('WIF') ||
    b.includes('BONK') ||
    b.includes('FLOKI') ||
    b.includes('MEME') ||
    b.includes('BOME') ||
    b.includes('POPCAT') ||
    b.includes('MEW') ||
    b.includes('NEIRO') ||
    b.includes('RATS') ||
    b.includes('SATS') ||
    b.includes('TURBO')
  ) {
    return 'meme';
  }
  return 'altcoin';
}

// Derive decimals from tickSize (e.g. 0.0001 -> 4, 0.1 -> 1, 0.00000001 -> 8)
export function getDecimalsFromTickSize(tickSizeStr: string | number): number {
  if (typeof tickSizeStr === 'number') {
    if (tickSizeStr >= 1) return 2;
    const str = tickSizeStr.toString();
    if (str.includes('e-')) {
      const parts = str.split('e-');
      return parseInt(parts[1], 10) || 4;
    }
    const dec = str.split('.')[1];
    return dec ? dec.length : 2;
  }
  const num = parseFloat(tickSizeStr);
  if (isNaN(num) || num >= 1) return 2;
  const decPart = tickSizeStr.split('.')[1];
  if (!decPart) return 2;
  return decPart.length;
}

// Build a fallback symbol object for any user-input or unknown coin
export function findOrBuildSymbol(
  rawSymbol: string,
  existingList: CryptoSymbolInfo[] = POPULAR_SYMBOLS
): CryptoSymbolInfo {
  if (!rawSymbol) return POPULAR_SYMBOLS[0];
  const clean = rawSymbol.toUpperCase().trim();

  // Try exact or alias match
  const found = existingList.find(
    (s) =>
      s.symbol.toUpperCase() === clean ||
      s.displayName.toUpperCase() === clean ||
      s.baseAsset.toUpperCase() === clean
  );
  if (found) return found;

  // Handle Gold Spot special alias
  if (clean === 'XAUUSD' || clean === 'XAU/USD' || clean === 'GOLD') {
    return {
      symbol: 'XAUUSD',
      displayName: 'XAU/USD',
      name: 'Vàng Thế Giới (Gold Spot)',
      baseAsset: 'XAU',
      quoteAsset: 'USD',
      category: 'forex',
      decimals: 2,
      tickSize: 0.01,
      defaultPrice: 2515.8,
      iconEmoji: '🥇',
    };
  }

  // Format pair cleanly
  const baseAsset = clean.endsWith('USDT')
    ? clean.replace(/USDT$/, '')
    : clean.endsWith('BUSD')
    ? clean.replace(/BUSD$/, '')
    : clean.replace(/\/.*/, '');
  const quoteAsset = clean.includes('/') ? clean.split('/')[1] : 'USDT';
  const symbol = `${baseAsset}${quoteAsset}`.replace('/', '');
  const displayName = `${baseAsset}/${quoteAsset}`;

  const category = getCategoryForSymbol(baseAsset);
  const isMeme = category === 'meme';
  const decimals = isMeme ? 8 : 4;
  const tickSize = isMeme ? 0.00000001 : 0.0001;

  return {
    symbol,
    displayName,
    name: baseAsset,
    baseAsset,
    quoteAsset,
    category,
    decimals,
    tickSize,
    defaultPrice: isMeme ? 0.00001 : 1.0,
    iconEmoji: getEmojiForSymbol(baseAsset),
  };
}

export interface UseBinanceSymbolsReturn {
  symbols: CryptoSymbolInfo[];
  popularSymbols: CryptoSymbolInfo[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  searchSymbols: (query: string, categoryFilter?: string) => CryptoSymbolInfo[];
  getSymbolInfo: (symbol: string) => CryptoSymbolInfo;
  refetch: () => Promise<void>;
}

export function useBinanceSymbols(): UseBinanceSymbolsReturn {
  const [symbols, setSymbols] = useState<CryptoSymbolInfo[]>(() => {
    // Check cached symbols in localStorage
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_EXPIRY_MS && Array.isArray(parsed.data) && parsed.data.length > 50) {
          return parsed.data;
        }
      }
    } catch {
      // Ignore localStorage errors
    }
    return POPULAR_SYMBOLS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchAllSymbols = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      // We prioritize Binance Futures exchangeInfo as it has all 350+ perpetual contracts with tickSize & precision
      let data: any = null;
      try {
        const res = await fetch('https://fapi.binance.com/fapi/v1/exchangeInfo', {
          signal: controller.signal,
        });
        if (res.ok) {
          data = await res.json();
        }
      } catch {
        // Fallback to spot exchangeInfo if futures endpoint is blocked
        try {
          const spotRes = await fetch('https://api.binance.com/api/v3/exchangeInfo', {
            signal: controller.signal,
          });
          if (spotRes.ok) {
            data = await spotRes.json();
          }
        } catch {
          data = null;
        }
      } finally {
        clearTimeout(timeoutId);
      }

      if (data && Array.isArray(data.symbols)) {
        const parsedSymbols: CryptoSymbolInfo[] = [];
        const seenSymbols = new Set<string>();

        // First, add all POPULAR_SYMBOLS with their curated metadata
        for (const pop of POPULAR_SYMBOLS) {
          parsedSymbols.push(pop);
          seenSymbols.add(pop.symbol.toUpperCase());
        }

        // Process Binance exchange symbols
        for (const item of data.symbols) {
          // Only active USDT pairs (status TRADING)
          if (
            (item.status === 'TRADING' || item.contractType === 'PERPETUAL') &&
            item.quoteAsset === 'USDT'
          ) {
            const sym = item.symbol.toUpperCase();
            if (seenSymbols.has(sym)) continue;
            seenSymbols.add(sym);

            // Extract tickSize filter
            let tickSize = 0.0001;
            let decimals = item.pricePrecision ?? 4;

            if (Array.isArray(item.filters)) {
              const priceFilter = item.filters.find(
                (f: any) => f.filterType === 'PRICE_FILTER'
              );
              if (priceFilter && priceFilter.tickSize) {
                tickSize = parseFloat(priceFilter.tickSize);
                decimals = getDecimalsFromTickSize(priceFilter.tickSize);
              }
            }

            const baseAsset = item.baseAsset || sym.replace(/USDT$/, '');
            const category = getCategoryForSymbol(baseAsset);
            const iconEmoji = getEmojiForSymbol(baseAsset);

            parsedSymbols.push({
              symbol: sym,
              displayName: `${baseAsset}/USDT`,
              name: baseAsset,
              baseAsset,
              quoteAsset: 'USDT',
              category,
              decimals: Math.min(Math.max(decimals, 1), 8),
              tickSize: tickSize > 0 ? tickSize : 0.0001,
              defaultPrice: 0,
              iconEmoji,
            });
          }
        }

        if (parsedSymbols.length > POPULAR_SYMBOLS.length) {
          setSymbols(parsedSymbols);
          try {
            localStorage.setItem(
              CACHE_KEY,
              JSON.stringify({
                timestamp: Date.now(),
                data: parsedSymbols,
              })
            );
          } catch {
            // Ignore
          }
        }
      }
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If we only have the initial default popular symbols, fetch the full 350+ list
    if (symbols.length <= POPULAR_SYMBOLS.length) {
      fetchAllSymbols();
    }
  }, [fetchAllSymbols, symbols.length]);

  // Fast search helper supporting prefix, substring, and fuzzy matching
  const searchSymbols = useCallback(
    (query: string, categoryFilter: string = 'all'): CryptoSymbolInfo[] => {
      let pool = symbols;
      if (categoryFilter && categoryFilter !== 'all') {
        pool = pool.filter((s) => s.category === categoryFilter);
      }

      if (!query.trim()) {
        return pool;
      }

      const q = query.toLowerCase().trim();

      // Special aliases for Vietnamese search
      if (q === 'vang' || q === 'vàng' || q === 'gold') {
        return pool.filter((s) => s.symbol === 'XAUUSD' || s.baseAsset === 'XAU');
      }

      const exactMatches: CryptoSymbolInfo[] = [];
      const prefixMatches: CryptoSymbolInfo[] = [];
      const containsMatches: CryptoSymbolInfo[] = [];

      for (const s of pool) {
        const sym = s.symbol.toLowerCase();
        const base = s.baseAsset.toLowerCase();
        const disp = s.displayName.toLowerCase();
        const name = s.name.toLowerCase();

        if (base === q || sym === q || disp === q) {
          exactMatches.push(s);
        } else if (base.startsWith(q) || sym.startsWith(q)) {
          prefixMatches.push(s);
        } else if (base.includes(q) || sym.includes(q) || name.includes(q)) {
          containsMatches.push(s);
        }
      }

      return [...exactMatches, ...prefixMatches, ...containsMatches];
    },
    [symbols]
  );

  const getSymbolInfo = useCallback(
    (symbol: string): CryptoSymbolInfo => {
      return findOrBuildSymbol(symbol, symbols);
    },
    [symbols]
  );

  return {
    symbols,
    popularSymbols: POPULAR_SYMBOLS,
    isLoading,
    isError,
    totalCount: symbols.length,
    searchSymbols,
    getSymbolInfo,
    refetch: fetchAllSymbols,
  };
}
