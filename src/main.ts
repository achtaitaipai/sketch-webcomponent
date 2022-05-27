import './style.scss'
import Sketch from './scripts/Sketch/Sketch'
import ToolsBtn from './scripts/Interface/ToolsBtn'
import ColorsBtn from './scripts/Interface/ColorsBtn'
customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

ToolsBtn.init('#tools-js input[type=radio]', sketch)
ColorsBtn.init('#colors-js', sketch)

document.addEventListener('load', _ => {
	sketch.camera.fitSketch()
})
