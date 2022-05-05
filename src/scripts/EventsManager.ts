import Listener from './Listener'
import { Coordinate, DragEventType, PointerMove, ZoomEventType } from './types'

type EventsType = 'click' | 'rightClick' | 'drag' | 'pointerMove' | 'pointerUp' | 'pointerOut' | 'zoom'

//TODO Methode Unsubscribe
export default class EventsManager {
	private _clickObservers = new Listener<Coordinate>()
	private _rightClickObservers = new Listener<Coordinate>()
	private _dragObservers = new Listener<DragEventType>()
	private _pointerMoveObservers = new Listener<PointerMove>()
	private _pointerUpObservers = new Listener<Coordinate>()
	private _pointerOutObservers = new Listener<Coordinate>()
	private _zoomObservers = new Listener<ZoomEventType>()

	private _oldPos: Coordinate | null = null

	private _buttonDown: number | null = null

	constructor(el: HTMLElement) {
		el.addEventListener('pointerdown', e => {
			this._handleTouch(e)
		})
		el.addEventListener('pointermove', e => {
			this._handleDrag(e)
		})
		el.addEventListener('pointerup', e => {
			const pos = { x: e.clientX, y: e.clientY }
			this._buttonDown = null
			this._pointerUpObservers.notify(pos)
		})
		el.addEventListener('pointercancel', e => {
			const pos = { x: e.clientX, y: e.clientY }
			this._buttonDown = null
			this._pointerOutObservers.notify(pos)
		})
		el.addEventListener('pointerout', e => {
			const pos = { x: e.clientX, y: e.clientY }
			this._buttonDown = null
			this._pointerOutObservers.notify(pos)
		})
		el.addEventListener('wheel', e => {
			const pos = { x: e.clientX, y: e.clientY }
			const dir = Math.sign(e.deltaY)
			this._zoomObservers.notify({ pos, dir })
		})
		el.addEventListener('contextmenu', e => e.preventDefault())
	}

	private _handleTouch(e: PointerEvent) {
		const pos = { x: e.clientX, y: e.clientY }
		this._buttonDown = e.button
		this._oldPos = pos
		if (e.button === 2) this._rightClickObservers.notify(pos)
		if (e.button === 0) {
			this._clickObservers.notify(pos)
		}
	}

	private _handleDrag(e: PointerEvent) {
		const pos = { x: e.clientX, y: e.clientY }
		if (this._buttonDown === null) {
			this._pointerMoveObservers.notify({ oldPos: this._oldPos || { x: -1, y: -1 }, newPos: pos })
		} else if (this._buttonDown !== null && this._oldPos) {
			this._dragObservers.notify({ oldPos: this._oldPos, newPos: pos, button: this._buttonDown })
			this._oldPos = pos
		}
	}

	public addObserver(type: EventsType, callback: Function) {
		switch (type) {
			case 'click':
				return this._clickObservers.subscribe(callback)
			case 'rightClick':
				return this._rightClickObservers.subscribe(callback)
			case 'drag':
				return this._dragObservers.subscribe(callback)
			case 'pointerMove':
				return this._pointerMoveObservers.subscribe(callback)
			case 'pointerUp':
				return this._pointerUpObservers.subscribe(callback)
			case 'pointerOut':
				return this._pointerOutObservers.subscribe(callback)
			case 'zoom':
				return this._zoomObservers.subscribe(callback)
			default:
				return -1
		}
	}
	public removeObserver(type: EventsType, id: number) {
		switch (type) {
			case 'click':
				return this._clickObservers.unsubscribe(id)
			case 'rightClick':
				return this._rightClickObservers.unsubscribe(id)
			case 'drag':
				return this._dragObservers.unsubscribe(id)
			case 'pointerMove':
				return this._pointerMoveObservers.unsubscribe(id)
			case 'pointerUp':
				return this._pointerUpObservers.unsubscribe(id)
			case 'pointerOut':
				return this._pointerOutObservers.unsubscribe(id)
			case 'zoom':
				return this._zoomObservers.unsubscribe(id)
			default:
				return null
		}
	}

	// public removeClickObserver(id: number) {
	// 	this._clickObservers.unsubscribe(id)
	// }
}
