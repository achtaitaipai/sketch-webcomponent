import Sketch from '.'
import LayersManager from './LayersManager'

interface Iframe {
	id: number
	layersManager: LayersManager
}

export default class FramesManager {
	public frames: Iframe[]
	private _frameIndex: number = 1
	private _sketch: Sketch

	constructor(sketch: Sketch) {
		this._sketch = sketch
		this.frames = [{ id: 1, layersManager: new LayersManager(this._sketch) }]
	}

	get actif() {
		return this.currentLayers?.actif ?? false
	}
	get currentLayers() {
		return this.frames.find(frame => frame.id === this._frameIndex)!.layersManager
	}
	public newFrame(id: number) {
		const newFrame = { id, layersManager: new LayersManager(this._sketch) }
		this.frames.push(newFrame)
	}

	public selectFrame(index: number) {
		this._frameIndex = index
	}

	public removeFrame(id: number) {
		this.frames = this.frames.filter(frame => frame.id !== id)
	}

	public sortFrames(list: number[]) {
		const frames: Iframe[] = []
		list.forEach(id => {
			const frame = this.frames.find(frame => frame.id === id)
			if (frame) frames.push(frame)
		})
		this.frames = frames
	}

	public currentDrawing() {
		return this.currentLayers?.currentDrawing()
	}

	public clear() {
		this.currentLayers?.clear()
	}

	public resize(width: number, height: number, hAlign: number = -1, vAlign: number = -1) {
		this.frames.forEach(frame => frame.layersManager.resize(width, height, hAlign, vAlign))
	}

	public crop(x: number, y: number, width: number, height: number) {
		this.frames.forEach(frame => frame.layersManager.crop(x, y, width, height))
	}
}
