import Sketch from '../Sketch/Index'

export default class SizesBtn {
	static init(selector: string, sketch: Sketch) {
		const container = document.querySelector<HTMLElement>(selector)
		const input = container?.querySelector('input')
		const label = container?.querySelector('label')

		input?.addEventListener('input', _ => {
			const value = input?.valueAsNumber
			if (label) label.innerHTML = `size : <i>${value} px</i>`
			sketch.size = value
		})
	}
}
