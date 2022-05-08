import { Coordinate } from '../types'
import Layer from './Layer'

export default class Drawing extends Layer {
	public clear() {
		this._ctx.clearRect(0, 0, this.width, this.height)
	}

	public bucket(pos: Coordinate, color: string) {
		const x = Math.floor(pos.x)
		const y = Math.floor(pos.y)
		const initCol = this._getColor({ x, y })
		let queue: Coordinate[] = [{ x, y }]
		let visited: Coordinate[] = []
		while (queue.length > 0) {
			const el = queue.shift()!
			visited.push(el)
			if (this._getColor(el) === initCol) {
				let w = el.x
				let e = el.x + 1
				while (this._getColor({ x: w - 1, y: el.y }) === initCol && w > 0) {
					const nord = { x: w, y: el.y - 1 }
					const sud = { x: w, y: el.y + 1 }
					if (nord.y >= 0 && this._getColor(nord) === initCol) queue.push(nord)
					if (sud.y < this.height && this._getColor(sud) === initCol) queue.push(sud)
					w--
				}
				while (this._getColor({ x: e, y: el.y }) === initCol && e < this.width) {
					const nord = { x: e, y: el.y - 1 }
					const sud = { x: e, y: el.y + 1 }
					if (nord.y >= 0 && this._getColor(nord) === initCol) queue.push(nord)
					if (sud.y < this.height && this._getColor(sud) === initCol) queue.push(sud)
					e++
				}
				this._ctx.fillStyle = color
				this._ctx.fillRect(w, el.y, e - w, 1)
				queue.filter(q => visited.find(v => v.x === q.x && v.y === q.y) === undefined)
			}
		}
	}
}
