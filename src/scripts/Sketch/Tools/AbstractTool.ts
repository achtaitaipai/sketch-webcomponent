import Drawing from '../Images/Drawing'
import Sketch from '../Index'
import LayersManager from '../LayersManager'
import { Coordinate, DragEventType, PointerMove, PointerUpType, ZoomEventType } from '../types/eventsTypes'

export default abstract class Tool {
	protected _sketch: Sketch
	protected _layers: LayersManager
	protected _cursor: Drawing
	constructor(sketch: Sketch, layers: LayersManager, cursor: Drawing) {
		this._sketch = sketch
		this._layers = layers
		this._cursor = cursor
	}
	get drawing() {
		return this._layers.currentLayer()
	}
	public init() {}
	public click(_: Coordinate) {}
	public rightClick(e: Coordinate): void {
		this.drawing?.erase(this._sketch.gridCoordinate(e), this._sketch.size)
		this._sketch.updatePreview()
		this._cursor.actif = false
		this._cursor.clear()
	}
	public drag(_: DragEventType) {}
	public move(_: PointerMove) {}
	public unClick(_: PointerUpType) {}
	public out(_: Coordinate) {}
	public zoom(e: ZoomEventType) {
		this._sketch.camera.zoom(this._sketch.gridCoordinate(e.pos), e.dir, e.factor)
	}
	public exit() {}
}
