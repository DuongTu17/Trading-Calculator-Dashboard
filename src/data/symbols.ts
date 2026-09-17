export interface CryptoSymbolInfo {
  symbol: string;           // Binance symbol, e.g. "BTCUSDT"
  displayName: string;      // e.g. "BTC/USDT"
  name: string;             // e.g. "Bitcoin"
  baseAsset: string;        // e.g. "BTC"
  quoteAsset: string;       // e.g. "USDT"
  category: 'major' | 'altcoin' | 'meme' | 'forex';
  decimals: number;         // Decimal precision e.g. 2, 4, 8
  tickSize: number;         // Step size e.g. 0.1, 0.00000001
  defaultPrice: number;     // Fallback / initial estimated price
  iconEmoji: string;
}

export const POPULAR_SYMBOLS: CryptoSymbolInfo[] = [
  {
    symbol: 'BTCUSDT',
    displayName: 'BTC/USDT',
    name: 'Bitcoin',
    baseAsset: 'BTC',
    quoteAsset: 'USDT',
    category: 'major',
    decimals: 2,
    tickSize: 0.1,
    defaultPrice: 65400,
    iconEmoji: '₿',
  },
  {
    symbol: 'ETHUSDT',
    displayName: 'ETH/USDT',
    name: 'Ethereum',
    baseAsset: 'ETH',
    quoteAsset: 'USDT',
    category: 'major',
    decimals: 2,
    tickSize: 0.01,
    defaultPrice: 3450,
    iconEmoji: 'Ξ',
  },
  {
    symbol: 'SOLUSDT',
    displayName: 'SOL/USDT',
    name: 'Solana',
    baseAsset: 'SOL',
    quoteAsset: 'USDT',
    category: 'major',
    decimals: 2,
    tickSize: 0.01,
    defaultPrice: 152.5,
    iconEmoji: '◎',
  },
  {
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
  },
  {
    symbol: 'BNBUSDT',
    displayName: 'BNB/USDT',
    name: 'BNB Chain',
    baseAsset: 'BNB',
    quoteAsset: 'USDT',
    category: 'major',
    decimals: 2,
    tickSize: 0.01,
    defaultPrice: 575.2,
    iconEmoji: '🟡',
  },
  {
    symbol: 'DOGEUSDT',
    displayName: 'DOGE/USDT',
    name: 'Dogecoin',
    baseAsset: 'DOGE',
    quoteAsset: 'USDT',
    category: 'meme',
    decimals: 5,
    tickSize: 0.00001,
    defaultPrice: 0.1085,
    iconEmoji: '🐕',
  },
  {
    symbol: 'PEPEUSDT',
    displayName: 'PEPE/USDT',
    name: 'Pepe',
    baseAsset: 'PEPE',
    quoteAsset: 'USDT',
    category: 'meme',
    decimals: 8,
    tickSize: 0.00000001,
    defaultPrice: 0.00000785,
    iconEmoji: '🐸',
  },
  {
    symbol: 'SHIBUSDT',
    displayName: 'SHIB/USDT',
    name: 'Shiba Inu',
    baseAsset: 'SHIB',
    quoteAsset: 'USDT',
    category: 'meme',
    decimals: 8,
    tickSize: 0.00000001,
    defaultPrice: 0.0000142,
    iconEmoji: '🐶',
  },
  {
    symbol: 'XRPUSDT',
    displayName: 'XRP/USDT',
    name: 'Ripple',
    baseAsset: 'XRP',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 4,
    tickSize: 0.0001,
    defaultPrice: 0.584,
    iconEmoji: '✕',
  },
  {
    symbol: 'SUIUSDT',
    displayName: 'SUI/USDT',
    name: 'Sui Network',
    baseAsset: 'SUI',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 4,
    tickSize: 0.0001,
    defaultPrice: 1.052,
    iconEmoji: '💧',
  },
  {
    symbol: 'NEARUSDT',
    displayName: 'NEAR/USDT',
    name: 'Near Protocol',
    baseAsset: 'NEAR',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 3,
    tickSize: 0.001,
    defaultPrice: 4.35,
    iconEmoji: 'Ⓝ',
  },
  {
    symbol: 'ADAUSDT',
    displayName: 'ADA/USDT',
    name: 'Cardano',
    baseAsset: 'ADA',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 4,
    tickSize: 0.0001,
    defaultPrice: 0.354,
    iconEmoji: '₳',
  },
  {
    symbol: 'AVAXUSDT',
    displayName: 'AVAX/USDT',
    name: 'Avalanche',
    baseAsset: 'AVAX',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 2,
    tickSize: 0.01,
    defaultPrice: 24.15,
    iconEmoji: '🔺',
  },
  {
    symbol: 'WIFUSDT',
    displayName: 'WIF/USDT',
    name: 'dogwifhat',
    baseAsset: 'WIF',
    quoteAsset: 'USDT',
    category: 'meme',
    decimals: 4,
    tickSize: 0.0001,
    defaultPrice: 1.65,
    iconEmoji: '🧢',
  },
  {
    symbol: '1000PEPEUSDT',
    displayName: '1000PEPE/USDT',
    name: '1000 Pepe (Futures)',
    baseAsset: '1000PEPE',
    quoteAsset: 'USDT',
    category: 'meme',
    decimals: 5,
    tickSize: 0.00001,
    defaultPrice: 0.00785,
    iconEmoji: '🐸',
  },
  {
    symbol: 'RENDERUSDT',
    displayName: 'RENDER/USDT',
    name: 'Render Network',
    baseAsset: 'RENDER',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 3,
    tickSize: 0.001,
    defaultPrice: 5.25,
    iconEmoji: '🎨',
  },
  {
    symbol: 'TIAUSDT',
    displayName: 'TIA/USDT',
    name: 'Celestia',
    baseAsset: 'TIA',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 3,
    tickSize: 0.001,
    defaultPrice: 5.1,
    iconEmoji: '🪐',
  },
  {
    symbol: 'TONUSDT',
    displayName: 'TON/USDT',
    name: 'Toncoin',
    baseAsset: 'TON',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 3,
    tickSize: 0.001,
    defaultPrice: 5.6,
    iconEmoji: '💎',
  },
  {
    symbol: 'ENAUSDT',
    displayName: 'ENA/USDT',
    name: 'Ethena',
    baseAsset: 'ENA',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 4,
    tickSize: 0.0001,
    defaultPrice: 0.285,
    iconEmoji: '🏦',
  },
  {
    symbol: 'FETUSDT',
    displayName: 'FET/USDT',
    name: 'Artificial Superintelligence',
    baseAsset: 'FET',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 4,
    tickSize: 0.0001,
    defaultPrice: 1.35,
    iconEmoji: '🧠',
  },
  {
    symbol: 'TAOUSDT',
    displayName: 'TAO/USDT',
    name: 'Bittensor',
    baseAsset: 'TAO',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 2,
    tickSize: 0.01,
    defaultPrice: 320.5,
    iconEmoji: '🧠',
  },
  {
    symbol: 'LINKUSDT',
    displayName: 'LINK/USDT',
    name: 'Chainlink',
    baseAsset: 'LINK',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 3,
    tickSize: 0.001,
    defaultPrice: 11.2,
    iconEmoji: '🔗',
  },
  {
    symbol: 'PENDLEUSDT',
    displayName: 'PENDLE/USDT',
    name: 'Pendle',
    baseAsset: 'PENDLE',
    quoteAsset: 'USDT',
    category: 'altcoin',
    decimals: 3,
    tickSize: 0.001,
    defaultPrice: 3.45,
    iconEmoji: '⚖️',
  },
  {
    symbol: 'EURUSD',
    displayName: 'EUR/USD',
    name: 'Euro / US Dollar',
    baseAsset: 'EUR',
    quoteAsset: 'USD',
    category: 'forex',
    decimals: 5,
    tickSize: 0.00001,
    defaultPrice: 1.1035,
    iconEmoji: '💶',
  },
];

