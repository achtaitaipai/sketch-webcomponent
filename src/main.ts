import './style.css'
import Sketch from './scripts/Sketch'
customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')
const modeBtn = <NodeListOf<HTMLButtonElement>>document.querySelectorAll('.controls button')
const colorInput = <HTMLInputElement>document.getElementById('color')
const fullScreenBtn = <HTMLButtonElement>document.getElementById('fullScreen-js')
const testBtn = <HTMLButtonElement>document.getElementById('test')

modeBtn.forEach(btn => {
	btn.addEventListener('click', e => {
		e.preventDefault()
		sketch.mode = btn.id
	})
})

colorInput.addEventListener('change', e => {
	const target = e.target as HTMLInputElement
	sketch.color = target?.value
})

fullScreenBtn.addEventListener('click', e => {
	e.preventDefault()
	sketch.requestFullscreen()
})

// sketch.fitSketch()
