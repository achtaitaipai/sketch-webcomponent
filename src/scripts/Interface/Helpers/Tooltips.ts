import translate from '../utils/translateDatas'

export default class ToolTips {
	static init() {
		const elements = document.querySelectorAll('[helper-text]')
		elements.forEach(element => {
			const key = element.getAttribute('helper-text')
			if (key) {
				const data = translate(key)
				data ? element.setAttribute('helper-text', data) : null
			}
		})
	}
}
