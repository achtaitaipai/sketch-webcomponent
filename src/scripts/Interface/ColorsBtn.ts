import Sketch from '../Sketch/Sketch'

export default class ColorsBtn {
	private static _sketch: Sketch | null = null

	static init(selector: string, sketch: Sketch) {
		this._sketch = sketch
		const btns = document.querySelectorAll<HTMLInputElement>(selector)
		btns.forEach(btn => {
			const label = btn.nextElementSibling as HTMLLabelElement

			btn.addEventListener('click', _ => {
				this._handleClick(btn)
			})
			label.addEventListener('dblclick', _ => {
				const inputColor = document.createElement('input')
				inputColor.type = 'color'
				inputColor.value = btn.value
				inputColor.style.display = 'none'
				inputColor.click()
				inputColor.addEventListener('input', _ => {
					ColorsBtn._handleNewClr(inputColor, btn, label)
				})

				label.appendChild(inputColor)
			})
		})
	}

	private static _handleNewClr(inputColor: HTMLInputElement, radio: HTMLInputElement, label: HTMLLabelElement) {
		const clr = inputColor.value
		radio.id = clr
		radio.value = clr
		label.setAttribute('for', clr)
		label.style.setProperty('--clr', clr)
		if (this._sketch) {
			this._sketch.color = radio.value
		}
	}

	private static _handleClick(radio: HTMLInputElement) {
		if (this._sketch) {
			this._sketch.color = radio.value
		}
	}
}
