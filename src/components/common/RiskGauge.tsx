import React from 'react';
import { ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

interface RiskGaugeProps {
  distancePercent: number;
  entryPrice: number;
  liquidationPrice: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  distancePercent,
  entryPrice,
  liquidationPrice,
  size = 'md',
}) => {
  // Cap distance for gauge display (0% -> 25%+)
  const clampedDistance = Math.max(0, Math.min(25, distancePercent));
  // Needle angle: from -90 deg (0% - extreme danger) to +90 deg (25%+ - safe)
  const angle = -90 + (clampedDistance / 25) * 180;

  // Determine risk level based on user prompt specification:
  // Green (Safe): > 10%
  // Yellow (Warning): 5% - 10%
  // Red (Danger/High Risk): < 5%
  let riskLevel: 'safe' | 'warning' | 'danger' = 'safe';
  let levelColor = '#0ECB81'; // Green
  let levelBg = 'rgba(14, 203, 129, 0.15)';
  let levelBorder = 'rgba(14, 203, 129, 0.3)';
  let levelLabel = 'AN TOÀN (SAFE)';
  let levelDesc = 'Khoảng cách > 10%, biên độ đệm rủi ro tốt';

  if (distancePercent < 5) {
    riskLevel = 'danger';
    levelColor = '#F6465D'; // Red
    levelBg = 'rgba(246, 70, 93, 0.15)';
    levelBorder = 'rgba(246, 70, 93, 0.35)';
    levelLabel = 'BÁO ĐỘNG ĐỎ (DANGER)';
    levelDesc = 'Khoảng cách < 5%, chỉ 1 cú giật râu nến là CHÁY!';
  } else if (distancePercent <= 10) {
    riskLevel = 'warning';
    levelColor = '#F0B90B'; // Yellow/Orange
    levelBg = 'rgba(240, 185, 11, 0.15)';
    levelBorder = 'rgba(240, 185, 11, 0.35)';
    levelLabel = 'CẢNH BÁO (WARNING)';
    levelDesc = 'Khoảng cách 5% - 10%, rủi ro biến động giật';
  }

  return (
    <div className="bg-[#0B0E14] border border-[#232936] rounded-xl p-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between text-xs text-[#848E9C] mb-2">
        <span className="font-semibold uppercase tracking-wider text-[11px] text-white flex items-center gap-1.5">
          {riskLevel === 'safe' && <ShieldCheck className="w-3.5 h-3.5 text-[#0ECB81]" />}
          {riskLevel === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-[#F0B90B]" />}
          {riskLevel === 'danger' && <Flame className="w-3.5 h-3.5 text-[#F6465D]" />}
          Thước Đo Rủi Ro (Visual Risk Gauge)
        </span>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold border transition-colors"
          style={{ color: levelColor, backgroundColor: levelBg, borderColor: levelBorder }}
        >
          {levelLabel}
        </span>
      </div>

      {/* Semi-circle SVG Dial Gauge */}
      <div className="relative w-48 h-28 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F6465D" />
              <stop offset="35%" stopColor="#F0B90B" />
              <stop offset="70%" stopColor="#0ECB81" />
              <stop offset="100%" stopColor="#0ECB81" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={levelColor} />
            </filter>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1E232F"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Colored Gradient Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Danger Zone Marker (<5% -> left ~20% of arc) */}
          <line x1="20" y1="100" x2="28" y2="92" stroke="#F6465D" strokeWidth="2" />
          {/* Warning Zone Marker (5%-10%) */}
          <line x1="52" y1="46" x2="59" y2="40" stroke="#F0B90B" strokeWidth="2" />
          {/* Safe Zone Marker (>10%) */}
          <line x1="100" y1="20" x2="100" y2="28" stroke="#0ECB81" strokeWidth="2" />

          {/* Center Pivot */}
          <circle cx="100" cy="100" r="8" fill="#161A25" stroke="#2B313F" strokeWidth="3" />

          {/* Animated Needle */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="30"
              stroke={levelColor}
              strokeWidth="3.5"
              strokeLinecap="round"
              filter="url(#needleGlow)"
            />
            <circle cx="100" cy="100" r="4" fill={levelColor} />
          </g>
        </svg>

        {/* Needle Label */}
        <div className="absolute bottom-0 text-center">
          <span
            className="text-xl font-mono font-extrabold tracking-tight transition-colors"
            style={{ color: levelColor }}
          >
            {distancePercent.toFixed(2)}%
          </span>
          <span className="text-[10px] text-[#848E9C] block -mt-1">Khoảng cách cháy</span>
        </div>
      </div>

      {/* Legend Badges */}
      <div className="w-full grid grid-cols-3 gap-1.5 pt-3 mt-1 border-t border-[#1E232F] text-[10px] text-center font-mono">
        <div className={`p-1 rounded ${riskLevel === 'danger' ? 'bg-[#F6465D]/20 text-[#F6465D] font-bold border border-[#F6465D]/40' : 'text-[#848E9C]'}`}>
          &lt; 5% Đỏ (Danger)
        </div>
        <div className={`p-1 rounded ${riskLevel === 'warning' ? 'bg-[#F0B90B]/20 text-[#F0B90B] font-bold border border-[#F0B90B]/40' : 'text-[#848E9C]'}`}>
          5 - 10% Vàng (Warn)
        </div>
        <div className={`p-1 rounded ${riskLevel === 'safe' ? 'bg-[#0ECB81]/20 text-[#0ECB81] font-bold border border-[#0ECB81]/40' : 'text-[#848E9C]'}`}>
          &gt; 10% Xanh (Safe)
        </div>
      </div>

      <p className="text-[11px] text-[#848E9C] text-center mt-2">
        {levelDesc}
      </p>
    </div>
  );
};
