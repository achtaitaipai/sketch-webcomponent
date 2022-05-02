import { Mode, Coordinate } from './types'
import Camera from './Camera'

export default class Sketch extends HTMLElement {
	private _canvas: HTMLCanvasElement
	private _ctx: CanvasRenderingContext2D
	private _pointerPressed: number | null = null
	private _oldPointerPos: Coordinate | null = null
	private _buttonPressed: number | null = null
	private _mode = Mode.Paint
	public _camera: Camera

	public color: string = '#000000'

	constructor() {
		super()
		this._canvas = this._createCanvas()!
		this._ctx = this._canvas.getContext('2d')!
		// this.fitSketch()
		this._camera = new Camera(this, this._canvas)
		this._camera.fitSketch()

		this._addEvents()
	}

	//add canvas to shadow dom and define style
	private _createCanvas() {
		const shadow = this.attachShadow({ mode: 'open' })
		const canvas = document.createElement('canvas')
		const style = document.createElement('style')
		style.textContent = /*css*/ `
        canvas{
			-ms-interpolation-mode: nearest-neighbor;
			image-rendering: pixelated;    
			background-color: #ffff;
        }
        `
		shadow.appendChild(canvas)
		shadow.appendChild(style)
		return canvas
	}

	private _addEvents() {
		this.addEventListener('pointerdown', e => this._handleTouch(e))
		this.addEventListener('pointerout', _ => this._handlePointerOut())
		this.addEventListener('pointerup', _ => this._handlePointerOut())
		this.addEventListener('pointermove', e => this._handlePointerMove(e))
		this.addEventListener('wheel', e => this._handleWheel(e))
		this.addEventListener('contextmenu', e => e.preventDefault())
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
					this._camera.fitSketch()
				}
				break
			case 'height':
				const img = this._ctx.getImageData(0, 0, this._canvas.width, this._canvas.height)
				this._canvas.height = value
				this._ctx.putImageData(img, 0, 0)
				this._camera.fitSketch()
				break
			default:
				return
		}
	}

	private _handleTouch(e: PointerEvent) {
		e.preventDefault()
		this._pointerPressed = e.pointerId
		this._buttonPressed = e.button
		const pos = { x: e.clientX, y: e.clientY }
		this._oldPointerPos = pos
		const gridPos = this._gridCoordinate(pos)
		switch (this._mode) {
			case Mode.Paint:
				if (this._buttonPressed === 0) this._paint(gridPos)
				else if (this._buttonPressed === 2) this._erase(gridPos)
				break
			case Mode.Erase:
				if (this._buttonPressed !== 1) this._erase(gridPos)
				break
			case Mode.Zoom:
				this._camera.zoom(gridPos)
				break
			case Mode.Unzoom:
				this._camera.zoom(gridPos, -1)
				break

			default:
				break
		}
	}

	private _handlePointerOut() {
		this._pointerPressed = null
	}

	private _handlePointerMove(e: PointerEvent) {
		const pos = { x: e.clientX, y: e.clientY }
		if (this._pointerPressed === e.pointerId) {
			if (this._buttonPressed === 1) {
				this._drag(pos)
				return
			}
			switch (this._mode) {
				case Mode.Paint:
					if (this._pointerPressed === e.pointerId) {
						const gridPos = this._gridCoordinate(pos)
						if (this._buttonPressed === 2) this._erase(gridPos)
						else {
							this._paint(gridPos)
						}
						this._oldPointerPos = { x: e.clientX, y: e.clientY }
					}
					break
				case Mode.Erase:
					if (this._pointerPressed === e.pointerId) {
						const gridPos = this._gridCoordinate(pos)
						this._erase(gridPos)
						this._oldPointerPos = { x: e.clientX, y: e.clientY }
					}
					break

				case Mode.Drag:
					this._drag(pos)
					break

				default:
					break
			}
		}
	}

	private _handleWheel(e: WheelEvent) {
		const pos = { x: e.clientX, y: e.clientY }
		const gridPos = this._gridCoordinate(pos)
		if (e.deltaY > 0) this._camera.zoom(gridPos, -1)
		else if (e.deltaY <= 10) this._camera.zoom(gridPos, 1)
	}

	private _drag({ x, y }: Coordinate) {
		if (this._oldPointerPos) {
			const tx = x - this._oldPointerPos.x
			const ty = y - this._oldPointerPos.y
			this._oldPointerPos = { x, y }
			this._camera.translate = {
				x: this._camera.translate.x - tx,
				y: this._camera.translate.y - ty,
			}
		}
	}

	private _paint(pos: Coordinate, width?: number, height?: number) {
		this._ctx.fillStyle = this.color
		this._ctx.fillRect(Math.floor(pos.x), Math.floor(pos.y), width || 1, height || 1)
	}
	private _erase(pos: Coordinate, width?: number, height?: number) {
		this._ctx.clearRect(Math.floor(pos.x), Math.floor(pos.y), width || 1, height || 1)
	}

	private _gridCoordinate({ x, y }: Coordinate): Coordinate {
		const { left, top } = this._canvas.getBoundingClientRect()
		const px = (x - left) / this._camera.zoomValue
		const py = (y - top) / this._camera.zoomValue
		return { x: px, y: py }
	}
}
