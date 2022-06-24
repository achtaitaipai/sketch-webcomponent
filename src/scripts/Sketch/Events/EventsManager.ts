import Listener from './Listener'
import { Coordinate, DragEventType, PointerMove, PointerUpType, ZoomEventType, EventsNames } from '../types/eventsTypes'
import interact from 'interactjs'

export default class EventsManager {
	private _clickObservers = new Listener<Coordinate>()
	private _rightClickObservers = new Listener<Coordinate>()
	private _dragObservers = new Listener<DragEventType>()
	private _pointerMoveObservers = new Listener<PointerMove>()
	private _unclickObservers = new Listener<PointerUpType>()
	private _rightUnclickObservers = new Listener<Coordinate>()
	private _pointerOutObservers = new Listener<Coordinate>()
	private _zoomObservers = new Listener<ZoomEventType>()

	private _evtCache: PointerEvent[] = []

	private _oldPos: Coordinate | null = null
	private _initPos: Coordinate | null = null
	private _buttonDown: number | null = null
	private _inGesture = false

	constructor(el: HTMLElement) {
		interact(el).gesturable({
			onmove: event => {
				if (event.scale !== 1) {
					const pos = { x: event.client.x as number, y: event.client.y as number }
					this._zoomObservers.notify({ pos, factor: event.scale })
				}
				event.stopPropagation()
			},
			onstart: _ => {
				this._inGesture = true
			},
			onend: _ => {
				this._inGesture = false
			},
		})
		el.addEventListener('pointerdown', e => {
			if (!this._inGesture) this._handleTouch(e)
		})
		document.addEventListener('pointermove', e => {
			if (!this._inGesture) this._handleDrag(e)
		})
		document.addEventListener('pointerup', e => {
			if (this._initPos) {
				this._unclickObservers.notify({ button: e.button, initPos: this._initPos, newPos: { x: e.clientX, y: e.clientY } })
			} else if (e.button === 2) {
				this._rightUnclickObservers.notify({ x: e.clientX, y: e.clientY })
				console.log('right')
			}
			this._handleOut(e)
		})
		document.addEventListener('pointercancel', e => {
			this._handleOut(e)
		})
		el.addEventListener('wheel', e => {
			const pos = { x: e.clientX, y: e.clientY }
			const dir = -Math.sign(e.deltaY)
			this._zoomObservers.notify({ pos, dir })
		})
		el.addEventListener('contextmenu', e => e.preventDefault())
	}

	private _handleTouch(e: PointerEvent) {
		this._evtCache.push(e)
		if (this._evtCache.length === 1) {
			const pos = { x: e.clientX, y: e.clientY }
			this._buttonDown = e.button
			this._oldPos = pos
			if (e.button === 2) {
				this._rightClickObservers.notify(pos)
			} else if (e.button === 0) {
				this._initPos = pos
				this._clickObservers.notify(pos)
			}
		}
	}

	private _handleDrag(e: PointerEvent) {
		const pos = { x: e.clientX, y: e.clientY }

		if (this._buttonDown === null) {
			this._pointerMoveObservers.notify({ oldPos: this._oldPos || { x: -1, y: -1 }, newPos: pos })
		} else if (this._buttonDown !== null && this._oldPos) {
			this._dragObservers.notify({ oldPos: this._oldPos, newPos: pos, button: this._buttonDown, initPos: this._initPos || { x: 0, y: 0 } })
			this._oldPos = pos
		}
	}

	private _handleOut(e: PointerEvent) {
		const pos = { x: e.clientX, y: e.clientY }
		this._buttonDown = null
		this._pointerOutObservers.notify(pos)
		this._evtCache = this._evtCache.filter(evt => evt.pointerId !== e.pointerId)
		this._initPos = null
	}

	public addObserver(type: EventsNames, callback: Function) {
		switch (type) {
			case 'click':
				return this._clickObservers.subscribe(callback)
			case 'rightClick':
				return this._rightClickObservers.subscribe(callback)
			case 'drag':
				return this._dragObservers.subscribe(callback)
			case 'pointerMove':
				return this._pointerMoveObservers.subscribe(callback)
			case 'unclick':
				return this._unclickObservers.subscribe(callback)
			case 'rightUnClick':
				return this._rightUnclickObservers.subscribe(callback)
			case 'pointerOut':
				return this._pointerOutObservers.subscribe(callback)
			case 'zoom':
				return this._zoomObservers.subscribe(callback)
			default:
				return -1
		}
	}
	public removeObserver(type: EventsNames, id: number) {
		switch (type) {
			case 'click':
				return this._clickObservers.unsubscribe(id)
			case 'rightClick':
				return this._rightClickObservers.unsubscribe(id)
			case 'drag':
				return this._dragObservers.unsubscribe(id)
			case 'pointerMove':
				return this._pointerMoveObservers.unsubscribe(id)
			case 'unclick':
				return this._unclickObservers.unsubscribe(id)
			case 'rightUnClick':
				return this._rightUnclickObservers.unsubscribe(id)
			case 'pointerOut':
				return this._pointerOutObservers.unsubscribe(id)
			case 'zoom':
				return this._zoomObservers.unsubscribe(id)
			default:
				return null
		}
	}
}
