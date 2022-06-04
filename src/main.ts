import './style.scss'
import '@achtaitaipai/color-picker'

import Sketch from './scripts/Sketch/'

import ToolsBtn from './scripts/Interface/ToolsBtn'
import SizesBtn from './scripts/Interface/SizesBtn'
import HelperElement from './scripts/Interface/helpers/HelperElement'
import ActionsBtns from './scripts/Interface/ActionsBtns'
import ColorsBtn from './scripts/Interface/ColorsBtn'
import LayersWindow from './scripts/Interface/Layers'

customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

ToolsBtn.init('#tools-js input[type=radio]', sketch)
SizesBtn.init('#sizes-js input[type=radio]', sketch)
ActionsBtns.init('.actions_btn', sketch)
ColorsBtn.init('#colorBtn-js', sketch)
LayersWindow.init('#layers-js', sketch)
HelperElement.init()

sketch.camera.fitSketch()
