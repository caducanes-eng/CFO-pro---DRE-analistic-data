
import { KPI, NavItem, AppPage, MonthlyParsedData, ColorPalette } from './types';
import { LayoutDashboard, PlusCircle, History, Settings, Box } from 'lucide-react';

export const DEFAULT_COLOR_PALETTE: ColorPalette = {
  primary: '#D4AF37',       // Dourado Educale
  secondary: '#B8860B',     // Ouro Velho
  accent: '#FFD700',        // Brilho Dourado
  bgTint: 'rgba(212, 175, 55, 0.08)', // Fundo sutil
  brandSurface: '#121217',  // Cinza Profundo Sólido para cards/seções
  brandTextLight: '#E0E0E0',    // Branco suave para textos gerais
  brandTextMuted: 'rgba(255, 255, 255, 0.6)', // Branco translúcido para descrições
};

export const ALL_KPIS: KPI[] = [
  // --- PERFORMANCE DIÁRIA (DADOS EM TEMPO REAL) ---
  {
    id: 'kpi_daily_accumulated',
    name: 'Faturamento Acumulado',
    description: 'Total vendido do dia 01 até o momento presente.',
    value: null,
    unit: 'R$',
    selected: true,
    category: 'Performance Diária',
  },
  {
    id: 'kpi_daily_projection',
    name: 'Projeção de Fechamento',
    description: 'Estimativa de faturamento total para o fim do mês baseado no ritmo atual.',
    value: null,
    unit: 'R$',
    selected: true,
    category: 'Performance Diária',
  },
  {
    id: 'kpi_goal_attainment',
    name: 'Atingimento de Meta',
    description: 'Porcentagem da meta mensal que já foi alcançada.',
    value: null,
    unit: '%',
    selected: true,
    category: 'Performance Diária',
  },
  {
    id: 'kpi_required_pace',
    name: 'Ritmo Diário para Meta',
    description: 'Quanto a loja precisa vender por dia nos dias restantes para bater a meta.',
    value: null,
    unit: 'R$',
    selected: true,
    category: 'Performance Diária',
  },
  {
    id: 'kpi_breakeven_daily',
    name: 'Ponto de Equilíbrio Diário',
    description: 'Faturamento diário médio necessário para pagar todas as contas do mês.',
    value: null,
    unit: 'R$',
    selected: true,
    category: 'Performance Diária',
  },
  {
    id: 'kpi_discount_impact',
    name: 'Impacto de Descontos',
    description: 'Porcentagem da receita bruta que foi dada em descontos no dia.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Performance Diária',
  },
  {
    id: 'kpi_return_rate',
    name: 'Taxa de Devolução',
    description: 'Porcentagem da receita bruta que foi devolvida no período.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Performance Diária',
  },

  // --- SAÚDE FINANCEIRA (HISTÓRICO E CONSOLIDAÇÃO DRE) ---
  {
    id: 'kpi_mc',
    name: 'Margem de Contribuição',
    description: 'Sobras da receita líquida após custos e despesas variáveis.',
    value: null,
    unit: '%',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_markup',
    name: 'Markup Médio Global',
    description: 'Índice de lucro aplicado sobre o custo de mercadoria.',
    value: null,
    unit: 'x', // Alterado para 'x' para Markup (ex: 2.0x)
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_roas',
    name: 'ROAS (ROI de Anúncios)',
    description: 'Retorno financeiro para cada real investido em tráfego pago (Ads).',
    value: null,
    unit: 'x',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_marketing_weight',
    name: 'Peso do Marketing',
    description: 'Quanto do faturamento bruto é reinvestido em marketing total.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_operating_margin',
    name: 'Margem Operacional (EBITDA)',
    description: 'Eficiência da operação antes de juros e impostos.',
    value: null,
    unit: '%',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_average_ticket',
    name: 'Ticket Médio',
    description: 'Valor médio gasto por cada cliente na loja.',
    value: null,
    unit: 'R$',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_survival_index',
    name: 'Índice de Sobrevivência',
    description: 'Quantos meses o lucro atual cobre as despesas fixas da empresa.',
    value: null,
    unit: 'meses',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_gross_margin',
    name: 'Margem Bruta',
    description: 'Receita líquida menos o CMV.',
    value: null,
    unit: '%',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_cmv_revenue',
    name: 'CMV sobre Receita',
    description: 'Custo da mercadoria em relação à receita líquida.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_payroll_cost',
    name: 'Custo de Pessoal',
    description: 'Valor total gasto com folha e encargos.',
    value: null,
    unit: 'R$',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_occupancy_cost',
    name: 'Custo de Ocupação',
    description: 'Peso do aluguel e custos de estrutura sobre a receita.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_commission_weight',
    name: 'Peso das Comissões',
    description: 'Comissões em relação à venda bruta.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_card_fees',
    name: 'Taxas de Cartão',
    description: 'Custo das operadoras de cartão sobre as vendas.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_admin_cost',
    name: 'Custo Administrativo',
    description: 'Despesas administrativas sobre a receita líquida.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_breakeven_financial',
    name: 'Ponto de Equilíbrio Financeiro',
    description: 'Faturamento mínimo mensal para lucro zero.',
    value: null,
    unit: 'R$',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_safety_margin',
    name: 'Margem de Segurança',
    description: 'O quanto o faturamento pode cair antes do prejuízo.',
    value: null,
    unit: '%',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_ebitda',
    name: 'EBITDA',
    description: 'Lucro operacional bruto.',
    value: null,
    unit: 'R$',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_operating_profitability',
    name: 'Lucratividade Operacional',
    description: 'Relação EBITDA vs Receita.',
    value: null,
    unit: '%',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_operating_leverage',
    name: 'Alavancagem Operacional',
    description: 'Sensibilidade do lucro em relação à variação de vendas.',
    value: null,
    unit: 'x',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_marketing_investment',
    name: 'Investimento Marketing',
    description: 'Valor total em marketing sobre a receita bruta.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_net_profit',
    name: 'Lucro Líquido Final',
    description: 'O que sobra no bolso após todas as contas e impostos.',
    value: null,
    unit: 'R$',
    selected: true,
    category: 'Saúde Financeira',
  },
  {
    id: 'kpi_growth_rate',
    name: 'Taxa de Crescimento',
    description: 'Variação percentual do faturamento em relação ao período anterior.',
    value: null,
    unit: '%',
    selected: false,
    category: 'Saúde Financeira',
  }
];

