import { ColorPicker } from '@achtaitaipai/color-picker'
import Sketch from '../Sketch/Index'

export default class ColorsBtn {
	static init(selector: string, sketch: Sketch) {
		const colorBtn = document.querySelector<HTMLButtonElement>(selector)
		const picker = document.querySelector<ColorPicker>('color-picker')

		colorBtn?.addEventListener('click', _ => {
			picker?.open()
		})

		picker?.addEventListener('color-change', ((e: CustomEvent) => {
			sketch.color = e.detail
			if (colorBtn) colorBtn.style.backgroundColor = e.detail
		}) as EventListener)
	}
}
