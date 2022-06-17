import Sketch from '.'
import { FrameDatas } from './Frame'
import Animation from './Animation'

export type InstantType = {
	frames: FrameDatas[]
	width: number
	height: number
	selectedFrame: number
}

export default class HistoryManager {
	private _datas: InstantType[] = []
	private _animation: Animation
	private _sketch: Sketch
	private _cursor = 0

	constructor(sketch: Sketch, animation: Animation) {
		this._sketch = sketch
		this._animation = animation
	}

	public push() {
		const width = this._sketch.width
		const height = this._sketch.height
		const selectedFrame = this._animation.frameIndex
		const frames = this._animation.frames.map(f => f.getDatas())

		if (this._cursor < this._datas.length - 1) {
			this._datas = this._datas.slice(0, this._cursor + 1)
		}
		this._datas.push({ width, height, selectedFrame, frames })
		this._cursor = this._datas.length - 1
	}

	public undo() {
		this._cursor = Math.max(0, this._cursor - 1)
		this._loadDatas()
	}

	public redo() {
		this._cursor = Math.min(this._cursor + 1, this._datas.length - 1)
		this._loadDatas()
	}

	private _loadDatas() {
		const datas = this._datas[this._cursor]
		this._sketch.resize(datas.width, datas.height, 0, 0)
		this._animation.loadDatas(datas)
	}
}
