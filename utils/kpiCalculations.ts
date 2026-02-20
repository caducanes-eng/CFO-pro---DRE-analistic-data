import { DailyRegister, MonthlyDRE, KPI, MonthlyParsedData, AuditoriaMeta } from '../types';
import { ALL_KPIS, COST_KPI_IDS } from '../constants';
import { formatCurrency, formatPercent } from './formatters'; // Import formatters

// --- UTILITÁRIOS DE BASE ---
const safeDivide = (n: number | null | undefined, d: number | null | undefined): number => {
  if (n === null || n === undefined) n = 0;
  if (d === 0 || d === null || d === undefined) return 0;
  return n / d;
};

const round = (v: number | null | undefined, dec: number = 2): number => {
  if (v === null || v === undefined) return 0;
  return parseFloat(v.toFixed(dec));
};

// Função para calcular a tendência (%) - O sistema precisa desta exportação
export const calculateTrend = (current: number | null | undefined, previous: number | null | undefined): number | undefined => {
  if (current === null || current === undefined || previous === null || previous === undefined || previous === 0) return undefined;
  return round(((current - previous) / previous) * 100);
};

// Função para os gráficos: Rendimento Mensal (Receita Líquida [B7]) de cada mês individualmente
export const getMonthlyChartData = (monthlyDREs: MonthlyDRE[]): { name: string; value: number; }[] => {
  // Ordena os DREs do mais antigo para o mais recente
  const sorted = [...monthlyDREs].sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  return sorted.map(dre => ({
    name: dre.monthYear,
    value: (dre.parsedData.netRevenue as number) || 0 // Mapeia para Receita Líquida
  }));
};

// --- LÓGICA DE AGREGAÇÃO (SOMA E MÉDIA PARA MÚLTIPLOS MESES) ---
const aggregateDREs = (dres: MonthlyDRE[]): MonthlyParsedData => {
  const periodData = dres;

  if (periodData.length === 0) {
    return {
      grossRevenue: 0, netRevenue: 0, cmv: 0, markup: 0, contributionMarginPercent: 0,
      commissions: 0, cardFees: 0, marketingAds: 0, freight: 0,
      personnelCost: 0, occupancyCost: 0, adminCost: 0, marketingInst: 0,
      taxes: 0, discount: 0, returns: 0, depreciation: 0, grossProfit: 0, ebitda: 0, netProfit: 0, cardSales: 0,
      taxesPercent: 0, discountPercent: 0, returnRatePercent: 0, grossMarginPercent: 0,
      cmvRatioPercent: 0, commissionPercent: 0, cardFeesPercent: 0, occupancyCostPercent: 0,
      adminCostPercent: 0, depreciationPercent: 0, contributionMarginValue: 0,
    } as MonthlyParsedData;
  }

  const sumAllFields = periodData.reduce((acc, curr) => {
    const d = curr.parsedData;
    return {
      grossRevenue: (acc.grossRevenue || 0) + (d.grossRevenue || 0),
      netRevenue: (acc.netRevenue || 0) + (d.netRevenue || 0),
      cmv: (acc.cmv || 0) + (d.cmv || 0),
      grossProfit: (acc.grossProfit || 0) + (d.grossProfit || 0),
      personnelCost: (acc.personnelCost || 0) + (d.personnelCost || 0),
      occupancyCost: (acc.occupancyCost || 0) + (d.occupancyCost || 0),
      adminCost: (acc.adminCost || 0) + (d.adminCost || 0),
      marketingAds: (acc.marketingAds || 0) + (d.marketingAds || 0),
      marketingInst: (acc.marketingInst || 0) + (d.marketingInst || 0),
      ebitda: (acc.ebitda || 0) + (d.ebitda || 0),
      netProfit: (acc.netProfit || 0) + (d.netProfit || 0),
      commissions: (acc.commissions || 0) + (d.commissions || 0),
      cardFees: (acc.cardFees || 0) + (d.cardFees || 0),
      cardSales: (acc.cardSales || 0) + (d.cardSales || 0),
      freight: (acc.freight || 0) + (d.freight || 0),
      taxes: (acc.taxes || 0) + (d.taxes || 0),
      discount: (acc.discount || 0) + (d.discount || 0),
      returns: (acc.returns || 0) + (d.returns || 0),
      depreciation: (acc.depreciation || 0) + (d.depreciation || 0),
      contributionMarginValue: (acc.contributionMarginValue || 0) + (d.contributionMarginValue || 0),
      markup: (acc.markup || 0) + (d.markup || 0),
      contributionMarginPercent: (acc.contributionMarginPercent || 0) + (d.contributionMarginPercent || 0),
      taxesPercent: (acc.taxesPercent || 0) + (d.taxesPercent || 0),
      discountPercent: (acc.discountPercent || 0) + (d.discountPercent || 0),
      returnRatePercent: (acc.returnRatePercent || 0) + (d.returnRatePercent || 0),
      grossMarginPercent: (acc.grossMarginPercent || 0) + (d.grossMarginPercent || 0),
      cmvRatioPercent: (acc.cmvRatioPercent || 0) + (d.cmvRatioPercent || 0),
      commissionPercent: (acc.commissionPercent || 0) + (d.commissionPercent || 0),
      cardFeesPercent: (acc.cardFeesPercent || 0) + (d.cardFeesPercent || 0),
      occupancyCostPercent: (acc.occupancyCostPercent || 0) + (d.occupancyCostPercent || 0),
      adminCostPercent: (acc.adminCostPercent || 0) + (d.adminCostPercent || 0),
      depreciationPercent: (acc.depreciationPercent || 0) + (d.depreciationPercent || 0),
    };
  }, {} as MonthlyParsedData);

  const avgCount = periodData.length;
  const result: MonthlyParsedData = { ...sumAllFields };

  (Object.keys(result) as Array<keyof MonthlyParsedData>).forEach(key => {
    const value = result[key];
    if (typeof value === 'number') {
      (result as any)[key] = safeDivide(value, avgCount);
    }
  });

  return result;
};

