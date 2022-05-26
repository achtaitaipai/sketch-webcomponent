import './style.scss'
import Sketch from './scripts/Sketch/Sketch'
import ToolsBtn from './scripts/Interface/ToolsBtn'
customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

ToolsBtn.init('#tools-js input[type=radio]', sketch)

document.addEventListener('load', _ => {
	sketch.camera.fitSketch()
})
