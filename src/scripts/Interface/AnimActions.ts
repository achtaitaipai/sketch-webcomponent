import Sketch from '../Sketch'

export default class AnimActions {
	private static _sketch: Sketch
	private static _playBtn: HTMLInputElement
	private static _onionBtn: HTMLInputElement
	private static _fpsInput: HTMLInputElement

	static init(sketch: Sketch) {
		this._playBtn = document.getElementById('play') as HTMLInputElement
		this._onionBtn = document.getElementById('oignon') as HTMLInputElement
		this._fpsInput = document.getElementById('fps') as HTMLInputElement
		this._playBtn.addEventListener('click', this._handleClickPlay.bind(this))
		this._fpsInput.addEventListener('change', this._handleChangeFps.bind(this))
		this._onionBtn.addEventListener('change', this._handleChangeOnion.bind(this))
		this._sketch = sketch
	}

	private static _handleClickPlay(e: MouseEvent) {
		const target = e.target as HTMLInputElement
		if (target.checked) this._sketch.play()
		else this._sketch.stop()
	}

	private static _handleChangeFps(e: Event) {
		const target = e.target as HTMLInputElement
		const fps = target.value
		const value = Math.floor(Math.min(24, Math.max(1, Number(fps))))
		target.value = value.toString()
		this._sketch.fps = value
	}

	private static _handleChangeOnion() {
		this._sketch.onion = this._onionBtn.checked
		this._sketch.updatePreview()
	}
}
