// components/DashboardPage.tsx
import React, { useMemo } from 'react';
import { KPI, MonthlyDRE, DailyRegister, AuditoriaMeta } from '../types';
import KpiCard from './dashboard/KpiCard';
import LineChartComponent from './LineChartComponent';
import PieChartComponent from './PieChartComponent';
import AiAnalysis from './dashboard/AiAnalysis';
import { getMonthlyChartData } from '../utils/kpiCalculations';
import { Calendar, Target, Activity, Megaphone } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface DashboardPageProps {
  kpis: KPI[];
  monthlyDREs: MonthlyDRE[];
  dailyRegisters: DailyRegister[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  brandTextLight: string;
  brandTextMuted: string;
  setMesesFiltro: (meses: number) => void;
  auditoriaMeta: AuditoriaMeta;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  kpis, monthlyDREs, primaryColor, secondaryColor, accentColor, setMesesFiltro, auditoriaMeta 
}) => {
  const selectedKpis = useMemo(() => kpis.filter(k => k.selected), [kpis]);
  const kpisPerformance = useMemo(() => selectedKpis.filter(k => k.category === 'Performance Diária'), [selectedKpis]);
  const kpisFinanceiros = useMemo(() => selectedKpis.filter(k => k.category === 'Saúde Financeira'), [selectedKpis]);
  const netRevenueChartData = useMemo(() => getMonthlyChartData(monthlyDREs), [monthlyDREs]);

  const [activeFilter, setActiveFilter] = React.useState(1);

  return (
    <div className="px-3 space-y-5">
      {/* Seletor de Período Compacto */}
      <section className="bg-brand-surface p-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={14} className="text-brand-primary" />
          <h2 className="text-[9px] font-black uppercase tracking-widest text-white/40">Filtro de Análise</h2>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[1, 3, 6, 12].map((val) => (
            <button
              key={val}
              onClick={() => { setActiveFilter(val); setMesesFiltro(val); }}
              className={`py-2 text-[10px] font-black rounded-lg border transition-all ${
                activeFilter === val ? 'bg-brand-primary text-black border-brand-primary' : 'bg-white/5 text-white/40 border-white/5'
              }`}
            >
              {val}M
            </button>
          ))}
        </div>
      </section>

      {/* KPIs Diários - Grid 2 Colunas */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Target size={18} className="text-brand-primary" />
          <h2 className="text-lg font-black uppercase tracking-tighter">Vendas <span className="text-brand-primary">Hoje</span></h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {kpisPerformance.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
        </div>
      </section>

      {/* Saúde Financeira - Grid 2 Colunas */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Activity size={18} className="text-brand-primary" />
          <h2 className="text-lg font-black uppercase tracking-tighter">Gestão <span className="text-brand-primary">DRE</span></h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {kpisFinanceiros.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)}
        </div>
      </section>

      {/* IA Analysis - Destaque Visual */}
      <AiAnalysis kpis={kpis} primaryColor={primaryColor} />

      {/* Gráficos em Full Width Mobile */}
      <div className="space-y-4">
        {netRevenueChartData.length > 0 && (
          <LineChartComponent
            data={netRevenueChartData.slice(-6)}
            title="Evolução Receita"
            dataKey="value"
            kpiUnit="R$"
            lineColor={primaryColor}
          />
        )}
      </div>

      {/* Auditoria Meta - Compacto */}
      <section className="bg-brand-surface/40 p-4 rounded-2xl border border-white/5 border-dashed">
        <div className="flex items-center gap-2 mb-2">
          <Megaphone size={14} className="text-brand-primary" />
          <h2 className="text-[9px] font-black uppercase tracking-widest text-white/40">Base de Metas</h2>
        </div>
        <p className="text-[11px] font-bold text-white/80">
          Sua meta média é <span className="text-brand-primary">{formatCurrency(auditoriaMeta.valorMeta)}</span> baseada em {auditoriaMeta.numMesesBase} meses.
        </p>
      </section>
    </div>
  );
};

export default DashboardPage;