import Sketch from '../Sketch/Sketch'

export default class ColorsBtn {
	private static _paletteColors = [
		'#000000',
		'#1D2B53',
		'#7E2553',
		'#008751',
		'#AB5236',
		'#5F574F',
		'#C2C3C7',
		'#FFF1E8',
		'#FF004D',
		'#FFA300',
		'#FFEC27',
		'#00E436',
		'#29ADFF',
		'#83769C',
		'#FF77A8',
		'#FFCCAA',
	]
	private static _sketch: Sketch | null = null
	static init(containerSelector: string, sketch: Sketch) {
		this._sketch = sketch
		const container = document.querySelector(containerSelector)!
		for (const color of this._paletteColors) {
			ColorsBtn._createEl(container, color)
		}
		container.querySelector<HTMLInputElement>('input[type=radio]')!.checked = true
	}
	private static _createEl(container: Element, color: string) {
		const radio = document.createElement('input')
		radio.type = 'radio'
		radio.name = 'colors'
		radio.classList.add('colors_radio')
		radio.id = color
		radio.value = color
		container.appendChild(radio)
		const label = document.createElement('label')
		label.setAttribute('for', color)
		label.classList.add('colors_label')
		label.style.setProperty('--clr', color)
		label.addEventListener('click', _ => this._handleClick(radio))
		//on double click, create and open htmlinput color
		label.addEventListener('dblclick', _ => {
			const inputColor = document.createElement('input')
			inputColor.type = 'color'
			inputColor.value = color
			inputColor.style.display = 'none'
			inputColor.click()
			inputColor.addEventListener('input', _ => {
				ColorsBtn._handleNewClr(inputColor, radio, label)
			})

			label.appendChild(inputColor)
		})
		container.appendChild(label)
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
