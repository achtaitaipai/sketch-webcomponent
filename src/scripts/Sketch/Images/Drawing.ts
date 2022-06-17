import createColor from '../Color'
import { Coordinate } from '../types/eventsTypes'
import AbstractImage from './AbstractImage'

export default class Drawing extends AbstractImage {
	public clear() {
		this._ctx.clearRect(0, 0, this.width, this.height)
	}

	public bucket(pos: Coordinate, newColor: string) {
		const index = pos.y * this.width + pos.x
		const datas = this.getImgData().data
		const startColor = createColor([...datas.slice(4 * index, 4 * index + 4)])
		const color = createColor(newColor)
		if (color.hex === startColor.hex) return
		const queue = new Set([index])
		const values = queue.values()
		let val = values.next()
		while (!val.done) {
			const col = createColor([...datas.slice(4 * val.value, 4 * val.value + 4)])
			if (col.hex === startColor.hex) {
				const x = val.value % this.width
				const y = Math.floor(val.value / this.width)
				if (x > 0) queue.add(val.value - 1)
				if (x < this.width - 1) queue.add(val.value + 1)
				if (y > 0) queue.add(val.value - this.width)
				if (y < this.height - 1) queue.add(val.value + this.width)
				this.paint({ x, y }, 1, newColor)
			}
			val = values.next()
		}
	}

	public line(pos0: Coordinate, pos1: Coordinate, size: number, color: string) {
		//http://fredericgoset.ovh/mathematiques/courbes/fr/bresenham_line.html
		const x0 = Math.floor(pos0.x)
		const y0 = Math.floor(pos0.y)
		const x1 = Math.floor(pos1.x)
		const y1 = Math.floor(pos1.y)
		if (x0 === x1 && y0 === y1) {
			this.paint(pos0, size, color)
			return
		}
		const dx = Math.abs(x1 - x0)
		const dy = Math.abs(y1 - y0)
		const incX = Math.sign(x1 - x0)
		const incY = Math.sign(y1 - y0)
		if (dy === 0) {
			for (let x = x0; x !== x1 + incX; x += incX) {
				this.paint({ x, y: y0 }, size, color)
			}
		} else if (dx === 0) {
			for (let y = y0; y !== y1 + incY; y += incY) {
				this.paint({ x: x0, y }, size, color)
			}
		} else if (dx >= dy) {
			const slope = 2 * dy
			const errorInc = -2 * dx
			let error = -dx
			let y = y0
			for (let x = x0; x !== x1 + incX; x += incX) {
				this.paint({ x, y }, size, color)
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
				this.paint({ x, y }, size, color)
				error += slope
				if (error >= 0) {
					x += incX
					error += errorInc
				}
			}
		}
	}

	public fillRect(pos: Coordinate, width: number, height: number, color: string) {
		this._ctx.fillStyle = color
		this._ctx.fillRect(pos.x, pos.y, width, height)
	}

	public rect(pos: Coordinate, width: number, height: number, size: number, color: string) {
		this.line({ x: pos.x, y: pos.y }, { x: pos.x + width, y: pos.y }, size, color)
		this.line({ x: pos.x + width, y: pos.y }, { x: pos.x + width, y: pos.y + height }, size, color)
		this.line({ x: pos.x, y: pos.y + height }, { x: pos.x + width, y: pos.y + height }, size, color)
		this.line({ x: pos.x, y: pos.y }, { x: pos.x, y: pos.y + height }, size, color)
	}

	public ellipse(centre: { x: number; y: number }, width: number, height: number, size: number, color: string) {
		//https://fr.acervolima.com/algorithme-de-dessin-d-ellipse-mediane/
		this._ctx.fillStyle = color
		const rx = Math.floor(width / 2)
		const ry = Math.floor(height / 2)
		let x = 0
		let y = ry
		let d1 = ry * ry - rx * rx * ry + 0.25 * rx * rx
		let dx = 2 * ry * ry * x
		let dy = 2 * rx * rx * y

		while (dx < dy) {
			this._ctx.fillRect(x + centre.x, y + centre.y, size, size)
			this._ctx.fillRect(-x + centre.x, y + centre.y, size, size)
			this._ctx.fillRect(x + centre.x, -y + centre.y, size, size)
			this._ctx.fillRect(-x + centre.x, -y + centre.y, size, size)
			if (d1 < 0) {
				x++
				dx = dx + 2 * ry * ry
				d1 = d1 + dx + ry * ry
			} else {
				x++
				y--
				dx = dx + 2 * ry * ry
				dy = dy - 2 * rx * rx
				d1 = d1 + dx - dy + ry * ry
			}
		}
		let d2 = ry * ry * ((x + 0.5) * (x + 0.5)) + rx * rx * ((y - 1) * (y - 1)) - rx * rx * ry * ry
		while (y >= 0) {
			this._ctx.fillRect(x + centre.x, y + centre.y, size, size)
			this._ctx.fillRect(-x + centre.x, y + centre.y, size, size)
			this._ctx.fillRect(x + centre.x, -y + centre.y, size, size)
			this._ctx.fillRect(-x + centre.x, -y + centre.y, size, size)
			if (d2 > 0) {
				y--
				dy = dy - 2 * rx * rx
				d2 = d2 + rx * rx - dy
			} else {
				y--
				x++
				dx = dx + 2 * ry * ry
				dy = dy - 2 * rx * rx
				d2 = d2 + dx - dy + rx * rx
			}
		}
	}

	public drawImg(img: HTMLCanvasElement) {
		this._ctx.drawImage(img, 0, 0)
	}
}
