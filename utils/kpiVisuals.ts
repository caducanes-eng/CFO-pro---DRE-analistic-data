// utils/kpiVisuals.ts
// import { KPI_TARGETS } from './kpiTargets'; // KPI_TARGETS foi removido ou não usado para referenceExplanation

/**
 * Define targets directly within the function or remove if not strictly needed after KPI reference updates.
 * For now, keep a simplified structure or hardcode targets if KPI_TARGETS file is removed.
 * Given the instructions, we should define minimal targets here for color logic only.
 */
const KPI_TARGETS_FOR_VISUALS: {
  [key: string]: {
    target: number;
    isLowerBetter: boolean;
    upperTarget?: number;
  };
} = {
  'kpi_markup': { target: 2.0, isLowerBetter: false }, // >= 2.0x is good
  'kpi_mc': { target: 35, isLowerBetter: false }, // >= 35% is good
  'kpi_roas': { target: 4.5, isLowerBetter: false }, // >= 4.5x is good
  'kpi_marketing_weight': { target: 5, upperTarget: 10, isLowerBetter: false }, // 5% to 10%
  'kpi_operating_margin': { target: 15, upperTarget: 25, isLowerBetter: false }, // 15% to 25%
  'kpi_survival_index': { target: 1.2, isLowerBetter: false }, // >= 1.2 is good
  'kpi_gross_margin': { target: 50, isLowerBetter: false }, // >= 50% is good
  'kpi_cmv_revenue': { target: 35, isLowerBetter: true }, // <= 35% is good
  'kpi_payroll_cost': { target: 15, isLowerBetter: true }, // <= 15% is good
  'kpi_occupancy_cost': { target: 8, isLowerBetter: true }, // <= 8% is good
  'kpi_commission_weight': { target: 2, upperTarget: 5, isLowerBetter: false }, // 2% to 5%
  'kpi_card_fees': { target: 2, upperTarget: 4, isLowerBetter: false }, // 2% to 4%
  'kpi_admin_cost': { target: 5, isLowerBetter: true }, // <= 5% is good
  'kpi_breakeven_financial': { target: 70, isLowerBetter: true }, // <= 70% of revenue
  'kpi_safety_margin': { target: 20, isLowerBetter: false }, // >= 20% is good
  'kpi_ebitda': { target: 15, upperTarget: 25, isLowerBetter: false }, // 15% to 25% (R$ or %)
  'kpi_operating_profitability': { target: 10, isLowerBetter: false }, // >= 10% is good
  'kpi_operating_leverage': { target: 1.0, isLowerBetter: false }, // >= 1.0 is good
  'kpi_marketing_investment': { target: 7, upperTarget: 12, isLowerBetter: false }, // 7% to 12%
  'kpi_net_profit': { target: 8, upperTarget: 20, isLowerBetter: false }, // 8% to 20%
  'kpi_growth_rate': { target: 10, isLowerBetter: false }, // >= 10% is good
  'kpi_discount_impact': { target: 10, isLowerBetter: true }, // <= 10% is good
  'kpi_return_rate': { target: 3, isLowerBetter: true }, // <= 3% is good
};


/**
 * Determines the Tailwind CSS color class based on KPI value against its target.
 * @param kpiId The ID of the KPI.
 * @param value The current numerical value of the KPI.
 * @returns A Tailwind CSS color class ('text-green-500', 'text-red-500', or 'text-gray-400' for N/A).
 */
export const getKpiStatusColor = (kpiId: string, value: number | null): string => {
  if (value === null || value === undefined) return 'text-[var(--brand-primary)]/50'; // Neutral color for N/A or no data

  const targetInfo = KPI_TARGETS_FOR_VISUALS[kpiId];
  if (!targetInfo) return 'text-[var(--brand-primary)]'; // No specific target, use primary brand color

  const { target, isLowerBetter, upperTarget } = targetInfo;

  let isGreen = false;

  if (upperTarget !== undefined) {
    // For range targets (e.g., 15% to 25%)
    isGreen = value >= target && value <= upperTarget;
  } else if (isLowerBetter) {
    // For "lower is better" KPIs (e.g., CMV <= 50%)
    isGreen = value <= target;
  } else {
    // For "higher is better" KPIs (e.g., Margem de Contribuição >= 40%)
    isGreen = value >= target;
  }

  return isGreen ? 'text-green-500' : 'text-red-500';
};

/**
 * Returns the formatted display string for a KPI's target.
 * NOTE: This function is deprecated in favor of `kpi.referenceExplanation` directly on the KPI object.
 * Retained for compatibility if any old components still call it, but should be replaced.
 * @param kpiId The ID of the KPI.
 * @returns A string representing the KPI's target (e.g., ">= 40%") or "N/A" if no target defined.
 */
export const getKpiTargetDisplay = (kpiId: string): string => {
  // This function is being phased out as referenceExplanation is now part of KPI object
  // and set directly in calculateAllKpis.
  // For backward compatibility, if needed, it could return a generic message or use KPI_TARGETS_FOR_VISUALS
  return `Target: ${KPI_TARGETS_FOR_VISUALS[kpiId]?.target || 'N/A'}`;
};