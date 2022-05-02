import { Coordinate } from './types'

export default class Camera {
	private _zoomValue: number = 1
	private _translate: Coordinate = { x: 0, y: 0 }

	constructor(private _frame: HTMLElement, private _canvas: HTMLCanvasElement) {
		document.addEventListener('fullscreenchange', e => {
			this.fitSketch()
		})
	}

	get zoomValue() {
		return this._zoomValue
	}

	set zoomValue(value: number) {
		this._zoomValue = value
		this._canvas.style.width = this._canvas.width * this._zoomValue + 'px'
		const containerRect = this._frame.getBoundingClientRect()
		this.translate = {
			x: -(containerRect.width - this._canvas.width * this._zoomValue) / 2,
			y: -(containerRect.height - this._canvas.height * this._zoomValue) / 2,
		}
	}

	get translate() {
		return this._translate
	}

	set translate(tr: Coordinate) {
		this._translate = tr
		this._canvas.style.setProperty('transform', `translate(${-this._translate.x}px,${-this._translate.y}px)`)
	}

	public fitSketch() {
		const { width, height } = this._frame.getBoundingClientRect()
		const canvasRatio = this._canvas.width / this._canvas.height
		const containerRatio = width / height
		this.zoomValue = canvasRatio < containerRatio ? height / this._canvas.height : width / this._canvas.width
	}

	public zoom(pos?: Coordinate, dir?: number) {
		let newZoomValue = this._zoomValue > 1 ? this._zoomValue + 1 : this._zoomValue * 2
		if (dir && dir < 0) newZoomValue = this._zoomValue > 1 ? this._zoomValue - 1 : this._zoomValue * 0.5
		if (pos) {
			pos.x = Math.min(Math.max(pos.x, 0), this._canvas.width)
			pos.y = Math.min(Math.max(pos.y, 0), this._canvas.width)
			const tx = pos.x * newZoomValue - pos.x * this._zoomValue + this._translate.x
			const ty = pos.y * newZoomValue - pos.y * this._zoomValue + this._translate.y
			this._translate = { x: tx, y: ty }
		}
		this._zoomValue = newZoomValue
		this._canvas.style.width = this._canvas.width * this._zoomValue + 'px'
		this._canvas.style.setProperty('transform', `translate(${-this._translate.x}px,${-this._translate.y}px)`)
	}
}
