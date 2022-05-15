import { DragEventType } from '../types/eventsTypes'
import Tool from './AbstractTool'

export default class Handle extends Tool {
	public drag(e: DragEventType): void {
		this._sketch.camera.drag(e.oldPos, e.newPos)
	}
}
