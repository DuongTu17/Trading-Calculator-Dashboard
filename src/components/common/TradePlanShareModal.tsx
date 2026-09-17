import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  X, 
  Share2, 
  ShieldCheck, 
  TrendingUp, 
  Flame 
} from 'lucide-react';
import { TradePlanExportData } from '../../types';

interface TradePlanShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultData: TradePlanExportData;
}

export const TradePlanShareModal: React.FC<TradePlanShareModalProps> = ({
  isOpen,
  onClose,
  defaultData,
}) => {
  const [data, setData] = useState<TradePlanExportData>(defaultData);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  if (!isOpen) return null;

  const safePair = data?.pair || 'BTC/USDT';
  const safeDirection = data?.direction || 'long';
  const isLong = safeDirection === 'long';
  const safeEntry = data?.entryPrice ?? 0;
  const safeStopLoss = data?.stopLossPrice ?? 0;
  const safeTakeProfit = data?.takeProfitPrice ?? 0;
  const safeRr = typeof data?.riskRewardRatio === 'number' && !isNaN(data.riskRewardRatio) ? data.riskRewardRatio : 2.0;
  const safeLeverage = data?.leverage ?? 1;

  // High-Resolution Pure HTML5 Canvas Generator (No external libraries required)
  const generateCardCanvas = (): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    const width = 1200;
    const height = 750;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    // Background
    ctx.fillStyle = '#0B0E14';
    ctx.fillRect(0, 0, width, height);

    // Subtle background gradient glow
    const grad = ctx.createRadialGradient(
      isLong ? 150 : width - 150, 
      200, 
      50, 
      isLong ? 200 : width - 200, 
      250, 
      600
    );
    grad.addColorStop(0, isLong ? 'rgba(14, 203, 129, 0.12)' : 'rgba(246, 70, 93, 0.12)');
    grad.addColorStop(1, 'rgba(11, 14, 20, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Card border
    ctx.strokeStyle = '#232936';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Header: Brand & Title
    ctx.fillStyle = isLong ? '#0ECB81' : '#F6465D';
    ctx.font = 'bold 28px monospace';
    ctx.fillText('⚡ TRADING CALC PRO', 70, 90);

    ctx.fillStyle = '#848E9C';
    ctx.font = '16px monospace';
    ctx.fillText('VERIFIED TRADE PLAN • VIBE RISK ENGINE', 70, 118);

    // Header Right: Date
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
    ctx.textAlign = 'right';
    ctx.fillStyle = '#848E9C';
    ctx.font = '16px monospace';
    ctx.fillText(dateStr, width - 70, 95);

    ctx.fillStyle = '#0ECB81';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('✓ Chuẩn Quản Trị Rủi Ro', width - 70, 122);
    ctx.textAlign = 'left';

    // Divider
    ctx.strokeStyle = '#1E232F';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(70, 150);
    ctx.lineTo(width - 70, 150);
    ctx.stroke();

    // Main Asset & Direction Badge
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 64px monospace';
    ctx.fillText(safePair, 70, 235);

    ctx.fillStyle = '#848E9C';
    ctx.font = '20px monospace';
    ctx.fillText(data?.marketType === 'crypto' ? 'Futures Perpetual' : 'Spot Exchange', 70, 270);

    // Position Badge Box
    const badgeText = `${isLong ? '▲ LONG' : '▼ SHORT'} ${safeLeverage > 1 ? `x${safeLeverage}` : ''}`;
    const badgeWidth = 240;
    const badgeHeight = 65;
    const badgeX = width - 70 - badgeWidth;
    const badgeY = 195;

    ctx.fillStyle = isLong ? 'rgba(14, 203, 129, 0.15)' : 'rgba(246, 70, 93, 0.15)';
    ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
    ctx.strokeStyle = isLong ? '#0ECB81' : '#F6465D';
    ctx.lineWidth = 3;
    ctx.strokeRect(badgeX, badgeY, badgeWidth, badgeHeight);

    ctx.fillStyle = isLong ? '#0ECB81' : '#F6465D';
    ctx.font = 'bold 30px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + 43);
    ctx.textAlign = 'left';

    // 3 Boxes: Entry, Stop Loss, Take Profit
    const boxY = 320;
    const boxHeight = 150;
    const boxWidth = (width - 140 - 40) / 3;

    // Box 1: Entry Price
    ctx.fillStyle = '#161A25';
    ctx.fillRect(70, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = '#232936';
    ctx.lineWidth = 2;
    ctx.strokeRect(70, boxY, boxWidth, boxHeight);

    ctx.fillStyle = '#848E9C';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('ENTRY PRICE', 95, boxY + 40);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 38px monospace';
    ctx.fillText(safeEntry.toLocaleString(), 95, boxY + 100);

    // Box 2: Stop Loss
    const slX = 70 + boxWidth + 20;
    ctx.fillStyle = 'rgba(246, 70, 93, 0.08)';
    ctx.fillRect(slX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = 'rgba(246, 70, 93, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(slX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = '#F6465D';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('STOP LOSS (SL)', slX + 25, boxY + 40);

    ctx.fillStyle = '#F6465D';
    ctx.font = 'bold 38px monospace';
    ctx.fillText(safeStopLoss.toLocaleString(), slX + 25, boxY + 100);

    // Box 3: Take Profit
    const tpX = slX + boxWidth + 20;
    ctx.fillStyle = 'rgba(14, 203, 129, 0.08)';
    ctx.fillRect(tpX, boxY, boxWidth, boxHeight);
    ctx.strokeStyle = 'rgba(14, 203, 129, 0.35)';
    ctx.lineWidth = 2;
    ctx.strokeRect(tpX, boxY, boxWidth, boxHeight);

    ctx.fillStyle = '#0ECB81';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TAKE PROFIT (TP)', tpX + 25, boxY + 40);

    ctx.fillStyle = '#0ECB81';
    ctx.font = 'bold 38px monospace';
    ctx.fillText(safeTakeProfit.toLocaleString(), tpX + 25, boxY + 100);

    // Metrics Row: R/R and Liquidation / Size
    const metricsY = 500;
    ctx.fillStyle = '#161A25';
    ctx.fillRect(70, metricsY, width - 140, 100);
    ctx.strokeStyle = '#232936';
    ctx.strokeRect(70, metricsY, width - 140, 100);

    // R/R
    ctx.fillStyle = '#848E9C';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('TỶ LỆ R:R', 100, metricsY + 40);

    ctx.fillStyle = '#0ECB81';
    ctx.font = 'bold 32px monospace';
    ctx.fillText(`1 : ${safeRr.toFixed(2)}`, 100, metricsY + 80);

    // Liquidation or Volume
    ctx.textAlign = 'right';
    if (data?.liquidationPrice) {
      ctx.fillStyle = '#848E9C';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('GIÁ THANH LÝ (LIQ)', width - 100, metricsY + 40);

      ctx.fillStyle = '#F6465D';
      ctx.font = 'bold 32px monospace';
      ctx.fillText(data.liquidationPrice.toLocaleString(), width - 100, metricsY + 80);
    } else {
      ctx.fillStyle = '#848E9C';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('KHỐI LƯỢNG VỊ THẾ', width - 100, metricsY + 40);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px monospace';
      ctx.fillText(data?.positionSize || '-', width - 100, metricsY + 80);
    }
    ctx.textAlign = 'left';

    // Footer Watermark
    ctx.strokeStyle = '#1E232F';
    ctx.beginPath();
    ctx.moveTo(70, 640);
    ctx.lineTo(width - 70, 640);
    ctx.stroke();

    ctx.fillStyle = '#848E9C';
    ctx.font = '15px monospace';
    ctx.fillText('TRADING CALC PRO • DISCIPLINE OVER EMOTION', 70, 680);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#0ECB81';
    ctx.font = 'bold 15px monospace';
    ctx.fillText('#RiskManagement #TradingRules', width - 70, 680);

    return canvas;
  };

  const handleDownloadImage = () => {
    try {
      setIsExporting(true);
      const canvas = generateCardCanvas();
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      const cleanPair = (safePair || 'trade').replace('/', '_').toLowerCase();
      link.download = `TradePlan_${cleanPair}_${safeDirection}_${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error('Lỗi khi xuất ảnh:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = () => {
    try {
      setIsExporting(true);
      const canvas = generateCardCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) {
          handleDownloadImage();
          return;
        }
        try {
          if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2000);
          } else {
            handleDownloadImage();
          }
        } catch {
          handleDownloadImage();
        }
      });
    } catch {
      handleDownloadImage();
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyText = () => {
    const text = `
🎯 [KẾ HOẠCH GIAO DỊCH - TRADING CALC PRO]
📌 Cặp: ${safePair} (${safeDirection.toUpperCase()}${safeLeverage > 1 ? ` x${safeLeverage}` : ''})
📈 Giá Vào (Entry): ${safeEntry.toLocaleString()}
🛑 Cắt Lỗ (SL): ${safeStopLoss.toLocaleString()}
🎯 Chốt Lời (TP): ${safeTakeProfit.toLocaleString()}
⚖️ Tỷ lệ R/R: 1 : ${safeRr.toFixed(2)}
${data?.liquidationPrice ? `🔥 Giá Cháy: ${data.liquidationPrice.toLocaleString()}\n` : ''}
💰 Khối lượng: ${data?.positionSize || '-'} | Rủi ro: ${data?.riskAmount || '-'}
🛡️ Kỷ luật quản trị rủi ro tối đa!
`.trim();

    try {
      navigator.clipboard?.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#121722] border border-[#232936] rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1E232F]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0ECB81]/15 text-[#0ECB81] border border-[#0ECB81]/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Share Kèo / Export Ảnh Viral
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0ECB81]/10 text-[#0ECB81] border border-[#0ECB81]/20">
                  TRADING CALC PRO
                </span>
              </h3>
              <p className="text-xs text-[#848E9C]">
                Tạo ảnh kế hoạch giao dịch chuẩn TradingView / Binance để share Telegram, Facebook
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#161A25] border border-[#232936] text-[#848E9C] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Customization Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4 text-xs">
          <div>
            <label className="text-[#848E9C] block mb-1">Mã / Cặp:</label>
            <input
              type="text"
              value={data.pair}
              onChange={(e) => setData({ ...data, pair: e.target.value.toUpperCase() })}
              className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2.5 py-1.5 text-white font-mono font-bold"
              placeholder="BTC/USDT"
            />
          </div>

          <div>
            <label className="text-[#848E9C] block mb-1">Vị thế:</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setData({ ...data, direction: 'long' })}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  isLong ? 'bg-[#0ECB81] text-black' : 'bg-[#161A25] text-[#848E9C] border border-[#232936]'
                }`}
              >
                LONG
              </button>
              <button
                type="button"
                onClick={() => setData({ ...data, direction: 'short' })}
                className={`flex-1 py-1.5 rounded-lg font-bold text-xs transition-all ${
                  !isLong ? 'bg-[#F6465D] text-white' : 'bg-[#161A25] text-[#848E9C] border border-[#232936]'
                }`}
              >
                SHORT
              </button>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-[#848E9C] block mb-1">Đòn bẩy:</label>
            <input
              type="number"
              value={data.leverage || 1}
              onChange={(e) => setData({ ...data, leverage: parseInt(e.target.value) || 1 })}
              className="w-full bg-[#161A25] border border-[#232936] rounded-lg px-2.5 py-1.5 text-white font-mono"
              placeholder="20"
            />
          </div>
        </div>

        {/* Live Card Preview Box */}
        <div className="p-1 rounded-2xl bg-gradient-to-br from-[#0ECB81]/30 via-[#232936] to-[#F6465D]/30 shadow-2xl mb-4">
          <div
            id="trading-export-card"
            className="bg-[#0B0E14] border border-[#232936] rounded-xl p-5 text-white relative overflow-hidden"
          >
            {/* Background Aesthetic Grid Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Top Brand & Timestamp */}
            <div className="flex items-center justify-between pb-3 border-b border-[#1E232F] relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#0ECB81]/20 border border-[#0ECB81]/40 flex items-center justify-center font-bold text-xs text-[#0ECB81]">
                  ⚡
                </div>
                <div>
                  <span className="font-extrabold text-xs tracking-wider text-white block">
                    TRADING CALC PRO
                  </span>
                  <span className="text-[9px] text-[#848E9C] block font-mono">
                    VERIFIED TRADE PLAN
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] text-[#0ECB81] font-semibold flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3 h-3" /> Chuẩn Kỷ Luật
                </span>
              </div>
            </div>

            {/* Asset & Direction */}
            <div className="my-3 flex items-center justify-between relative z-10">
              <div>
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white block">
                  {safePair}
                </span>
                <span className="text-[11px] text-[#848E9C] font-mono">
                  {data?.marketType === 'crypto' ? 'Futures Perpetual' : 'Giao Ngay (Spot)'}
                </span>
              </div>

              <div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black font-mono uppercase tracking-wider border shadow-md ${
                    isLong
                      ? 'bg-[#0ECB81]/20 text-[#0ECB81] border-[#0ECB81]/40'
                      : 'bg-[#F6465D]/20 text-[#F6465D] border-[#F6465D]/40'
                  }`}
                >
                  {isLong ? '▲ LONG' : '▼ SHORT'} {safeLeverage > 1 ? `x${safeLeverage}` : ''}
                </span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 my-3 relative z-10">
              {/* Entry */}
              <div className="p-2 rounded-xl bg-[#161A25] border border-[#232936]">
                <span className="text-[9px] text-[#848E9C] uppercase block mb-0.5">Entry Price</span>
                <span className="font-mono font-bold text-white text-xs sm:text-sm truncate block">
                  {safeEntry.toLocaleString()}
                </span>
              </div>

              {/* Stop Loss */}
              <div className="p-2 rounded-xl bg-[#F6465D]/10 border border-[#F6465D]/30">
                <span className="text-[9px] text-[#F6465D] uppercase block mb-0.5">Stop Loss</span>
                <span className="font-mono font-bold text-[#F6465D] text-xs sm:text-sm truncate block">
                  {safeStopLoss.toLocaleString()}
                </span>
              </div>

              {/* Take Profit */}
              <div className="p-2 rounded-xl bg-[#0ECB81]/10 border border-[#0ECB81]/30">
                <span className="text-[9px] text-[#0ECB81] uppercase block mb-0.5">Take Profit</span>
                <span className="font-mono font-bold text-[#0ECB81] text-xs sm:text-sm truncate block">
                  {safeTakeProfit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Bottom Row: R/R Ratio & Liquidation */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#161A25] border border-[#232936] relative z-10">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-[#0ECB81]/15 text-[#0ECB81]">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[9px] text-[#848E9C] uppercase block">Tỷ Lệ R:R</span>
                  <span className="text-xs font-mono font-extrabold text-[#0ECB81]">
                    1 : {safeRr.toFixed(2)}
                  </span>
                </div>
              </div>

              {data?.liquidationPrice ? (
                <div className="flex items-center gap-1.5 text-right">
                  <div>
                    <span className="text-[9px] text-[#848E9C] uppercase block">Giá Cháy</span>
                    <span className="text-xs font-mono font-extrabold text-[#F6465D]">
                      {data.liquidationPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-1 rounded-lg bg-[#F6465D]/15 text-[#F6465D]">
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div className="text-right">
                  <span className="text-[9px] text-[#848E9C] uppercase block">Khối Lượng</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {data?.positionSize || '-'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadImage}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#0ECB81] hover:bg-[#0bb974] text-black font-bold transition-all disabled:opacity-50 shadow-lg shadow-[#0ECB81]/10"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang tạo ảnh...' : 'Tải Ảnh PNG'}</span>
          </button>

          <button
            type="button"
            disabled={isExporting}
            onClick={handleCopyImage}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#161A25] hover:bg-[#1E232F] text-white border border-[#232936] font-semibold transition-all disabled:opacity-50"
          >
            {copiedImage ? <Check className="w-4 h-4 text-[#0ECB81]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedImage ? 'Đã chép ảnh!' : 'Chép Ảnh'}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#161A25] hover:bg-[#1E232F] text-white border border-[#232936] font-semibold transition-all"
          >
            {copiedText ? <Check className="w-4 h-4 text-[#0ECB81]" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Đã chép text!' : 'Copy Kế Hoạch'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
