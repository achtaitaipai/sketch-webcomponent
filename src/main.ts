import './style.scss'
import '@achtaitaipai/color-picker'

import Sketch from './scripts/Sketch/'

import ToolsBtn from './scripts/Interface/ToolsBtn'
import SizesBtn from './scripts/Interface/SizesBtn'
import ToolTips from './scripts/Interface/Tooltips'
import ActionsBtns from './scripts/Interface/ActionsBtns'
import ColorsBtn from './scripts/Interface/ColorsBtn'
import LayersWindow from './scripts/Interface/LayersWindow'
import MicroModal from 'micromodal'
import ContentTranslate from './scripts/Interface/Translate'
import Sortable from 'sortablejs'
import ResizeForm from './scripts/Interface/ResizeForm'
import AnimWindow from './scripts/Interface/AnimWindow'

customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

ToolsBtn.init('#tools-js input[type=radio]', sketch)
SizesBtn.init('#sizes-js input[type=radio]', sketch)
ActionsBtns.init('.actions_btn', sketch)
ColorsBtn.init('#colorBtn-js', sketch)
LayersWindow.init('#layers-js', sketch)
AnimWindow.init('#anim-js', sketch, LayersWindow.updateLayers.bind(LayersWindow))
ResizeForm.init('#resizeForm-js', sketch)
ToolTips.init()
ContentTranslate.init()

Sortable.create(document.querySelector('#anim-js')!)
sketch.addEventListener('inactif-click', () => MicroModal.show('inactifClick-modal'))

sketch.onload = () => sketch.camera.fitSketch()
