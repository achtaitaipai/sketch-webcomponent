import translate from './utils/translation'

export default class ToolTips {
	static init() {
		const elements = document.querySelectorAll('[tooltip-text]')
		elements.forEach(element => {
			const key = element.getAttribute('tooltip-text')
			if (key) {
				const data = translate(key)
				data ? element.setAttribute('tooltip-text', data) : null
			}
		})
	}
}
