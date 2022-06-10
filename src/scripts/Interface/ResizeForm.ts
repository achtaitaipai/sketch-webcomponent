import MicroModal from 'micromodal'
import Sketch from '../Sketch'

export default class ResizeForm {
	private static _form: HTMLFormElement
	private static _sketch: Sketch

	static init(selector: string, sketch: Sketch) {
		this._form = document.querySelector(selector)!
		this._sketch = sketch
		this._form.addEventListener('submit', this._onSubmit.bind(this))
	}
	private static _onSubmit(e: SubmitEvent) {
		e.preventDefault()
		const width = this._form.querySelector<HTMLInputElement>('#width-js')?.valueAsNumber
		const height = this._form.querySelector<HTMLInputElement>('#height-js')?.valueAsNumber
		const align = this._form.querySelector<HTMLInputElement>('#align-js input:checked')?.value
		if (!align) throw new Error('align is undefined')
		const vals = JSON.parse(align) as number[]
		const [va, ha] = vals
		if (!width || !height) throw new Error('width or height is undefined')
		this._sketch.resize(width, height, va, ha)
		MicroModal.close('resize-modal')
	}
	static update() {
		const width = this._form.querySelector<HTMLInputElement>('#width-js')
		const height = this._form.querySelector<HTMLInputElement>('#height-js')
		if (width) width.value = this._sketch.width.toString()
		if (height) height.value = this._sketch.height.toString()
	}
}