const getDailyAggregatesForMonth = (allDailyRegisters: DailyRegister[], year: number, month: number) => {
  const filteredRegs = allDailyRegisters.filter(r => {
    const regDate = new Date(r.date + 'T00:00:00');
    return regDate.getMonth() === month && regDate.getFullYear() === year;
  });

  const faturamentoAcumulado = filteredRegs.reduce((acc, curr) => acc + (curr.grossSales || 0), 0);
  const descontosAcumulados = filteredRegs.reduce((acc, curr) => acc + (curr.discount || 0), 0);
  const devolucoesAcumuladas = filteredRegs.reduce((acc, curr) => acc + (curr.returns || 0), 0);
  const clientesAcumulados = filteredRegs.reduce((acc, curr) => acc + (curr.customers || 0), 0);
  const diasDecorridos = filteredRegs.length > 0 ? (new Date(filteredRegs[filteredRegs.length - 1].date).getDate()) : 0;
  const diasNoMes = (new Date(year, month + 1, 0)).getDate();
  const diasRestantes = Math.max(0, diasNoMes - diasDecorridos);

  return { faturamentoAcumulado, descontosAcumulados, devolucoesAcumuladas, clientesAcumulados, diasDecorridos, diasNoMes, diasRestantes, hasData: filteredRegs.length > 0 };
};

