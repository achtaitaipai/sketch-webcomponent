type Coordinate = {
	x: number
	y: number
}

enum Mode {
	Paint = 'paint',
	Zoom = 'zoom',
	Unzoom = 'unzoom',
	Drag = 'drag',
	Erase = 'erase',
}

export type { Coordinate }

export { Mode }
