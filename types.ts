
import React from 'react';

export interface DailyRegister {
  id: string;
  date: string; // YYYY-MM-DD
  grossSales: number | null;
  cash: number | null;
  card: number | null;
  pix: number | null;
  discount: number | null;
  returns: number | null;
  customers: number | null;
  itemsSold: number | null;
}

export interface MonthlyParsedData {
  grossRevenue: number | null; // Ref B2: 'RECEITA BRUTA' (R$)
  netRevenue: number | null; // Ref B7: 'RECEITA LÍQUIDA' (R$)
  cmv: number | null; // Ref B10: '(-) CMV' or 'CUSTO MERCADORIA' (R$)
  markup: number | null; // Ref B9: 'MARKUP' (extracted as %, e.g., 25 for 25%)

  // Profit/Margin Values
  contributionMarginPercent: number | null; // Ref B17 (KPI target): 'MARGEM DE CONTRIBUIÇÃO (VALOR %)' (extracted as %, e.g., 30 for 30%)
  contributionMarginValue?: number | null; // New: for MARGEM CONTRIBUIÇÃO (R$) regex match

  // Expense Values (R$)
  commissions: number | null; // 'COMISSÕES' (R$)
  cardFees: number | null; // 'TAXAS CARTÃO' (R$)
  marketingAds: number | null; // Ref B16: 'MARKETING (ADS)' or 'CUSTO DE ADS' (R$)
  freight: number | null; // 'FRETE' (R$)
  personnelCost: number | null; // Ref B19: 'PESSOAL (FIXO)' or 'FOLHA DE PAGAMENTO' (R$)
  occupancyCost: number | null; // Ref B20: 'OCUPAÇÃO' (R$)
  adminCost: number | null; // Ref B21: 'ADMINISTRATIVO' or 'DESPESAS ADMINISTRATIVAS' (R$)
  marketingInst: number | null; // Ref B22: 'MKT INSTITUCIONAL' (R$)
  taxes: number | null; // New: for 'IMPOSTOS' as R$ if regex provided R$, currently regex is for %
  discount: number | null; // New: for 'DESCONTOS' as R$
  returns: number | null; // New: for 'DEVOLUÇÕES' as R$
  depreciation: number | null; // New: for 'DEPRECIAÇÃO' as R$
  grossProfit?: number | null; // New: for LUCRO BRUTO (B11)

  // Profit/Loss values (R$)
  ebitda: number | null; // Ref B23: 'EBITDA' or 'LAJIDA' (R$)
  netProfit: number | null; // Ref B27: 'LUCRO LÍQUIDO' (R$)

  cardSales: number | null; // 'VENDAS NO CARTÃO' (R$)

  // Additional percentage fields (from Column C or other explicit % inputs)
  taxesPercent?: number | null; // New: 'IMPOSTOS' regex captures %
  discountPercent?: number | null; // Ref C6: 'DESCONTOS (%)'
  returnRatePercent?: number | null; // Ref C5: 'DEVOLUÇÕES (%)'
  grossMarginPercent?: number | null; // Ref C11: 'MARGEM BRUTA (%)'
  cmvRatioPercent?: number | null; // Ref C10: 'CMV SOBRE RECEITA (%)'
  commissionPercent?: number | null; // Ref C13: 'PESO DAS COMISSÕES (%)'
  cardFeesPercent?: number | null; // Ref B14: 'TAXAS DE CARTÃO (%)' (already there, but now explicit regex)
  occupancyCostPercent?: number | null; // Ref C20: 'CUSTO DE OCUPAÇÃO (%)'
  adminCostPercent?: number | null; // Ref C21: 'CUSTO ADMINISTRATIVO (%)'
  depreciationPercent?: number | null; // New: 'DEPRECIAÇÃO' regex captures %

  // Added for date parsing from raw content
  monthYearDetected?: string; // YYYY-MM
}

export interface MonthlyDRE {
  id: string;
  monthYear: string; // YYYY-MM
  rawContent: string; // Original pasted content (text or image base64 if no separate image field)
  parsedData: MonthlyParsedData;
  dreImageBase64?: string; // New field for pasted DRE image
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  value: number | null;
  unit: string;
  selected: boolean;
  category: 'Performance Diária' | 'Saúde Financeira' | string; // Updated category to be string for custom names
  comparisonDelta?: number | null; // Raw difference or percentage change (M-o-M)
  comparisonDeltaFormatted?: string | null; // e.g., "+2,5% à mais que o mês passado"
  comparisonIsFavorable?: boolean | null; // True if current > previous for profit, or current < previous for cost
  comparisonColorClass?: string | null; // Tailwind color class (e.g., 'text-green-400')
  referenceExplanation?: string; // New: Explanation for the KPI's value origin or benchmark
}

export interface CompanyInfo {
  name: string;
  cnpj: string;
  taxRegime: string;
  logoUrl?: string; // This will now store the *processed* logo URL (base64)
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  bgTint: string;
  brandSurface: string; // New: Derived surface color
  brandTextLight: string; // New: Light text color
  brandTextMuted: string; // New: Muted text color
}

export enum AppPage {
  Dashboard = 'dashboard',
  DataEntry = 'dataEntry',
  Inventory = 'inventory',
  History = 'history',
  Settings = 'settings',
}

export interface NavItem {
  id: AppPage;
  label: string;
  icon: React.ElementType; // Lucide icon component
}

export interface AuditoriaMeta {
  metodologia: string;
  formulaMeta: string;
  valorMeta: number | null; // Novo campo para o valor exato da meta
  numMesesBase: number;
}