const calculateKpiValueFromContext = (
  kpiId: string,
  dre: MonthlyParsedData | null,
  dailyAggs: ReturnType<typeof getDailyAggregatesForMonth> | null,
  metaMediaB2: number | null,
  peFinanceiroTotal: number | null,
  comparisonContext?: { currentDRE?: MonthlyParsedData, previousDRE?: MonthlyParsedData }
): number | null => {

  if (kpiId.startsWith('kpi_daily_') || kpiId === 'kpi_discount_impact' || kpiId === 'kpi_return_rate' || kpiId === 'kpi_average_ticket') {
    if (!dailyAggs || !dailyAggs.hasData) return null;
    const { faturamentoAcumulado, descontosAcumulados, devolucoesAcumuladas, clientesAcumulados, diasDecorridos, diasNoMes, diasRestantes } = dailyAggs;

    switch (kpiId) {
      case 'kpi_daily_accumulated': return round(faturamentoAcumulado);
      case 'kpi_daily_projection': return round(safeDivide(faturamentoAcumulado, diasDecorridos) * diasNoMes);
      case 'kpi_goal_attainment': return round(safeDivide(faturamentoAcumulado, metaMediaB2) * 100);
      case 'kpi_required_pace': return round(safeDivide(metaMediaB2 - faturamentoAcumulado, diasRestantes === 0 ? 1 : diasRestantes));
      case 'kpi_breakeven_daily': return round(safeDivide(peFinanceiroTotal, diasNoMes));
      case 'kpi_discount_impact': return round(safeDivide(descontosAcumulados, faturamentoAcumulado) * 100);
      case 'kpi_return_rate': return round(safeDivide(devolucoesAcumuladas, faturamentoAcumulado) * 100);
      case 'kpi_average_ticket': return round(safeDivide(faturamentoAcumulado, clientesAcumulados));
      default: return null;
    }
  } else if (dre) {
    const B2 = dre.grossRevenue || 0;
    const B7 = dre.netRevenue || 0;
    const B9_pct = dre.markup || 0;
    const B10 = dre.cmv || 0;
    const B16 = dre.marketingAds || 0;
    const B17_pct = dre.contributionMarginPercent || 0;
    const B19 = dre.personnelCost || 0;
    const B20 = dre.occupancyCost || 0;
    const B21 = dre.adminCost || 0;
    const B22 = dre.marketingInst || 0;
    const B23 = dre.ebitda || 0;
    const B27 = dre.netProfit || 0;
    const C11 = dre.grossMarginPercent || 0;
    const C13 = dre.commissionPercent || 0;
    const C20 = dre.occupancyCostPercent || 0;
    const C21 = dre.adminCostPercent || 0;
    const B14_pct = dre.cardFeesPercent || 0;

    const totalDespesasFixas = (B19 || 0) + (B20 || 0) + (B21 || 0) + (B22 || 0);
    const peFinanceiroDRE = round(safeDivide(totalDespesasFixas, safeDivide(B17_pct, 100)));

    switch (kpiId) {
      case 'kpi_mc': return round(B17_pct);
      case 'kpi_markup': return round(1 + safeDivide(B9_pct, 100));
      case 'kpi_roas': return round(safeDivide(B7, B16));
      case 'kpi_marketing_weight': return round(safeDivide((B16 || 0) + (B22 || 0), B2) * 100);
      case 'kpi_operating_margin': return round(safeDivide(B23, B7) * 100);
      case 'kpi_survival_index': return round(safeDivide(B27, totalDespesasFixas));
      case 'kpi_gross_margin': return round(C11);
      case 'kpi_cmv_revenue': return round(safeDivide(B10, B7) * 100);
      case 'kpi_payroll_cost': return round(B19);
      case 'kpi_occupancy_cost': return round(C20);
      case 'kpi_commission_weight': return round(C13);
      case 'kpi_card_fees': return round(B14_pct);
      case 'kpi_admin_cost': return round(C21);
      case 'kpi_breakeven_financial': return peFinanceiroDRE;
      case 'kpi_safety_margin': return round(safeDivide((B2 || 0) - (peFinanceiroDRE || 0), B2) * 100);
      case 'kpi_ebitda': return round(B23);
      // CORREÇÃO: Lucratividade Operacional (%) = (EBITDA / Receita Bruta) * 100
      case 'kpi_operating_profitability': return round(safeDivide(B23, B2) * 100);
      case 'kpi_operating_leverage':
        if (comparisonContext?.currentDRE && comparisonContext?.previousDRE) {
          const currentNetProfit = comparisonContext.currentDRE.netProfit || 0;
          const previousNetProfit = comparisonContext.previousDRE.netProfit || 0;
          const currentGrossRevenue = comparisonContext.currentDRE.grossRevenue || 0;
          const previousGrossRevenue = comparisonContext.previousDRE.grossRevenue || 0;
          const variacaoLucro = calculateTrend(currentNetProfit, previousNetProfit);
          const variacaoVendas = calculateTrend(currentGrossRevenue, previousGrossRevenue);
          return round(safeDivide(variacaoLucro, variacaoVendas));
        }
        return null;
      case 'kpi_marketing_investment': return round(safeDivide((B16 || 0) + (B22 || 0), B2) * 100);
      case 'kpi_net_profit': return round(B27);
      case 'kpi_growth_rate':
        if (comparisonContext?.currentDRE && comparisonContext?.previousDRE) {
          return calculateTrend(comparisonContext.currentDRE.grossRevenue, comparisonContext.previousDRE.grossRevenue);
        }
        return null;
      default: return null;
    }
  }
  return null;
};

