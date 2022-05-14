import { Coordinate } from './scripts/types'

export function getCenter(pos1: Coordinate, pos2: Coordinate): Coordinate {
	return { x: Math.floor(pos1.x + (pos2.x - pos1.x) / 2), y: Math.floor(pos1.y + (pos2.y - pos1.y) / 2) }
}

export function distance(pos1: Coordinate, pos2: Coordinate) {
	return Math.sqrt((pos2.x - pos1.x) ** 2 + (pos2.y - pos1.y) ** 2)
}