export function findOrBuildSymbol(
  rawSymbol: string,
  existingList: CryptoSymbolInfo[] = POPULAR_SYMBOLS
): CryptoSymbolInfo {
  if (!rawSymbol) return POPULAR_SYMBOLS[0];
  const clean = rawSymbol.toUpperCase().trim();

  // Exact or alias match
  const found = existingList.find(
    (s) =>
      s.symbol.toUpperCase() === clean ||
      s.displayName.toUpperCase() === clean ||
      s.baseAsset.toUpperCase() === clean
  );
  if (found) return found;

  // Gold Spot special alias
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

  const baseAsset = clean.endsWith('USDT')
    ? clean.replace(/USDT$/, '')
    : clean.endsWith('BUSD')
    ? clean.replace(/BUSD$/, '')
    : clean.replace(/\/.*/, '');
  const quoteAsset = clean.includes('/') ? clean.split('/')[1] : 'USDT';
  const symbol = `${baseAsset}${quoteAsset}`.replace('/', '');
  const displayName = `${baseAsset}/${quoteAsset}`;

  const isMeme =
    baseAsset.includes('PEPE') ||
    baseAsset.includes('DOGE') ||
    baseAsset.includes('SHIB') ||
    baseAsset.includes('WIF') ||
    baseAsset.includes('BONK') ||
    baseAsset.includes('FLOKI') ||
    baseAsset.includes('POPCAT') ||
    baseAsset.includes('MEW') ||
    baseAsset.includes('BOME') ||
    baseAsset.includes('NEIRO') ||
    baseAsset.includes('RATS') ||
    baseAsset.includes('SATS');

  const decimals = isMeme ? 8 : baseAsset.length > 5 ? 5 : 4;
  const tickSize = isMeme ? 0.00000001 : 0.0001;

  let emoji = '🪙';
  if (baseAsset.includes('BTC')) emoji = '₿';
  else if (baseAsset.includes('ETH')) emoji = 'Ξ';
  else if (baseAsset.includes('SOL')) emoji = '◎';
  else if (baseAsset.includes('BNB')) emoji = '🟡';
  else if (baseAsset.includes('WIF')) emoji = '🧢';
  else if (baseAsset.includes('PEPE')) emoji = '🐸';
  else if (baseAsset.includes('DOGE')) emoji = '🐕';
  else if (baseAsset.includes('SUI')) emoji = '💧';
  else if (baseAsset.includes('TIA')) emoji = '🪐';
  else if (baseAsset.includes('RENDER')) emoji = '🎨';
  else if (baseAsset.includes('TON')) emoji = '💎';

  return {
    symbol,
    displayName,
    name: baseAsset,
    baseAsset,
    quoteAsset,
    category: isMeme ? 'meme' : 'altcoin',
    decimals,
    tickSize,
    defaultPrice: isMeme ? 0.0001 : 1.0,
    iconEmoji: emoji,
  };
}