export const calculateAllKpis = (
  dailyRegisters: DailyRegister[],
  monthlyDREs: MonthlyDRE[],
  filterMonths: number = 1
): { kpis: KPI[]; auditoriaMeta: AuditoriaMeta; } => {
  const kpisWithValues: KPI[] = [];
  const sortedMonthlyDREs = [...monthlyDREs].sort((a, b) => a.monthYear.localeCompare(b.monthYear));
  const nFiltered = Math.min(filterMonths, sortedMonthlyDREs.length);
  const currentPeriodDREs = sortedMonthlyDREs.slice(-nFiltered);
  const previousPeriodDREs = sortedMonthlyDREs.slice(-(nFiltered * 2), -nFiltered);
  const currentPeriodAggregatedDRE = aggregateDREs(currentPeriodDREs);
  const previousPeriodAggregatedDRE = aggregateDREs(previousPeriodDREs);
  const today = new Date();
  const currentMonthAggs = getDailyAggregatesForMonth(dailyRegisters, today.getFullYear(), today.getMonth());
  const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const previousMonthAggs = getDailyAggregatesForMonth(dailyRegisters, previousMonthDate.getFullYear(), previousMonthDate.getMonth());
  const metaMediaB2 = currentPeriodAggregatedDRE.grossRevenue;
  const peFinanceiroTotal = calculateKpiValueFromContext('kpi_breakeven_financial', currentPeriodAggregatedDRE, null, null, null);

  for (const kpiTemplate of ALL_KPIS) {
    let value: number | null = null;
    let comparisonDelta: number | null = null;
    let comparisonDeltaFormatted: string | null = null;
    let comparisonIsFavorable: boolean | null = null;
    let comparisonColorClass: string | null = null;

    if (kpiTemplate.category === 'Performance Diária') {
      value = calculateKpiValueFromContext(kpiTemplate.id, null, currentMonthAggs, metaMediaB2, peFinanceiroTotal);
    } else {
      value = calculateKpiValueFromContext(kpiTemplate.id, currentPeriodAggregatedDRE, null, metaMediaB2, peFinanceiroTotal, { currentDRE: currentPeriodAggregatedDRE, previousDRE: previousPeriodAggregatedDRE.grossRevenue !== 0 ? previousPeriodAggregatedDRE : undefined });
    }

    const isCostKpi = COST_KPI_IDS.includes(kpiTemplate.id);

    if (kpiTemplate.category === 'Saúde Financeira' && currentPeriodAggregatedDRE.grossRevenue !== 0 && previousPeriodAggregatedDRE.grossRevenue !== 0 && nFiltered > 0) {
      const currentCompareValue = calculateKpiValueFromContext(kpiTemplate.id, currentPeriodAggregatedDRE, null, metaMediaB2, peFinanceiroTotal, { currentDRE: currentPeriodAggregatedDRE, previousDRE: previousPeriodAggregatedDRE });
      const previousCompareValue = calculateKpiValueFromContext(kpiTemplate.id, previousPeriodAggregatedDRE, null, metaMediaB2, peFinanceiroTotal, { currentDRE: previousPeriodAggregatedDRE, previousDRE: undefined });

      if (currentCompareValue !== null && previousCompareValue !== null && previousCompareValue !== 0) {
        comparisonDelta = currentCompareValue - previousCompareValue;
        const isPercentageKpi = kpiTemplate.unit === '%' || kpiTemplate.unit === 'x';
        const deltaMagnitude = isPercentageKpi ? safeDivide(comparisonDelta, previousCompareValue) * 100 : comparisonDelta;
        comparisonIsFavorable = !isCostKpi ? (deltaMagnitude || 0) > 0 : (deltaMagnitude || 0) < 0;
        comparisonColorClass = comparisonIsFavorable ? 'text-green-400' : 'text-red-400';
        const prefix = deltaMagnitude > 0 ? '+' : '';
        if (kpiTemplate.id === 'kpi_markup') {
          comparisonDeltaFormatted = `${prefix}${round(deltaMagnitude, 2)}x ${comparisonDelta > 0 ? 'à mais' : 'à menos'} que o período anterior`;
        } else if (isPercentageKpi) {
          comparisonDeltaFormatted = `${prefix}${round(deltaMagnitude, 1)}% ${comparisonDelta > 0 ? 'à mais' : 'à menos'} que o período anterior`;
        } else {
          comparisonDeltaFormatted = `${prefix}${formatCurrency(deltaMagnitude || 0)} ${comparisonDelta > 0 ? 'à mais' : 'à menos'} que o período anterior`;
        }
      }
    } else if (kpiTemplate.category === 'Performance Diária' && currentMonthAggs.hasData && previousMonthAggs.hasData) {
      const currentDailyValue = calculateKpiValueFromContext(kpiTemplate.id, null, currentMonthAggs, metaMediaB2, peFinanceiroTotal);
      const previousDailyValue = calculateKpiValueFromContext(kpiTemplate.id, null, previousMonthAggs, metaMediaB2, peFinanceiroTotal);

      if (currentDailyValue !== null && previousDailyValue !== null && previousDailyValue !== 0) {
        comparisonDelta = currentDailyValue - previousDailyValue;
        const isPercentageKpi = kpiTemplate.unit === '%';
        const deltaMagnitude = isPercentageKpi ? safeDivide(comparisonDelta, previousDailyValue) * 100 : comparisonDelta;
        comparisonIsFavorable = !isCostKpi ? (deltaMagnitude || 0) > 0 : (deltaMagnitude || 0) < 0;
        comparisonColorClass = comparisonIsFavorable ? 'text-green-400' : 'text-red-400';
        const prefix = deltaMagnitude > 0 ? '+' : '';
        if (isPercentageKpi) {
          comparisonDeltaFormatted = `${prefix}${round(deltaMagnitude, 1)}% ${comparisonDelta > 0 ? 'à mais' : 'à menos'} que o mês passado`;
        } else {
          comparisonDeltaFormatted = `${prefix}${formatCurrency(deltaMagnitude || 0)} ${comparisonDelta > 0 ? 'à mais' : 'à menos'} que o mês passado`;
        }
      }
    }

    let referenceExplanation: string;
    const formattedMetaMediaB2 = formatCurrency(metaMediaB2);

    switch (kpiTemplate.id) {
      case 'kpi_daily_accumulated': referenceExplanation = `Ref: Meta Média de ${formattedMetaMediaB2}`; break;
      case 'kpi_daily_projection': referenceExplanation = `Ref: ${formattedMetaMediaB2}`; break;
      case 'kpi_goal_attainment': referenceExplanation = `Alvo: 100% da Média Histórica`; break;
      case 'kpi_required_pace': referenceExplanation = `Ref: Faturamento Diário Atual`; break;
      case 'kpi_breakeven_daily': referenceExplanation = `Ref: Faturamento de Sobrevivência`; break;
      case 'kpi_discount_impact': referenceExplanation = `Referência Educale: < 10%`; break;
      case 'kpi_return_rate': referenceExplanation = `Referência Mercado: < 3%`; break;
      case 'kpi_mc': referenceExplanation = `Referência Educale: > 35%`; break;
      case 'kpi_markup': referenceExplanation = `Alvo Consultoria: > 2.2x`; break;
      case 'kpi_roas': referenceExplanation = `Alvo Mínimo: > 4.5x`; break;
      case 'kpi_marketing_weight': referenceExplanation = `Referência: 5% a 10% da Rec. Bruta`; break;
      case 'kpi_operating_margin': referenceExplanation = `Referência Educale: 15% a 25%`; break;
      case 'kpi_average_ticket': referenceExplanation = `Ref: Média Histórica de Venda`; break;
      case 'kpi_survival_index': referenceExplanation = `Alvo: > 1.2 (Lucro/Fixos)`; break;
      case 'kpi_gross_margin': referenceExplanation = `Referência Mercado: > 50%`; break;
      case 'kpi_cmv_revenue': referenceExplanation = `Referência Educale: < 35%`; break;
      case 'kpi_payroll_cost': referenceExplanation = `Alvo: < 15% da Receita Bruta`; break;
      case 'kpi_occupancy_cost': referenceExplanation = `Alvo: < 8% da Receita Bruta`; break;
      case 'kpi_commission_weight': referenceExplanation = `Padrão Varejo: 2% a 5%`; break;
      case 'kpi_card_fees': referenceExplanation = `Alvo: 2% a 4% (Média Mix)`; break;
      case 'kpi_admin_cost': referenceExplanation = `Referência Educale: < 5%`; break;
      case 'kpi_breakeven_financial': referenceExplanation = `Alvo: < 70% da Receita`; break;
      case 'kpi_safety_margin': referenceExplanation = `Referência Educale: > 20%`; break;
      case 'kpi_ebitda': referenceExplanation = `Ref: Média Histórica Operacional`; break;
      case 'kpi_operating_profitability': referenceExplanation = `Referência Educale: > 10%`; break;
      case 'kpi_operating_leverage': referenceExplanation = `Alvo: > 1.0`; break;
      case 'kpi_marketing_investment': referenceExplanation = `Foco em Crescimento: 7% a 12%`; break;
      case 'kpi_net_profit': referenceExplanation = `Alvo: > 8% da Receita Bruta`; break;
      case 'kpi_growth_rate': referenceExplanation = `Alvo Educale: > 10% ao mês`; break;
      default: referenceExplanation = '';
    }

    kpisWithValues.push({ ...kpiTemplate, value, comparisonDelta, comparisonDeltaFormatted, comparisonIsFavorable, comparisonColorClass, referenceExplanation });
  }

  const auditoriaMeta: AuditoriaMeta = {
    metodologia: `Meta calculada com base no filtro de ${filterMonths} meses, utilizando a soma das Receitas Brutas dividida por ${nFiltered}.`,
    formulaMeta: `Meta = (∑ Receita Bruta (B2) do período filtrado) / ${nFiltered}`,
    valorMeta: metaMediaB2,
    numMesesBase: nFiltered,
  };

  return { kpis: kpisWithValues, auditoriaMeta };
};