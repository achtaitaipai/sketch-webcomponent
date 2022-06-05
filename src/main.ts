import './style.scss'
import '@achtaitaipai/color-picker'

import Sketch from './scripts/Sketch/'

import ToolsBtn from './scripts/Interface/ToolsBtn'
import SizesBtn from './scripts/Interface/SizesBtn'
import ToolTips from './scripts/Interface/Helpers/Tooltips'
import ActionsBtns from './scripts/Interface/ActionsBtns'
import ColorsBtn from './scripts/Interface/ColorsBtn'
import LayersWindow from './scripts/Interface/Layers'
import MicroModal from 'micromodal'
import ContentTranslate from './scripts/Interface/ContentTranslate/ContentTranslate'

customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

ToolsBtn.init('#tools-js input[type=radio]', sketch)
SizesBtn.init('#sizes-js input[type=radio]', sketch)
ActionsBtns.init('.actions_btn', sketch)
ColorsBtn.init('#colorBtn-js', sketch)
LayersWindow.init('#layers-js', sketch)
ToolTips.init()
ContentTranslate.init()

const resizeForm = document.querySelector('#resizeForm-js')
const width = document.querySelector<HTMLInputElement>('#width-js')
const height = document.querySelector<HTMLInputElement>('#height-js')
resizeForm?.addEventListener('submit', e => {
	e.preventDefault()
	const w = width?.valueAsNumber
	const h = height?.valueAsNumber
	const align = document.querySelector<HTMLInputElement>('#align-js input:checked')?.value
	let va = 0
	let ha = 0
	if (align) [va, ha] = JSON.parse(align)
	if (w && h) sketch.resize(w, h, va, ha)
	MicroModal.close('resize-modal')
})

sketch.addEventListener('inactif-click', () => MicroModal.show('inactifClick-modal'))

sketch.camera.fitSketch()
