import Sketch from '../Sketch'

export default class FileSelector {
	private static _inputEl: HTMLInputElement
	private static _sketch: Sketch

	public static init(selector: string, sketch: Sketch) {
		this._sketch = sketch
		this._inputEl = document.querySelector<HTMLInputElement>(selector)!
		this._inputEl.addEventListener('change', this._loadFile.bind(this))
	}

	private static _loadFile() {
		const files = this._inputEl?.files
		if (FileReader && files && files.length) {
			const type = files[0].type
			const fr = new FileReader()
			if (/json/.test(type)) {
				fr.readAsText(files[0])
				fr.addEventListener('load', this._loadJson.bind(this))
			} else if (/png/.test(type)) {
				fr.readAsDataURL(files[0])
				fr.onload = _ => loadPng(fr.result as string)
			}
		}
		this._inputEl.value = ''
	}

	private static _loadJson(e: ProgressEvent<FileReader>) {
		const datas = e.target?.result
		this._sketch.loadJson(datas as string)
	}

	public static open() {
		this._inputEl.click()
	}
}

function loadPng(str: string) {
	const img = document.createElement('img')
	img.src = str
	console.log(img)
}
