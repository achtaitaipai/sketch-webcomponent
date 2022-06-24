export default class FileSelector {
	private static _inputEl: HTMLInputElement
	public static init(selector: string) {
		this._inputEl = document.querySelector<HTMLInputElement>(selector)!
		this._inputEl.addEventListener('change', e => {
			const target = e.target as HTMLInputElement
			const files = target?.files
			if (FileReader && files && files.length) {
				const type = files[0].type
				const fr = new FileReader()
				if (/json/.test(type)) {
					fr.readAsText(files[0])
					fr.onload = _ => loadJson(fr.result as string)
				} else if (/png/.test(type)) {
					fr.readAsDataURL(files[0])
					fr.onload = _ => loadPng(fr.result as string)
				}
			}
		})
	}

	public static open() {
		this._inputEl.click()
	}
}

function loadJson(str: string) {
	console.log(JSON.stringify(str))
}

function loadPng(str: string) {
	const img = document.createElement('img')
	img.src = str
	console.log(img)
}
