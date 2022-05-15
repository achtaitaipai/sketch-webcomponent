import { Coordinate } from '../types'

export default abstract class Layer {
	private _canvas: HTMLCanvasElement
	public actif = true
	protected _ctx: CanvasRenderingContext2D

	constructor() {
		this._canvas = document.createElement('canvas')
		this._ctx = this._canvas.getContext('2d')!
	}

	set width(w: number) {
		this._canvas.width = w
	}

	get width() {
		return this._canvas.width
	}

	set height(h: number) {
		this._canvas.height = h
	}

	get height() {
		return this._canvas.height
	}
	get canvas() {
		return this._canvas
	}
	getImgData(x = 0, y = 0, width = this.width, height = this.height) {
		return new ImageData(new Uint8ClampedArray(this._ctx.getImageData(x, y, width, height).data), width, height)
	}

	crop(x: number, y: number, width: number, height: number) {
		const img = this._ctx.getImageData(x, y, width, height)
		this.width = width
		this.height = height
		this._ctx.putImageData(img, 0, 0)
	}

	public putDatas(datas: ImageData, x: number, y: number) {
		this.clear()
		this._ctx.putImageData(datas, x, y)
	}

	public resize(w: number, h: number, _: number = -1, __: number = -1) {
		const img = this._ctx.getImageData(0, 0, this.width, this.height)
		this.width = w
		this.height = h
		this._ctx.putImageData(img, 0, 0)
	}
	public paint(pos: Coordinate, size: number, color?: string) {
		this._ctx.fillStyle = color || '#000000'
		const x = size > 1 ? pos.x - size / 2 : pos.x
		const y = size > 1 ? pos.y - size / 2 : pos.y
		this._ctx.fillRect(Math.floor(x), Math.floor(y), size, size)
	}

	public erase(pos: Coordinate, size: number) {
		const x = size > 1 ? pos.x - size / 2 : pos.x
		const y = size > 1 ? pos.y - size / 2 : pos.y
		this._ctx.clearRect(Math.floor(x), Math.floor(y), size, size)
	}
	protected _getColor(pos: Coordinate) {
		const [r, g, b, a] = this._ctx.getImageData(pos.x, pos.y, 1, 1).data
		return [r, g, b, a].join('-')
	}
	protected _getHexColor(pos: Coordinate) {
		const [r, g, b, a] = this._ctx.getImageData(pos.x, pos.y, 1, 1).data
		if (a === 0) return null
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
	}
	public abstract clear(): void
}
