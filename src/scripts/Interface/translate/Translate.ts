import { translateDatas } from './translateDatas'

export default class Translate {
	static init() {
		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)
		const lang = urlParams.get('lang') === 'fr' ? 'fr' : 'en'
		if (lang !== 'en') {
			const toTranslate = document.querySelectorAll('[translate]')
			toTranslate.forEach(element => {
				console.log(element)
				const key = element.getAttribute('translate')
				if (key) {
					const data = translateDatas[key]
					console.log(data)
					if (data) element.textContent = data[lang]
				}
			})
		}
	}
}
