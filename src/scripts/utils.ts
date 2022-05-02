const isPositiveNumber = (val: string) => val && !isNaN(Number(val)) && Number(val) > 0
const isNumber = (val: string) => val && !isNaN(Number(val))

export { isPositiveNumber, isNumber }
