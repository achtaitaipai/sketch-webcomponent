import Sketch from '../Sketch'

export default class AnimActions {
	private static _sketch: Sketch
	private static _playBtn: HTMLInputElement
	// private static _oignonBtn: HTMLInputElement
	private static _fpsInput: HTMLInputElement

	static init(sketch: Sketch) {
		this._playBtn = document.getElementById('play') as HTMLInputElement
		// this._oignonBtn = document.getElementById('oignon') as HTMLInputElement
		this._fpsInput = document.getElementById('fps') as HTMLInputElement
		this._playBtn.addEventListener('click', this._handleClickPlay.bind(this))
		this._fpsInput.addEventListener('input', this._handleInputFps.bind(this))
		this._sketch = sketch
	}

	private static _handleClickPlay(e: MouseEvent) {
		const target = e.target as HTMLInputElement
		if (target.checked) this._sketch.play()
		else this._sketch.stop()
	}

	private static _handleInputFps(e: Event) {
		const target = e.target as HTMLInputElement
		const fps = target.valueAsNumber
		this._sketch.fps = fps
	}
}
