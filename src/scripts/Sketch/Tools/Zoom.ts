import { Coordinate } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Zoom extends Tool {
	public click(e: Coordinate) {
		this._sketch.camera.zoom(this._sketch.gridCoordinate(e))
	}
}
