// components/dashboard/KpiCard.tsx
import React from 'react';
import { KPI } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface KpiCardProps {
  kpi: KPI;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const renderValue = (value: number | null, unit: string) => {
    if (value === null || value === undefined) return '---';
    if (unit === 'R$') return formatCurrency(value);
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'x') return `${value.toFixed(2)}x`;
    return `${value.toLocaleString('pt-BR')} ${unit}`;
  };

  return (
    <div className="bg-brand-surface border border-white/5 rounded-2xl p-3 shadow-xl flex flex-col justify-between transition-all active:scale-[0.98] border-l-2 border-l-brand-primary/30">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-[9px] font-black uppercase tracking-wider text-brand-primary truncate pr-2">
          {kpi.name}
        </h3>
        {kpi.comparisonDeltaFormatted && (
          <div className={`flex items-center gap-0.5 text-[8px] font-bold ${kpi.comparisonColorClass}`}>
            {kpi.comparisonIsFavorable ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
            {kpi.comparisonDeltaFormatted.split(' ')[0]}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-white tracking-tighter">
          {renderValue(kpi.value, kpi.unit)}
        </span>
      </div>

      {kpi.referenceExplanation && (
        <p className="text-[7px] text-white/30 uppercase font-bold mt-1 tracking-tighter">
          {kpi.referenceExplanation}
        </p>
      )}
    </div>
  );
};

export default KpiCard;