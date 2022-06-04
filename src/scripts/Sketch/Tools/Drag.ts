import { Coordinate, DragEventType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Drag extends Tool {
	private _img: ImageData | null = null

	public click(_: Coordinate): void {
		this._img = this.drawing.getImgData()
	}
	public drag({ initPos, newPos }: DragEventType) {
		const from = this._sketch.gridCoordinate(initPos)
		const to = this._sketch.gridCoordinate(newPos)
		const dx = to.x - from.x
		const dy = to.y - from.y
		if (this._img) {
			this.drawing.putDatas(this._img, dx, dy)
			this._sketch.updatePreview()
		}
	}
}
