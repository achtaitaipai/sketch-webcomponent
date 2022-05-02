import './style.css'
import Sketch from './scripts/Sketch'
customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')
const modeBtn = <NodeListOf<HTMLButtonElement>>document.querySelectorAll('.controls button')
const colorInput = <HTMLInputElement>document.getElementById('color')

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

sketch.adaptToWorkPlace()
// sketch.zoom = 20
