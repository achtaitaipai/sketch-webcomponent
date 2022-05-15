import { Coordinate } from './types'
import Camera from './Camera'
import Drawing from './Layer/Drawing'
import Background from './Layer/Background'
import Layer from './Layer/Layer'
import ToolsManager from './Tools/ToolsManager'

export default class Sketch extends HTMLElement {
	public _canvas: HTMLCanvasElement
	private _ctx: CanvasRenderingContext2D
	private _drawing: Drawing
	private _cursor: Drawing
	private _background: Layer
	public camera: Camera
	public size = 1
	public color: string = '#000000'
	private _tools: ToolsManager

	constructor() {
		super()
		this._canvas = this._createCanvas()!
		this._ctx = this._canvas.getContext('2d')!
		this._drawing = new Drawing()
		this._cursor = new Drawing()
		this._background = new Background()
		this.camera = new Camera(this, this._canvas)

		this._tools = new ToolsManager(this, this._drawing, this._cursor)
	}

	connectedCallback() {
		this.camera.fitSketch()
		this.updatePreview()
	}

	private _createCanvas() {
		const shadow = this.attachShadow({ mode: 'open' })
		const canvas = document.createElement('canvas')
		const style = document.createElement('style')
		style.textContent = /*css*/ `
        canvas{
			-ms-interpolation-mode: nearest-neighbor;
			image-rendering: pixelated;    
			background-color: #ffff;
			cursor:crosshair;
			pointer-events:none;
        }
        `
		shadow.appendChild(canvas)
		shadow.appendChild(style)
		return canvas
	}
	get width() {
		return this._canvas.width
	}
	get height() {
		return this._canvas.height
	}

	set tool(value: string) {
		this._tools.tool = value
	}

	static get observedAttributes() {
		return ['width', 'height']
	}

	public crop(x: number, y: number, width: number, height: number) {
		this._canvas.width = width
		this._canvas.height = height
		this._drawing.crop(x, y, width, height)
		this._cursor.resize(width, height)
		this._background.resize(width, height)
		this._background.clear()
		this.camera.fitSketch()
		this.updatePreview()
	}
	public resize(width: number, height: number, hAlign: number, vAlign: number) {
		this._canvas.width = width
		this._canvas.height = height
		this._drawing.resize(width, height, hAlign, vAlign)
		this._cursor.resize(width, height)
		this._background.resize(width, height)
		this._background.clear()
		this.camera.fitSketch()
		this.updatePreview()
	}

	attributeChangedCallback(name: string, _: string, val: string) {
		if (!val || isNaN(Number(val))) return
		const value = Number(val)
		switch (name) {
			case 'width':
				if (value >= 1) {
					this._canvas.width = value
					this._drawing.resize(value, this._canvas.height)
					this._cursor.resize(value, this._canvas.height)
					this._background.resize(value, this._canvas.height)
					this._background.clear()
					this.camera.fitSketch()
					this.updatePreview()
				}
				break
			case 'height':
				this._canvas.height = value
				this._drawing.resize(this._canvas.width, value)
				this._cursor.resize(this._canvas.width, value)
				this._background.resize(this._canvas.width, value)
				this._background.clear()
				this.camera.fitSketch()
				this.updatePreview()
				break
			default:
				return
		}
	}

	public updatePreview() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
		this._ctx.drawImage(this._background.canvas, 0, 0)
		this._ctx.drawImage(this._drawing.canvas, 0, 0)
		this._ctx.drawImage(this._cursor.canvas, 0, 0)
	}

	public clear() {
		this._background.clear()
		this._drawing.clear()
		this._cursor.clear()
		this.updatePreview()
	}

	public gridCoordinate({ x, y }: Coordinate): Coordinate {
		const { left, top } = this._canvas.getBoundingClientRect()
		const px = (x - left) / this.camera.zoomValue
		const py = (y - top) / this.camera.zoomValue
		return { x: Math.floor(px), y: Math.floor(py) }
	}
}
