import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'
import Sketch from './scripts/Sketch'
customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

const clrs = document.querySelectorAll('.clr')
const sizes = document.querySelectorAll('.size')
const tools = document.querySelectorAll('.tool')
clrs.forEach(el => {
	const input = <HTMLInputElement>el.querySelector('input')
	const label = el.querySelector('label')
	label?.style.setProperty('background-color', input.value)
	input.addEventListener('click', _ => (sketch.color = input.value))
})

sizes.forEach(el => {
	const input = <HTMLInputElement>el.querySelector('input')
	const label = el.querySelector('label')
	label?.style.setProperty('width', Number(input.value) * 4 + 'px')
	label?.addEventListener('click', _ => (sketch.size = Number(input.value)))
})

tools.forEach(el => {
	const input = <HTMLInputElement | HTMLButtonElement>el.querySelector('input,button')
	input.addEventListener('click', _ => {
		switch (input.value) {
			case 'delete':
				sketch.clear()
				break
			case 'fitscreen':
				sketch.camera.fitSketch()
				break
			default:
				sketch.tool = input.value
		}
	})
})
document.addEventListener('load', _ => {
	sketch.camera.fitSketch()
	console.log('ok')
})

// sketch.fitSketch()
