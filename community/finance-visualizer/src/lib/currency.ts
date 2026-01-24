/**
 * Formats a numeric amount as Indian Rupees (INR) currency.
 * Uses the Indian numbering system (lakhs, crores) with no decimal places.
 * @param amount - The numeric amount to format
 * @returns Formatted currency string (e.g., "₹1,00,000")
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formats a numeric amount as Indian Rupees (INR) with decimal precision.
 * Used for tooltips and displays where exact amounts are needed.
 * @param amount - The numeric amount to format
 * @returns Formatted currency string with 2 decimal places (e.g., "₹1,00,000.50")
 */
export const formatCurrencyDetailed = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