export const NAV_ITEMS: NavItem[] = [
  { id: AppPage.Dashboard, label: 'Dashboard', icon: LayoutDashboard },
  { id: AppPage.DataEntry, label: 'Alimentação', icon: PlusCircle },
  { id: AppPage.Inventory, label: 'Estoque', icon: Box },
  { id: AppPage.History, label: 'Histórico', icon: History },
  { id: AppPage.Settings, label: 'Configurações', icon: Settings },
];

export const DRE_TEMPLATE_HEADERS = [
  'RECEITA BRUTA', 'IMPOSTOS (%)', 'IMPOSTOS (R$)', 'DEVOLUÇÕES (R$)', 'DEVOLUÇÕES (%)',
  'DESCONTOS (R$)', 'DESCONTOS (%)', 'RECEITA LÍQUIDA', 'LUCRO BRUTO', 'MARKUP',
  'CMV', 'COMISSÕES (R$)', 'TAXAS DE CARTÃO (%)', 'MARKETING (ADS)', 'MARGEM DE CONTRIBUIÇÃO (%)',
  'PESSOAL', 'OCUPAÇÃO', 'ADMINISTRATIVO', 'MKT INSTITUCIONAL', 'EBITDA', 'LUCRO LÍQUIDO'
];

export const DRE_FIELD_MAP: { [key: string]: keyof MonthlyParsedData } = {
  'RECEITA BRUTA': 'grossRevenue',
  'IMPOSTOS (R$)': 'taxes',
  'RECEITA LÍQUIDA': 'netRevenue',
  'LUCRO BRUTO': 'grossProfit',
  'CMV': 'cmv',
  'MARKUP': 'markup',
  'MARGEM DE CONTRIBUIÇÃO (%)': 'contributionMarginPercent',
  'EBITDA': 'ebitda',
  'LUCRO LÍQUIDO': 'netProfit',
  'MARKETING (ADS)': 'marketingAds',
  'PESSOAL': 'personnelCost',
  'OCUPAÇÃO': 'occupancyCost',
  'ADMINISTRATIVO': 'adminCost',
  'MKT INSTITUCIONAL': 'marketingInst',
};

// KPIs que são considerados "custos" para a lógica de cor inteligente na comparação
export const COST_KPI_IDS = [
  'kpi_discount_impact',
  'kpi_return_rate',
  'kpi_cmv_revenue',
  'kpi_payroll_cost', // Embora R$, um valor maior é 'pior' para o percentual de receita
  'kpi_occupancy_cost',
  'kpi_commission_weight',
  'kpi_card_fees',
  'kpi_admin_cost',
  'kpi_marketing_weight', // Peso do marketing, maior pode ser pior dependendo do ROI
  'kpi_marketing_investment', // Investimento em marketing, maior é 'pior' se ROI for baixo
  'kpi_breakeven_daily', // Maior PE é pior
  'kpi_breakeven_financial', // Maior PE é pior
];
