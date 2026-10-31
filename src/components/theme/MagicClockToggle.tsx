import React from 'react';
import { ThemeConfig, ThemePeriod } from '../../types';

interface MagicClockToggleProps {
  currentTheme: ThemeConfig;
  currentPeriod: ThemePeriod;
  currentTimeFormatted: string;
}

const REALM_POINTS: {
  id: ThemePeriod;
  label: string;
  cx: number;
  cy: number;
  color: string;
  angle: number;
}[] = [
  {
    id: 'mad_hatter_day',
    label: 'Royaume Blanc (08h-16h)',
    cx: 16,
    cy: 4.2,
    color: '#d93870',
    angle: 0
  },
  {
    id: 'queen_of_hearts_evening',
    label: 'Reine de Cœur (16h-00h)',
    cx: 26.2,
    cy: 21.9,
    color: '#dc1e35',
    angle: 120
  },
  {
    id: 'cheshire_night',
    label: 'Chapelier Fou (00h-08h)',
    cx: 5.8,
    cy: 21.9,
    color: '#18b8a6',
    angle: 240
  }
];

export const MagicClockToggle: React.FC<MagicClockToggleProps> = ({
  currentTheme,
  currentPeriod,
  currentTimeFormatted
}) => {
  const activePoint =
    REALM_POINTS.find((pt) => pt.id === currentPeriod) || REALM_POINTS[0];

  return (
    <div
      role="status"
      aria-label={`Horloge automatique des 3 royaumes : ${currentTheme.name} (${currentTimeFormatted})`}
      title={`Changement automatique selon l'heure • ${currentTheme.name} (${currentTheme.timeRange})`}
      className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full glass-panel border border-theme-gold/35 select-none"
    >
      {/* Petite horloge tournant autour des 3 points (les 3 royaumes) */}
      <div className="relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
        <svg
          viewBox="0 0 32 32"
          className="w-full h-full overflow-visible"
          fill="none"
          aria-hidden="true"
        >
          {/* Cercle d'orbite reliant les 3 points des royaumes */}
          <circle
            cx="16"
            cy="16"
            r="11.8"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="1"
            strokeDasharray="2 2"
            className="text-theme-gold"
          />

          {/* Cadran intérieur de l'horloge */}
          <circle
            cx="16"
            cy="16"
            r="7.8"
            fill="rgba(0,0,0,0.55)"
            stroke="currentColor"
            strokeOpacity="0.45"
            strokeWidth="1.2"
            className="text-theme-gold"
          />

          {/* Aiguille trotteuse qui tourne en continu autour des 3 points */}
          <g className="origin-[16px_16px] animate-[spin_10s_linear_infinite]">
            <line
              x1="16"
              y1="16"
              x2="16"
              y2="5.8"
              stroke="var(--theme-gold)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeOpacity="0.7"
            />
          </g>

          {/* Aiguille principale pointant vers le royaume actif */}
          <g
            style={{
              transform: `rotate(${activePoint.angle}deg)`,
              transformOrigin: '16px 16px',
              transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            <line
              x1="16"
              y1="16"
              x2="16"
              y2="7.5"
              stroke={activePoint.color}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          {/* Pivot central doré */}
          <circle cx="16" cy="16" r="1.8" fill="var(--theme-gold)" />

          {/* Les 3 points représentant les 3 royaumes */}
          {REALM_POINTS.map((pt) => {
            const isActive = pt.id === currentPeriod;
            return (
              <g key={pt.id}>
                {isActive && (
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4.2"
                    fill={pt.color}
                    fillOpacity="0.28"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={pt.cx}
                  cy={pt.cy}
                  r={isActive ? '2.8' : '2.1'}
                  fill={pt.color}
                  stroke="#ffffff"
                  strokeWidth={isActive ? '1.1' : '0.5'}
                  strokeOpacity={isActive ? '0.95' : '0.45'}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Heure & Nom simple du royaume actif */}
      <div className="flex flex-col items-start text-left leading-tight pr-0.5">
        <span className="font-mono text-[10px] sm:text-[11px] text-theme-gold font-semibold">
          {currentTimeFormatted || '10:06'}
        </span>
        <span className="text-[10px] sm:text-[11px] text-theme-text font-medium whitespace-nowrap">
          {currentTheme.name}
        </span>
      </div>
    </div>
  );
};
