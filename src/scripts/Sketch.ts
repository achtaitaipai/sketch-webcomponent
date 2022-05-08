import { Mode, Coordinate, DragEventType, PointerMove, ZoomEventType } from './types'
import Camera from './Camera'
import Drawing from './Layer/Drawing'
import Background from './Layer/Background'
import Layer from './Layer/Layer'
import EventsManager from './EventsManager'

export default class Sketch extends HTMLElement {
	public color: string = '#000000'

	private _canvas: HTMLCanvasElement
	private _ctx: CanvasRenderingContext2D
	private _drawing: Drawing
	private _cursor: Layer
	private _background: Layer
	private _mode = Mode.Paint
	public camera: Camera
	private _eventsManager: EventsManager
	public size = 1

	constructor() {
		super()
		this._canvas = this._createCanvas()!
		this._ctx = this._canvas.getContext('2d')!
		this._drawing = new Drawing()
		this._cursor = new Drawing()
		this._background = new Background()
		this.camera = new Camera(this, this._canvas)
		this._eventsManager = new EventsManager(this)
		this.camera.fitSketch()
		this._updatePreview()

		this._addEvents()
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
        }
        `
		shadow.appendChild(canvas)
		shadow.appendChild(style)
		return canvas
	}

	set mode(value: string) {
		for (const mode of Object.values(Mode)) {
			if (mode === value) this._mode = mode
		}
	}

	static get observedAttributes() {
		return ['width', 'height']
	}

	attributeChangedCallback(name: string, _: string, val: string) {
		if (!val || isNaN(Number(val))) return
		const value = Number(val)
		switch (name) {
			case 'width':
				if (value >= 1) {
					const img = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height)
					this._canvas.width = value
					this._ctx.putImageData(img, 0, 0)
					this._drawing.resize(value, this._canvas.height)
					this._cursor.resize(value, this._canvas.height)
					this._background.resize(value, this._canvas.height)
					this.camera.fitSketch()
				}
				break
			case 'height':
				const img = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height)
				this._canvas.height = value
				this._ctx.putImageData(img, 0, 0)
				this._drawing.resize(this._canvas.width, value)
				this._cursor.resize(this._canvas.width, value)
				this._background.resize(this._canvas.width, value)
				this.camera.fitSketch()
				break
			default:
				return
		}
	}

	private _handleLeftClick(e: { newPos: Coordinate; oldPos?: Coordinate }) {
		const { newPos, oldPos } = e
		const gridPos = this._gridCoordinate(newPos)
		switch (this._mode) {
			case Mode.Paint:
				this._drawing.paint(gridPos, this.size, this.color)
				this._updatePreview()
				break
			case Mode.Zoom:
				this.camera.zoom(gridPos)
				break
			case Mode.Unzoom:
				this.camera.zoom(gridPos, -1)
				break
			case Mode.Erase:
				this._drawing.erase(gridPos, this.size)
				this._updatePreview()
				break
			case Mode.Bucket:
				this._drawing.bucket(gridPos, this.color)
				this._updatePreview()
				break
			case Mode.Drag:
				if (oldPos) {
					this.camera.drag(oldPos, newPos)
				}
				break
		}
	}

	private _handleRightClick(e: Coordinate) {
		const pos = this._gridCoordinate(e)
		this._drawing.erase(pos, this.size)
		this._updatePreview()
		this._cursor.actif = false
	}

	private _handleZoom(e: ZoomEventType) {
		const { pos, dir } = e
		const gridPos = this._gridCoordinate(pos)
		if (dir > 0) this.camera.zoom(gridPos, -1)
		else this.camera.zoom(gridPos, 1)
	}

	private _handleMove(e: PointerMove) {
		const gridPos = this._gridCoordinate(e.newPos)
		if (this._mode === Mode.Paint) {
			this._cursor.actif = true
			this._cursor.clear()
			this._cursor.paint(gridPos, this.size, this.color)
			this._updatePreview()
		}
	}

	private _addEvents() {
		this._eventsManager.addObserver('click', (e: Coordinate) => {
			const newPos = e
			this._handleLeftClick({ newPos })
		})

		this._eventsManager.addObserver('rightClick', (e: Coordinate) => {
			this._handleRightClick(e)
		})
		this._eventsManager.addObserver('pointerUp', () => {
			this._cursor.actif = true
		})
		this._eventsManager.addObserver('drag', (e: DragEventType) => {
			const { button, oldPos, newPos } = e
			switch (button) {
				//wheel click
				case 1:
					this.camera.drag(oldPos, newPos)
					break
				case 2:
					this._handleRightClick(newPos)
					break
				default:
					if (this._mode === Mode.Paint || this._mode === Mode.Erase) this._handleLeftClick(e)
					break
			}
		})
		this._eventsManager.addObserver('pointerMove', (e: PointerMove) => {
			this._handleMove(e)
		})
		this._eventsManager.addObserver('pointerOut', () => {
			this._cursor.actif = false
			this._updatePreview()
		})
		this._eventsManager.addObserver('zoom', (e: ZoomEventType) => {
			this._handleZoom(e)
		})
	}

	private _updatePreview() {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
		this._background.draw(this._ctx)
		this._drawing.draw(this._ctx)
		this._cursor.draw(this._ctx)
	}

	public clear() {
		this._background.clear()
		this._drawing.clear()
		this._cursor.clear()
		this._updatePreview()
	}

	private _gridCoordinate({ x, y }: Coordinate): Coordinate {
		const { left, top } = this._canvas.getBoundingClientRect()
		const px = (x - left) / this.camera.zoomValue
		const py = (y - top) / this.camera.zoomValue
		return { x: px, y: py }
	}
}
