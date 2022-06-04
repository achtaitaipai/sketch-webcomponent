import { Coordinate, DragEventType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Erase extends Tool {
	// constructor(sketch: Sketch, drawing: Drawing) {
	// 	super(sketch, drawing)
	// }
	public click(e: Coordinate) {
		this.drawing?.erase(this._sketch.gridCoordinate(e), this._sketch.size)
		this._sketch.updatePreview()
	}
	public drag({ newPos }: DragEventType) {
		this.drawing?.erase(this._sketch.gridCoordinate(newPos), this._sketch.size)
		this._sketch.updatePreview()
	}
}
