export const formatPercentage = (value) => {
  const numericValue = Number(value ?? 0)
  if (Number.isNaN(numericValue)) return '0.00%'
  return `${numericValue > 0 ? '+' : ''}${numericValue.toFixed(2)}%`
}

export default formatPercentage
