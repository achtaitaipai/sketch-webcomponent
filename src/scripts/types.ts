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
	Bucket = 'bucket',
	Line = 'line',
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
	initPos: Coordinate
	oldPos: Coordinate
	newPos: Coordinate
}
type PointerUpType = {
	button: number
	initPos: Coordinate
	newPos: Coordinate
}

type ZoomEventType = {
	pos: Coordinate
	dir: number
}

export type { Coordinate, DragEventType, PointerMove, ClickEventType, ZoomEventType, PointerUpType }

export { Mode }
