import { Coordinate } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Bucket extends Tool {
	public click(e: Coordinate): void {
		this._drawing.bucket(this._sketch.gridCoordinate(e), this._sketch.color)
		this._sketch.updatePreview()
	}
}
