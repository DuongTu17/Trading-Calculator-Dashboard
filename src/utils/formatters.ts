/**
 * Financial formatters for VN Stock & Crypto / Forex
 */

export function formatVnd(amount: number, withSymbol = true): string {
  if (isNaN(amount) || !isFinite(amount)) return '0 ₫';
  const rounded = Math.round(amount);
  const formatted = new Intl.NumberFormat('vi-VN').format(rounded);
  return withSymbol ? `${formatted} ₫` : formatted;
}

export function formatUsdt(amount: number, decimals = 2): string {
  if (isNaN(amount) || !isFinite(amount)) return '0.00';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Smart precision formatting for crypto & forex (handles PEPE 8 decimals down to BTC 2 decimals)
 */
export function formatTokenPrice(price: number, decimals?: number): string {
  if (typeof price !== 'number' || isNaN(price) || !isFinite(price) || price === 0) return '0.00';
  
  // If explicitly specified
  if (typeof decimals === 'number' && !isNaN(decimals) && decimals >= 0 && decimals <= 20) {
    try {
      return price.toFixed(decimals);
    } catch {
      return price.toString();
    }
  }

  // Auto-detect precision based on magnitude
  if (price < 0.00001) {
    return price.toFixed(8);
  } else if (price < 0.001) {
    return price.toFixed(6);
  } else if (price < 1) {
    return price.toFixed(4);
  } else if (price < 50) {
    return price.toFixed(3);
  } else {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
}

export function formatNumber(amount: number, maxDecimals = 4): string {
  if (isNaN(amount) || !isFinite(amount)) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxDecimals,
  }).format(amount);
}

export function formatPercent(percent: number, withSign = false, decimals = 2): string {
  if (isNaN(percent) || !isFinite(percent)) return '0.00%';
  const sign = withSign && percent > 0 ? '+' : '';
  return `${sign}${percent.toFixed(decimals)}%`;
}

export function parseNumberInput(value: string | number): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  // Remove commas, spaces, currency symbols
  const cleaned = value.toString().replace(/,/g, '').replace(/₫/g, '').replace(/đ/g, '').replace(/\s/g, '').trim();
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
