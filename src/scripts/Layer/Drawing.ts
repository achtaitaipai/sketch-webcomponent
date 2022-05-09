import { Coordinate } from '../types'
import Layer from './Layer'

export default class Drawing extends Layer {
	public clear() {
		this._ctx.clearRect(0, 0, this.width, this.height)
	}

	public bucket(pos: Coordinate, color: string) {
		this._ctx.fillStyle = color
		const x = Math.floor(pos.x)
		const y = Math.floor(pos.y)
		const initCol = this._getColor({ x, y })
		let queue: Coordinate[] = [{ x, y }]

		const addNeighbor = (x: number, y: number) => {
			const nord = { x, y: y - 1 }
			const sud = { x, y: y + 1 }
			if (nord.y >= 0 && this._getColor(nord) === initCol) queue.push(nord)
			if (sud.y < this.height && this._getColor(sud) === initCol) queue.push(sud)
		}

		let visited: Coordinate[] = []
		while (queue.length > 0) {
			const el = queue.shift()!
			visited.push(el)
			addNeighbor(el.x, el.y)
			if (this._getColor(el) === initCol) {
				let w = el.x
				let e = el.x
				while (this._getColor({ x: w - 1, y: el.y }) === initCol && w > 0) {
					w--
					addNeighbor(w, el.y)
				}
				while (this._getColor({ x: e + 1, y: el.y }) === initCol && e < this.width - 1) {
					e++
					addNeighbor(e, el.y)
				}
				this._ctx.fillRect(w, el.y, e - w + 1, 1)
				queue.filter(q => visited.find(v => v.x === q.x && v.y === q.y) === undefined)
			}
		}
	}
	public line(pos0: Coordinate, pos1: Coordinate, color: string) {
		//http://fredericgoset.ovh/mathematiques/courbes/fr/bresenham_line.html
		const x0 = Math.floor(pos0.x)
		const y0 = Math.floor(pos0.y)
		const x1 = Math.floor(pos1.x)
		const y1 = Math.floor(pos1.y)
		const dx = Math.abs(x1 - x0)
		const dy = Math.abs(y1 - y0)
		const incX = Math.sign(x1 - x0)
		const incY = Math.sign(y1 - y0)
		if (dy === 0) {
			for (let x = x0; x !== x1 + incX; x += incX) {
				this.paint({ x, y: y0 }, 1, color)
			}
		} else if (dx === 0) {
			for (let y = y0; y !== y1 + incY; y += incY) {
				this.paint({ x: x0, y }, 1, color)
			}
		} else if (dx >= dy) {
			const slope = 2 * dy
			const errorInc = -2 * dx
			let error = -dx
			let y = y0
			for (let x = x0; x !== x1 + incX; x += incX) {
				this.paint({ x, y }, 1, color)
				error += slope
				if (error >= 0) {
					y += incY
					error += errorInc
				}
			}
		} else {
			const slope = 2 * dx
			const errorInc = -2 * dy
			let error = -dy
			let x = x0
			for (let y = y0; y !== y1 + incY; y += incY) {
				this.paint({ x, y }, 1, color)
				error += slope
				if (error >= 0) {
					x += incX
					error += errorInc
				}
			}
		}
	}
}
