export type EventsNames = 'click' | 'rightClick' | 'drag' | 'pointerMove' | 'pointerUp' | 'pointerOut' | 'zoom'

export type Coordinate = {
	x: number
	y: number
}

export type PointerMove = {
	oldPos: Coordinate
	newPos: Coordinate
}

export type ClickEventType = {
	button: number
	pos: Coordinate
}

export type DragEventType = {
	button: number
	initPos: Coordinate
	oldPos: Coordinate
	newPos: Coordinate
}
export type PointerUpType = {
	button: number
	initPos: Coordinate
	newPos: Coordinate
}

export type ZoomEventType = {
	pos: Coordinate
	dir: number
}

export type ClickCallBack = (e: Coordinate) => void
export type RightClickCallBack = (e: Coordinate) => void
export type DragCallBack = (e: DragEventType) => void
export type MoveCallBack = (e: PointerMove) => void
export type UnClickCallBack = (e: PointerUpType) => void
export type OutCallBack = (e: Coordinate) => void
export type ZoomCallBack = (e: ZoomEventType) => void
