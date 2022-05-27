import './style.scss'
import Sketch from './scripts/Sketch/Sketch'
import ToolsBtn from './scripts/Interface/ToolsBtn'
import ColorsBtn from './scripts/Interface/ColorsBtn'
import SizesBtn from './scripts/Interface/SizesBtn'
customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

ToolsBtn.init('#tools-js input[type=radio]', sketch)
ColorsBtn.init('#colors-js input[type=radio]', sketch)
SizesBtn.init('#sizes-js input[type=radio]', sketch)

document.addEventListener('load', _ => {
	sketch.camera.fitSketch()
})
