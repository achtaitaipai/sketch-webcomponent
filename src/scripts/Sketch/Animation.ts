import Sketch from '.'
import Frame from './Frame'
import { InstantType } from './History'

export default class Animation {
	public frames: Frame[] = []
	public frameIndex: number = 1
	private _sketch: Sketch

	constructor(sketch: Sketch) {
		this._sketch = sketch
	}

	get actif() {
		return this.currentFrame?.actif ?? false
	}
	get currentFrame() {
		return this.frames.find(frame => frame.id === this.frameIndex)
	}

	public newFrame(id: number) {
		this.frames.push(new Frame(this._sketch, id))
		this._sketch.historyPush()
	}

	public selectFrame(id: number) {
		this.frameIndex = id
	}

	public nextFrame() {
		let cursor = this.frames.findIndex(f => f.id === this.frameIndex)
		cursor = (cursor + 1) % this.frames.length
		this.selectFrame(this.frames[cursor].id)
	}
	public removeFrame(id: number) {
		this.frames = this.frames.filter(frame => frame.id !== id)
		this._sketch.historyPush()
	}

	public sortFrames(list: number[]) {
		const frames: Frame[] = []
		list.forEach(id => {
			const frame = this.frames.find(frame => frame.id === id)
			if (frame) frames.push(frame)
		})
		this.frames = frames
	}

	public duplicate(id: number, newId: number) {
		const original = this.frames.find(frame => frame.id === id)
		if (original) {
			const newFrame = new Frame(this._sketch, newId, original)
			newFrame.selectLayer(original.layerIndex)
			this.frames.push(newFrame)
		}
		this._sketch.dispatchUpdate()
		this._sketch.historyPush()
	}

	public currentDrawing() {
		return this.currentFrame?.currentLayer()
	}

	public loadDatas(datas: InstantType) {
		this.frameIndex = datas.selectedFrame

		this.frames = datas.frames.map(dataFrame => {
			const frame = new Frame(this._sketch, dataFrame.id)
			frame.loadDatas(dataFrame)
			return frame
		})
	}

	get previousFrame() {
		const index = this.frames.findIndex(frame => frame.id === this.frameIndex)
		return this.frames[index - 1] ?? null
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
