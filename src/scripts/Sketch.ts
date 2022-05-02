enum Mode {
	Paint = 'paint',
	Zoom = 'zoom',
	Unzoom = 'unzoom',
	Drag = 'drag',
	Erase = 'erase',
}

interface Point {
	x: number
	y: number
}
export default class Sketch extends HTMLElement {
	private _canvas: HTMLCanvasElement
	private _ctx: CanvasRenderingContext2D
	private _zoomValue: number = 1
	private _translate: { x: number; y: number } = { x: 0, y: 0 }
	private _pointerPressed: number | null
	private _oldPointerPos: Point | null = null
	private _buttonPressed: number | null = null
	private _mode = Mode.Paint

	public color: string

	static get observedAttributes() {
		return ['zoom', 'width', 'height']
	}

	constructor() {
		super()
		this._canvas = this._initDom().querySelector('canvas')!
		this._ctx = this._canvas.getContext('2d')!
		const zoom = this.getAttribute('zoom')
		const width = this.getAttribute('width')
		const height = this.getAttribute('height')
		this._canvas.width = width && !isNaN(Number(width)) ? Number(width) : 5
		this._canvas.height = height && !isNaN(Number(height)) ? Number(height) : 5
		this.zoom = zoom && !isNaN(Number(zoom)) ? Number(zoom) : 1
		this._pointerPressed = null

		this.color = '#000000'

		this.addEventListener('pointerdown', e => this._handlePoint(e))
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

	set zoom(value: number) {
		this._zoomValue = value
		const containerRect = this.getBoundingClientRect()
		this._canvas.style.width = this._canvas.width * this._zoomValue + 'px'
		this._translate = {
			x: -(containerRect.width - this._canvas.width * this._zoomValue) / 2,
			y: -(containerRect.height - this._canvas.height * this._zoomValue) / 2,
		}
		this._canvas.style.setProperty('transform', `translate(${-this._translate.x}px,${-this._translate.y}px)`)
	}

	public adaptToWorkPlace() {
		const { width, height } = this.getBoundingClientRect()
		const canvasRatio = this._canvas.width / this._canvas.height
		const containerRatio = width / height
		this.zoom = canvasRatio < containerRatio ? height / this._canvas.height : width / this._canvas.width
	}

	private _handlePoint(e: PointerEvent) {
		e.preventDefault()
		this._pointerPressed = e.pointerId
		this._buttonPressed = e.button
		this._oldPointerPos = { x: e.clientX, y: e.clientY }
		const gridPos = this._gridCoordinate(e.clientX, e.clientY)
		switch (this._mode) {
			case Mode.Paint:
				if (this._buttonPressed === 0) this._paint(gridPos)
				else if (this._buttonPressed === 2) this._erase(gridPos)
				break
			case Mode.Erase:
				if (this._buttonPressed !== 1) this._erase(gridPos)
				break
			case Mode.Zoom:
				this._zoom(gridPos.x, gridPos.y)
				break
			case Mode.Unzoom:
				this._zoom(gridPos.x, gridPos.y, -1)
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
						const gridPos = this._gridCoordinate(e.clientX, e.clientY)
						if (this._buttonPressed === 2) this._erase(gridPos)
						else {
							this._paint(gridPos)
						}
						this._oldPointerPos = { x: e.clientX, y: e.clientY }
					}
					break
				case Mode.Erase:
					if (this._pointerPressed === e.pointerId) {
						const gridPos = this._gridCoordinate(e.clientX, e.clientY)
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
		const gridPos = this._gridCoordinate(e.clientX, e.clientY)
		if (e.deltaY > 0) this._zoom(gridPos.x, gridPos.y, -1)
		else if (e.deltaY <= 10) this._zoom(gridPos.x, gridPos.y, 1)
	}

	private _drag({ x, y }: Point) {
		if (this._oldPointerPos) {
			const newPos = { x, y }
			this._translate.x -= newPos.x - this._oldPointerPos.x
			this._translate.y -= newPos.y - this._oldPointerPos.y
			this._oldPointerPos = newPos
			this._canvas.style.setProperty('transform', `translate(${-this._translate.x}px,${-this._translate.y}px)`)
		}
	}

	private _paint(pos: Point, width?: number, height?: number) {
		this._ctx.fillStyle = this.color
		this._ctx.fillRect(Math.floor(pos.x), Math.floor(pos.y), width || 1, height || 1)
	}
	private _erase(pos: Point, width?: number, height?: number) {
		this._ctx.clearRect(Math.floor(pos.x), Math.floor(pos.y), width || 1, height || 1)
	}

	private _zoom(x?: number, y?: number, dir?: number) {
		let newZoomValue = this._zoomValue > 1 ? this._zoomValue + 1 : this._zoomValue * 2
		if (dir && dir < 0) newZoomValue = this._zoomValue > 1 ? this._zoomValue - 1 : this._zoomValue * 0.5
		if (x && y) {
			x = Math.min(Math.max(x, 0), this._canvas.width)
			y = Math.min(Math.max(y, 0), this._canvas.width)
			const tx = x * newZoomValue - x * this._zoomValue + this._translate.x
			const ty = y * newZoomValue - y * this._zoomValue + this._translate.y
			this._translate = { x: tx, y: ty }
		}
		this._zoomValue = newZoomValue
		this._canvas.style.width = this._canvas.width * this._zoomValue + 'px'
		this._canvas.style.setProperty('transform', `translate(${-this._translate.x}px,${-this._translate.y}px)`)
	}

	private _gridCoordinate(clientX: number, clientY: number): Point {
		const { left, top } = this._canvas.getBoundingClientRect()
		const x = (clientX - left) / this._zoomValue
		const y = (clientY - top) / this._zoomValue
		return { x, y }
	}

	attributeChangedCallback(name: string, _: string, val: string) {
		if (!val || isNaN(Number(val))) return
		switch (name) {
			case 'zoom':
				this._zoomValue = Number(val)
				const containerRect = this.getBoundingClientRect()
				this._canvas.style.width = this._canvas.width * this._zoomValue + 'px'
				this._translate = {
					x: -(containerRect.width - this._canvas.width * this._zoomValue) / 2,
					y: -(containerRect.height - this._canvas.height * this._zoomValue) / 2,
				}
				this._canvas.style.setProperty('transform', `translate(${-this._translate.x}px,${-this._translate.y}px)`)
				break

			default:
				return
		}
	}

	private _initDom() {
		const shadow = this.attachShadow({ mode: 'open' })
		const canvas = document.createElement('canvas')
		const style = document.createElement('style')
		style.textContent = /*css*/ `
        canvas{
			-ms-interpolation-mode: nearest-neighbor;
			image-rendering: pixelated;    
			background-color: #b5b5b6;
        }
        `
		shadow.appendChild(canvas)
		shadow.appendChild(style)
		return shadow
	}
}
