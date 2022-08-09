export const formatMoney = (value, charater = '.') => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, charater)

export const formatK = value => {
  const price = Number((Number(value) / 1000).toFixed(2))
  if (price > 1) {
    return price + 'k'
  }
}