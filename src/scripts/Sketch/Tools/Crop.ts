import { DragEventType, PointerUpType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Crop extends Tool {
	private _bgColor = '#000000AA'
	public drag({ initPos, newPos }: DragEventType) {
		this._cursor.actif = true
		this._cursor.clear()
		const from = this._sketch.gridCoordinate({ x: Math.min(initPos.x, newPos.x), y: Math.min(initPos.y, newPos.y) })
		const to = this._sketch.gridCoordinate({ x: Math.max(initPos.x, newPos.x), y: Math.max(initPos.y, newPos.y) })
		this._cursor.fillRect({ x: 0, y: 0 }, from.x, this._cursor.height, this._bgColor)
		this._cursor.fillRect({ x: from.x, y: 0 }, this._cursor.width, from.y, this._bgColor)
		this._cursor.fillRect({ x: from.x, y: to.y }, this._cursor.width - from.x, this._cursor.height - to.y, this._bgColor)
		this._cursor.fillRect({ x: to.x, y: from.y }, this._cursor.width - to.x, to.y - from.y, this._bgColor)
		this._sketch.updatePreview()
	}
	public unClick({ initPos, newPos }: PointerUpType): void {
		const from = this._sketch.gridCoordinate({ x: Math.min(initPos.x, newPos.x), y: Math.min(initPos.y, newPos.y) })
		const to = this._sketch.gridCoordinate({ x: Math.max(initPos.x, newPos.x), y: Math.max(initPos.y, newPos.y) })
		const x = Math.max(from.x, 0)
		const y = Math.max(from.y, 0)
		const w = Math.min(to.x - x, this.drawing?.width || 0 - x)
		const h = Math.min(to.y - y, this.drawing?.height || 0 - y)
		this._cursor.clear()
		if (w > 0 && h > 0) this._sketch.crop(x, y, w, h)
		this._sketch.dispatchUpdate()
		this._sketch.historyPush()
	}
}
