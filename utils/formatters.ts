// utils/formatters.ts

/**
 * Formats a numeric value as a Brazilian Real currency string.
 * Ensures two decimal places, thousands separator as dot, and decimal separator as comma.
 * @param value The number to format.
 * @returns Formatted currency string (e.g., "R$ 1.250,50") or "N/A" if null/undefined.
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formats a numeric value as a percentage string (e.g., "15,50%").
 * Expects the input `value` to be the raw percentage number (e.g., 15.5 for 15.5%).
 * Ensures two decimal places and uses comma for decimals.
 * @param value The raw percentage number (e.g., 15.5 for 15.5%).
 * @returns Formatted percentage string (e.g., "15,50%") or "N/A" if null/undefined.
 */
export const formatPercent = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'N/A';
  // Use NumberFormat directly as the value is expected to be the raw percentage (e.g., 15.5)
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
  return `${formattedValue}%`;
};