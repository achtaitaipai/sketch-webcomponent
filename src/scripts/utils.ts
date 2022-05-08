import { Coordinate } from './types'

const isPositiveNumber = (val: string) => val && !isNaN(Number(val)) && Number(val) > 0
const isNumber = (val: string) => val && !isNaN(Number(val))

const distance = (pos1: Coordinate, pos2: Coordinate) => Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2)

export { isPositiveNumber, isNumber, distance }
