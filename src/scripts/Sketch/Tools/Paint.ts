import { Coordinate, DragEventType } from '../types/eventsTypes'
import { PointerMove } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Paint extends Tool {
	public click(e: Coordinate) {
		this.drawing?.paint(this._sketch.gridCoordinate(e), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
	public drag({ oldPos, newPos }: DragEventType) {
		this.drawing?.line(this._sketch.gridCoordinate(oldPos), this._sketch.gridCoordinate(newPos), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
		this._cursor.actif = false
	}

	public move(e: PointerMove): void {
		this._cursor.actif = true
		this._cursor.clear()
		this._cursor.paint(this._sketch.gridCoordinate(e.newPos), this._sketch.size, this._sketch.color)
		this._sketch.updatePreview()
	}
}
