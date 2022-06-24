import Animation from '../Animation'
import Drawing from '../Images/Drawing'
import Sketch from '../Index'
import { Coordinate, DragEventType, PointerMove, PointerUpType, ZoomEventType } from '../types/eventsTypes'

export default abstract class Tool {
	protected _sketch: Sketch
	protected _frames: Animation
	protected _cursor: Drawing
	constructor(sketch: Sketch, frames: Animation, cursor: Drawing) {
		this._sketch = sketch
		this._frames = frames
		this._cursor = cursor
	}
	get drawing() {
		return this._frames.currentDrawing()
	}
	public init() {}
	public click(_: Coordinate) {}
	public rightClick(e: Coordinate): void {
		this.drawing?.erase(this._sketch.gridCoordinate(e), this._sketch.size)
		this._sketch.updatePreview()
		this._cursor.actif = false
		this._cursor.clear()
		// this._sketch.historyPush()
		this._sketch.dispatchUpdate()
	}
	public drag(_: DragEventType) {}
	public move(_: PointerMove) {}
	public out(_: Coordinate) {}
	public zoom(e: ZoomEventType) {
		this._sketch.camera.zoom(this._sketch.gridCoordinate(e.pos), e.dir, e.factor)
	}
	public unClick(_: PointerUpType): void {
		this._sketch.historyPush()
		this._sketch.dispatchUpdate()
	}
	public rightUnClick(_: PointerUpType): void {
		this._sketch.historyPush()
		this._sketch.dispatchUpdate()
	}
	public exit() {}
}
