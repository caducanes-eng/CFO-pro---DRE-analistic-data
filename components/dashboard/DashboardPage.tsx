import React, { useMemo } from 'react';
import { KPI, MonthlyDRE, DailyRegister, AuditoriaMeta } from '../types';
import KpiCard from './KpiCard';
import LineChartComponent from '../LineChartComponent';
import PieChartComponent from '../PieChartComponent';
import AiAnalysis from './AiAnalysis';
import { getMonthlyChartData } from '../utils/kpiCalculations';
import { Calendar, Target, Activity, Megaphone } from 'lucide-react'; // Adicionado Megaphone
import { formatCurrency } from '../utils/formatters'; // Import para formatar o valor da meta

interface DashboardPageProps {
  kpis: KPI[];
  monthlyDREs: MonthlyDRE[];
  dailyRegisters: DailyRegister[];
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  brandTextLight: string; // Adicionado
  brandTextMuted: string; // Adicionado
  setMesesFiltro: (meses: number) => void;
  auditoriaMeta: AuditoriaMeta; // Novo: Recebe o objeto de auditoria
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  kpis, 
  monthlyDREs, 
  dailyRegisters, 
  primaryColor, 
  secondaryColor, 
  accentColor,
  brandTextLight, // Utilizado
  brandTextMuted, // Utilizado
  setMesesFiltro,
  auditoriaMeta // Utilizado
}) => {
  
  const selectedKpis = useMemo(() => kpis.filter(k => k.selected), [kpis]);

  // 1. Separação dos KPIs por Categorias Estratégicas (mantido)
  const kpisPerformance = useMemo(() => 
    selectedKpis.filter(k => k.category === 'Performance Diária'), [selectedKpis]);
  
  const kpisFinanceiros = useMemo(() => 
    selectedKpis.filter(k => k.category === 'Saúde Financeira'), [selectedKpis]);

  const sortedDREs = useMemo(() => {
    return [...monthlyDREs].sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  }, [monthlyDREs]);

  // Dados para os Gráficos (mantido)
  // FIX: Renamed monthlyRevenueChartData to netRevenueChartData
  const netRevenueChartData = useMemo(() => getMonthlyChartData(monthlyDREs), [monthlyDREs]);
  
  const expenseCompositionData = useMemo(() => {
    const lastDRE = sortedDREs[sortedDREs.length - 1];
    if (!lastDRE) return [];
    const p = lastDRE.parsedData;
    return [
      { name: 'Pessoal', value: p.personnelCost || 0 },
      { name: 'Ocupação', value: p.occupancyCost || 0 },
      { name: 'Admin', value: p.adminCost || 0 },
      { name: 'Mkt Ads', value: p.marketingAds || 0 },
      { name: 'Comissões', value: p.commissions || 0 },
      { name: 'Impostos', value: p.taxes || 0 },
    ].filter(item => item.value > 0);
  }, [sortedDREs]);

  const chartColors = [primaryColor, secondaryColor, accentColor, '#00FFFF', '#FF0080', '#FFFF00'];

  const [activeFilter, setActiveFilter] = React.useState(1); // Estado para o filtro ativo

  const handleFilterClick = (val: number) => {
    setActiveFilter(val);
    setMesesFiltro(val); // Notifica o App.tsx sobre a mudança, embora não usada para agregação de DREs agora.
  }

  return (
    <div className="p-4 pb-24 space-y-10">
      
      {/* --- SELETOR DE PERÍODO (MÉDIA CONSOLIDADA) --- */}
      <section className="bg-[var(--brand-surface)] p-5 rounded-3xl border border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-5">
          <Calendar size={20} className="text-[var(--brand-primary)]" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
            Período de Análise (Apenas para o Gráfico de Evolução)
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Mensal', val: 1 },
            { label: 'Trimestral', val: 3 },
            { label: 'Semestral', val: 6 },
            { label: 'Anual', val: 12 }
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => handleFilterClick(item.val)}
              // Aplica borda sólida ao botão ativo
              className={`py-3 text-[10px] font-bold uppercase rounded-xl border transition-all active:scale-95 ${
                activeFilter === item.val
                  ? 'bg-[var(--brand-primary)] text-black border-[var(--brand-primary)] border-2'
                  : 'bg-black/40 text-white/70 border-white/5 hover:border-[var(--brand-primary)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* --- BLOCO DE AUDITORIA DE METAS --- */}
      {monthlyDREs.length > 0 && (
        <section className="bg-[var(--brand-surface)] p-5 rounded-3xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <Megaphone size={20} className="text-[var(--brand-accent)]" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              Auditoria de Metas Mensais
            </h2>
          </div>
          <div className="text-sm text-[var(--brand-text-muted)] space-y-2">
            <p>
              <strong className="text-[var(--brand-primary)]">Metodologia:</strong> {auditoriaMeta.metodologia}
            </p>
            <p>
              <strong className="text-[var(--brand-primary)]">Fórmula Base:</strong> {auditoriaMeta.formulaMeta}
            </p>
            <p>
              <strong className="text-[var(--brand-primary)]">Meta Média Calculada:</strong> {formatCurrency(auditoriaMeta.valorMeta)}
            </p>
            <p>
              <strong className="text-[var(--brand-primary)]">Base de Cálculo ($n$):</strong> Média de {auditoriaMeta.numMesesBase} meses cadastrados.
            </p>
          </div>
        </section>
      )}

      {/* --- BLOCO 1: PERFORMANCE DO MÊS (TEMPO REAL) --- */}
      {kpisPerformance.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Target size={22} className="text-[var(--brand-primary)]" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Performance <span className="text-[var(--brand-primary)]">do Mês</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kpisPerformance.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </section>
      )}

      {/* --- BLOCO 2: SAÚDE FINANCEIRA (CONSOLIDADO) --- */}
      {kpisFinanceiros.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 px-2">
            <Activity size={22} className="text-[var(--brand-primary)]" />
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              Saúde <span className="text-[var(--brand-primary)]">Financeira</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpisFinanceiros.map((kpi) => (
              <KpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>
        </section>
      )}

      {/* --- GRÁFICOS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FIX: Corrected monthlyRevenueChartData to netRevenueChartData */}
        {netRevenueChartData.length > 1 && (
          <LineChartComponent
            data={netRevenueChartData.slice(0, activeFilter)} // Agora o gráfico respeita o filtro de meses
            title="Evolução da Receita"
            dataKey="value"
            kpiUnit="R$"
            lineColor={primaryColor}
          />
        )}
        {expenseCompositionData.length > 0 && (
          <PieChartComponent
            data={expenseCompositionData}
            title="Distribuição de Custos"
            colors={chartColors}
          />
        )}
      </div>

      {/* --- ANÁLISE IA --- */}
      <AiAnalysis kpis={kpis} primaryColor={primaryColor} />

      {/* ESTADO VAZIO */}
      {selectedKpis.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-white/40 uppercase font-bold text-sm">Nenhum KPI selecionado nas configurações.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;