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

type PointerMove = {
	oldPos: Coordinate
	newPos: Coordinate
}

type ClickEventType = {
	button: number
	pos: Coordinate
}

type DragEventType = {
	button: number
	oldPos: Coordinate
	newPos: Coordinate
}

type ZoomEventType = {
	pos: Coordinate
	dir: number
}

export type { Coordinate, DragEventType, PointerMove, ClickEventType, ZoomEventType }

export { Mode }
