import MicroModal from 'micromodal'
import Sketch from '../Sketch'

export default class DownloadForm {
	private static _form: HTMLFormElement | null
	private static _sketch: Sketch
	private static _fileNameInput: HTMLInputElement
	private static _formatInput: HTMLInputElement
	private static _scaleInput: HTMLInputElement
	private static _spriteSheetField: HTMLElement
	private static _scaleFieldset: HTMLElement
	private static _rowsInput: HTMLInputElement
	private static _columnsInput: HTMLInputElement

	public static init(selector: string, sketch: Sketch) {
		this._sketch = sketch
		const modal = document.querySelector(selector)
		this._form = modal!.querySelector('form')!
		this._fileNameInput = this._form.querySelector('#fileName-download')!
		this._formatInput = this._form.querySelector('#format-download')!
		this._scaleInput = this._form.querySelector('#scale-download')!

		this._spriteSheetField = this._form.querySelector('.downloadForm_spritesheet')!
		this._scaleFieldset = this._form.querySelector('.scale')!
		this._rowsInput = this._form.querySelector('#rows-download')!
		this._columnsInput = this._form.querySelector('#columns-download')!
		this._form?.addEventListener('submit', this._handleSubmit.bind(this))
		this._formatInput.addEventListener('change', this.updateContent.bind(this))
		this._rowsInput.addEventListener('change', this._updateSpriteSheetValues.bind(this))
		this._columnsInput.addEventListener('change', this._updateSpriteSheetValues.bind(this))
	}

	private static _handleSubmit(e: SubmitEvent) {
		e.preventDefault()

		const fileName = this._fileNameInput.value
		const format = this._formatInput.value
		const scale = this._scaleInput.valueAsNumber
		const rows = this._rowsInput.valueAsNumber
		const columns = this._columnsInput.valueAsNumber

		this._sketch.download(fileName, format, scale, columns, rows)

		MicroModal.close('download-modal')
	}

	public static updateContent() {
		if (this._isSpriteSheet()) {
			this._setSpriSheetInitValues()
			this._spriteSheetField.style.setProperty('display', 'flex')
		} else {
			this._setSpriSheetInitValues()
			this._spriteSheetField.style.setProperty('display', 'none')
		}
		this._scaleFieldset.style.setProperty('display', this._formatInput.value === 'json' ? 'none' : 'block')
	}

	private static _isSpriteSheet() {
		return this._sketch.animation.frames.length > 1 && this._formatInput.value === 'png'
	}

	private static _setSpriSheetInitValues() {
		const length = this._sketch.animation.frames.length
		const biggestDisvisor = this._biggestDisvisor(length)
		this._rowsInput.value = biggestDisvisor.toString()
		this._rowsInput.setAttribute('max', length.toString())
		this._columnsInput.value = (length / biggestDisvisor).toString()
		this._columnsInput.setAttribute('max', length.toString())
	}

	private static _updateSpriteSheetValues(e: Event) {
		const target = e.target as HTMLInputElement
		const value = target.valueAsNumber
		const length = this._sketch.animation.frames.length
		const toSet = Math.ceil(length / value)
		if (target === this._columnsInput) {
			this._rowsInput.valueAsNumber = toSet
		} else {
			this._columnsInput.valueAsNumber = toSet
		}
	}

	private static _biggestDisvisor(num: number) {
		for (let i = Math.floor(num / 2); i > 0; i--) {
			if (num % i === 0) return i
		}
		return 1
	}
}
