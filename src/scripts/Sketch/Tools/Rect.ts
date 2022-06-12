import { DragEventType, PointerMove, PointerUpType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Rect extends Tool {
	public drag({ initPos, newPos }: DragEventType) {
		this._cursor.actif = true
		this._cursor.clear()
		const from = this._sketch.gridCoordinate(initPos)
		const to = this._sketch.gridCoordinate(newPos)
		this._cursor.rect(from, to.x - from.x, to.y - from.y, this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
	public unClick({ initPos, newPos }: PointerUpType): void {
		const from = this._sketch.gridCoordinate(initPos)
		const to = this._sketch.gridCoordinate(newPos)
		this.drawing?.rect(from, to.x - from.x, to.y - from.y, this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
		this._sketch.dispatchUpdate()
	}

	public move(e: PointerMove): void {
		this._cursor.actif = true
		this._cursor.clear()
		this._cursor.paint(this._sketch.gridCoordinate(e.newPos), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
}
