import { Coordinate } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Bucket extends Tool {
	public click(e: Coordinate): void {
		const coord = this._sketch.gridCoordinate(e)
		if (coord.x > 0 && coord.y > 0 && coord.x < this._sketch.width && coord.y < this._sketch.height) {
			this.drawing?.bucket(coord, this._sketch.color)
			this._sketch.updatePreview()
		}
	}
}
