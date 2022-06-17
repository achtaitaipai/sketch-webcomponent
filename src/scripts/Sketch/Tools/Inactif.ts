import { Coordinate, PointerUpType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Inactif extends Tool {
	public click(_: Coordinate): void {
		this._sketch.dispatchEvent(new CustomEvent('inactif-click'))
	}
	public unClick(_: PointerUpType): void {}
}
