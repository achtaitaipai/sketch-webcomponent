import { helpersDatas } from './helpersDatas'

export default class HelperElement {
	static init() {
		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)
		const lang = urlParams.get('lang') === 'fr' ? 'fr' : 'en'

		const elements = document.querySelectorAll('[helper]')
		elements.forEach(element => {
			const key = element.getAttribute('helper')
			if (key) {
				const txt = helpersDatas[key]?.[lang]
				element.setAttribute('helper-text', txt)
			}
		})
	}
}
