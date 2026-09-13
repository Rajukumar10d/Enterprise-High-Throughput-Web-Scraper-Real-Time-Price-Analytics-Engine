export const formatCurrency = (value, currency = 'INR') => {
  const numericValue = Number(value ?? 0)

  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formatter.format(numericValue)
}

export default formatCurrency
