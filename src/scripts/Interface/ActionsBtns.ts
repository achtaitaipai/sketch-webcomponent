import MicroModal from 'micromodal'
import Sketch from '../Sketch'
import ResizeForm from './ResizeForm'

export default class ActionsBtns {
	static init(selector: string, sketch: Sketch) {
		const btns = document.querySelectorAll(selector)
		btns.forEach(btn => {
			btn.addEventListener('click', _ => {
				const id = btn.id
				switch (id) {
					case 'fit':
						sketch.camera.fitSketch()
						break
					case 'clear':
						sketch.clear()
						break
					case 'resize':
						MicroModal.show('resize-modal')
						ResizeForm.update()
						break
				}
			})
		})
	}
}
