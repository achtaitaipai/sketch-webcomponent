import Sketch from '.'
import Frame from './Frame'

interface Iframe {
	id: number
	frame: Frame
}

export default class FramesManager {
	public frames: Frame[]
	public _frameIndex: number = 1
	private _sketch: Sketch

	constructor(sketch: Sketch) {
		this._sketch = sketch
		this.frames = [new Frame(this._sketch, 1)]
	}

	get actif() {
		return this.currentFrame?.actif ?? false
	}
	get currentFrame() {
		return this.frames.find(frame => frame.id === this._frameIndex)!
	}
	public newFrame(id: number) {
		this.frames.push(new Frame(this._sketch, id))
	}

	public selectFrame(index: number) {
		this._frameIndex = index
	}

	public removeFrame(id: number) {
		this.frames = this.frames.filter(frame => frame.id !== id)
	}

	public sortFrames(list: number[]) {
		const frames: Frame[] = []
		list.forEach(id => {
			const frame = this.frames.find(frame => frame.id === id)
			if (frame) frames.push(frame)
		})
		this.frames = frames
	}

	public currentDrawing() {
		return this.currentFrame?.currentLayer()
	}

	public clear() {
		this.currentFrame?.clear()
	}

	public resize(width: number, height: number, hAlign: number = -1, vAlign: number = -1) {
		this.frames.forEach(frame => frame.resize(width, height, hAlign, vAlign))
	}

	public crop(x: number, y: number, width: number, height: number) {
		this.frames.forEach(frame => frame.crop(x, y, width, height))
	}
}
