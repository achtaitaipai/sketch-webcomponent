import EventsManager from '../Events/EventsManager'
import Drawing from '../Images/Drawing'
import Sketch from '../Index'
import { Coordinate, DragEventType, PointerMove, ZoomEventType } from '../types/eventsTypes'
import Bucket from './Bucket'
import Handle from './Handle'
import Erase from './Erase'
import Line from './Line'
import Paint from './Paint'
import Tool from './AbstractTool'
import unZoom from './UnZoom'
import Zoom from './Zoom'
import Rect from './Rect'
import Circle from './Circle'
import Drag from './Drag'
import Crop from './Crop'
import LayersManager from '../LayersManager'
import Inactif from './Inactif'

export default class ToolsManager {
	private _eventsManager: EventsManager
	private _tools: { [key: string]: Tool }
	private _currentTool: Tool
	private _sketch
	private _cursor

	constructor(sketch: Sketch, layers: LayersManager, cursor: Drawing) {
		this._sketch = sketch
		this._cursor = cursor
		this._tools = {
			paint: new Paint(sketch, layers, cursor),
			erase: new Erase(sketch, layers, cursor),
			line: new Line(sketch, layers, cursor),
			rect: new Rect(sketch, layers, cursor),
			circle: new Circle(sketch, layers, cursor),
			bucket: new Bucket(sketch, layers, cursor),
			crop: new Crop(sketch, layers, cursor),
			zoom: new Zoom(sketch, layers, cursor),
			unzoom: new unZoom(sketch, layers, cursor),
			drag: new Drag(sketch, layers, cursor),
			handle: new Handle(sketch, layers, cursor),
			inactif: new Inactif(sketch, layers, cursor),
		}
		this._currentTool = this._tools.paint
		this._eventsManager = new EventsManager(sketch)
		this._addEvents()
	}

	set tool(value: string) {
		if (this._tools[value]) {
			this._currentTool.exit()
			this._currentTool = this._tools[value]
			this._currentTool.init()
		}
	}

	get currentTool() {
		return this._sketch.actif ? this._currentTool : this._tools.inactif
	}

	private _addEvents() {
		this._eventsManager.addObserver('click', (e: Coordinate) => {
			this.currentTool.click(e)
		})

		this._eventsManager.addObserver('rightClick', (e: Coordinate) => {
			this.currentTool.rightClick(e)
		})
		this._eventsManager.addObserver('pointerUp', (e: DragEventType) => {
			this.currentTool.unClick(e)
		})
		this._eventsManager.addObserver('drag', (e: DragEventType) => {
			const { button, oldPos, newPos } = e
			switch (button) {
				case 1:
					this._sketch.camera.drag(oldPos, newPos)
					break
				case 2:
					this.currentTool.rightClick(newPos)
					break
				default:
					this.currentTool.drag(e)
					break
			}
		})
		this._eventsManager.addObserver('pointerMove', (e: PointerMove) => {
			this.currentTool.move(e)
		})
		this._eventsManager.addObserver('pointerOut', () => {
			this._cursor.actif = false
			this._sketch.updatePreview()
		})
		this._eventsManager.addObserver('zoom', (e: ZoomEventType) => {
			this.currentTool.zoom(e)
		})
	}
}
