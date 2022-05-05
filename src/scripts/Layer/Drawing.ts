import Layer from './Layer'

export default class Drawing extends Layer {
	public clear() {
		this._ctx.clearRect(0, 0, this.width, this.height)
	}
}
