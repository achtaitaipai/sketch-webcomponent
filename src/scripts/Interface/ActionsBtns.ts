import MicroModal from 'micromodal'
import Sketch from '../Sketch'
import AnimWindow from './AnimWindow'
import DownloadForm from './DownloadForm'
import FileSelector from './FileSelector'
import LayersWindow from './LayersWindow'
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
					case 'undo':
						sketch.undo()
						AnimWindow.updateFrames()
						LayersWindow.updateLayers()
						break
					case 'redo':
						sketch.redo()
						AnimWindow.updateFrames()
						LayersWindow.updateLayers()
						break
					case 'download':
						MicroModal.show('download-modal')
						DownloadForm.updateContent()
						break
					case 'open':
						FileSelector.open()
						break
				}
			})
		})
	}
}
