import Drawing from '../Images/Drawing'
import { Coordinate } from '../types'
import { DragEventType, PointerMove, PointerUpType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Circle extends Tool {
	public drag({ initPos, newPos }: DragEventType) {
		this._cursor.actif = true
		this._cursor.clear()
		this._ellipse(initPos, newPos, this._cursor)
	}
	public unClick({ initPos, newPos }: PointerUpType): void {
		this._ellipse(initPos, newPos, this._drawing)
	}
	public move(e: PointerMove): void {
		this._cursor.actif = true
		this._cursor.clear()
		this._cursor.paint(this._sketch.gridCoordinate(e.newPos), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}

	private _ellipse(initPos: Coordinate, newPos: Coordinate, drawing: Drawing) {
		const pos1 = this._sketch.gridCoordinate(initPos)
		const pos2 = this._sketch.gridCoordinate(newPos)
		const width = Math.abs(pos2.x - pos1.x)
		const height = Math.abs(pos2.y - pos1.y)
		const dirX = Math.sign(pos2.x - pos1.x)
		const dirY = Math.sign(pos2.y - pos1.y)
		const center = { x: Math.floor(pos1.x + (width / 2) * dirX), y: Math.floor(pos1.y + (height / 2) * dirY) }
		drawing.ellipse(center, width, height, this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
}
