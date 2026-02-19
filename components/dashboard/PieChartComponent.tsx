import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

interface PieChartComponentProps {
  data: { name: string; value: number; }[];
  title: string;
  colors: string[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ data, title, colors }) => {
  const formatTooltip = (value: number, name: string) => {
    return [formatCurrency(value), name];
  };

  return (
    <div className="bg-[var(--brand-surface)] border border-white/5 rounded-3xl p-6 shadow-2xl h-80 md:h-[350px] flex flex-col"> {/* Reduzido h-96 para h-80 e h-[400px] para h-[350px] */}
      <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--brand-primary)] mb-4">
        {title}
      </h3>
      {/* Changed ResponsiveContainer height to 100% and wrapped it in a flex-grow div */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--brand-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--brand-text-muted)' }}
              itemStyle={{ color: 'var(--brand-text-light)' }}
              formatter={formatTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mt-4 text-xs text-[var(--brand-text-muted)]"> {/* Ajustado gap-x-4 para gap-x-2 e gap-y-2 para gap-y-1 */}
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[index % colors.length] }}></span>
            {entry.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartComponent;