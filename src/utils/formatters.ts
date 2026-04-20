export const formatUSD = (value: number) => {
  if (isNaN(value) || !isFinite(value)) return '$0.00';
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
};

export const formatPercent = (value: number) => {
  if (isNaN(value) || !isFinite(value)) return '0.00%';
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value) + '%';
};
