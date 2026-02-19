import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { formatCurrency, formatPercent } from '../utils/formatters';

interface LineChartComponentProps {
  data: { name: string; value: number; }[];
  title: string;
  dataKey: string;
  kpiUnit: string;
  lineColor: string;
}

const LineChartComponent: React.FC<LineChartComponentProps> = ({ data, title, dataKey, kpiUnit, lineColor }) => {
  const formatYAxis = (value: number) => {
    if (kpiUnit === 'R$') {
      return formatCurrency(value);
    }
    if (kpiUnit === '%') {
      return formatPercent(value);
    }
    return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
  };

  const formatTooltip = (value: number, name: string) => {
    if (kpiUnit === 'R$') {
      return [formatCurrency(value), title];
    }
    if (kpiUnit === '%') {
      return [formatPercent(value), title];
    }
    return [`${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${kpiUnit}`, title];
  };

  return (
    <div className="bg-[var(--brand-surface)] border border-white/5 rounded-3xl p-6 shadow-2xl h-80 md:h-[350px] flex flex-col"> {/* Reduzido h-96 para h-80 e h-[400px] para h-[350px] */}
      <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[var(--brand-primary)] mb-4">
        {title}
      </h3>
      {/* Changed ResponsiveContainer height to 100% and wrapped it in a flex-grow div */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
          >
            {/* Ajuste para cores mais claras e sutis no grid e eixos */}
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} stroke="var(--brand-text-muted)" style={{ fill: 'var(--brand-text-muted)', fontSize: '10px' }} />
            <YAxis tickFormatter={formatYAxis} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} stroke="var(--brand-text-muted)" style={{ fill: 'var(--brand-text-muted)', fontSize: '10px' }}>
              <Label value={kpiUnit} position="insideTopLeft" offset={10} style={{ textAnchor: 'start', fill: 'var(--brand-text-muted)', fontSize: '10px' }} />
            </YAxis>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--brand-surface)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              labelStyle={{ color: 'var(--brand-text-muted)' }}
              itemStyle={{ color: 'var(--brand-text-light)' }}
              formatter={formatTooltip} />
            <Line type="monotone" dataKey="value" stroke={lineColor} strokeWidth={2} dot={{ stroke: lineColor, strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;