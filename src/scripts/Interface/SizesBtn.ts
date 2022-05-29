import Sketch from '../Sketch/Index'

export default class SizesBtn {
	static init(selector: string, sketch: Sketch) {
		const btns = document.querySelectorAll<HTMLInputElement>(selector)
		btns.forEach(btn => {
			btn.addEventListener('click', _ => {
				sketch.size = Number(btn.value)
			})
		})
	}
}
