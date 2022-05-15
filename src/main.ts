import '@fortawesome/fontawesome-free/css/all.css'
import './style.css'
import Sketch from './scripts/Sketch'
customElements.define('sketch-app', Sketch)

const sketch = <Sketch>document.querySelector('sketch-app')

const clrs = document.querySelectorAll('.clr')
const sizes = document.querySelectorAll('.size')
const tools = document.querySelectorAll('.tool')
const resizeDialog = <any>document.getElementById('resizeModal-js')!
const resizeCancel = document.getElementById('cancelResize-js')!
const resizeForm = <HTMLFormElement>document.getElementById('resizeForm-js')!
const width = <HTMLInputElement>resizeForm.querySelector('#resize-width')
const height = <HTMLInputElement>resizeForm.querySelector('#resize-height')
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
			case 'resize':
				resizeDialog.showModal()
				width.value = sketch.width.toString()
				height.value = sketch.height.toString()
				break
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
resizeCancel.addEventListener('click', _ => resizeDialog.close())
resizeForm.addEventListener('submit', e => {
	e.preventDefault()
	const vAlign = <HTMLSelectElement>resizeForm.querySelector('#vAlign-js')
	const hAlign = <HTMLSelectElement>resizeForm.querySelector('#hAlign-js')
	sketch.resize(Number(width.value), Number(height.value), Number(hAlign.value), Number(vAlign.value))
	resizeDialog.close()
})
document.addEventListener('load', _ => {
	sketch.camera.fitSketch()
	console.log('ok')
})

// sketch.fitSketch()
