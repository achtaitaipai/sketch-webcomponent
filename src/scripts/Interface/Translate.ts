import translate from './utils/translation'

export default class ContentTranslate {
	static init() {
		const toTranslate = document.querySelectorAll('[translate]')
		toTranslate.forEach(element => {
			const key = element.getAttribute('translate')
			if (key) {
				const data = translate(key)
				if (data) element.textContent = data
			}
		})
	}
}
