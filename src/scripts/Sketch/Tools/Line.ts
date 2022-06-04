import { DragEventType, PointerMove, PointerUpType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Line extends Tool {
	public drag({ initPos, newPos }: DragEventType) {
		this._cursor.actif = true
		this._cursor.clear()
		this._cursor.line(this._sketch.gridCoordinate(initPos), this._sketch.gridCoordinate(newPos), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
	public unClick({ initPos, newPos }: PointerUpType): void {
		this.drawing?.line(this._sketch.gridCoordinate(initPos), this._sketch.gridCoordinate(newPos), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
	public move(e: PointerMove): void {
		this._cursor.actif = true
		this._cursor.clear()
		this._cursor.paint(this._sketch.gridCoordinate(e.newPos), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
}
