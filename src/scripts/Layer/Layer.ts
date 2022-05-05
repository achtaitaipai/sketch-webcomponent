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

	public draw(ctx: CanvasRenderingContext2D) {
		if (this.actif) ctx.drawImage(this._canvas, 0, 0)
	}

	public resize(w: number, h: number) {
		const img = this._ctx.getImageData(0, 0, this.width, this.height)
		this.width = w
		this.height = h
		this._ctx.putImageData(img, 0, 0)
	}
	public paint(pos: Coordinate, size?: number, color?: string) {
		this._ctx.fillStyle = color || '#000000'
		this._ctx.fillRect(Math.floor(pos.x), Math.floor(pos.y), size || 1, size || 1)
	}

	public erase(pos: Coordinate, size?: number) {
		this._ctx.clearRect(Math.floor(pos.x), Math.floor(pos.y), size || 1, size || 1)
	}
	public abstract clear(): void
}
