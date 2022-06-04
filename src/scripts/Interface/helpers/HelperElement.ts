import { helpersDatas } from './datas'

export default class HelperElement {
	private _toHelp: Element | null = null
	private _element: HTMLElement
	private _style: CSSStyleDeclaration

	static init() {
		const queryString = window.location.search
		const urlParams = new URLSearchParams(queryString)
		const lang = urlParams.get('lang') === 'fr' ? 'fr' : 'en'

		const toolsData = helpersDatas.tools
		toolsData.forEach(data => {
			const el = document.querySelector(`[for=${data.for}]`)
			if (el) new HelperElement(el, 'right', data[lang].title)
		})

		const actionsData = helpersDatas.actions
		actionsData.forEach(data => {
			const el = document.querySelector(`#${data.id}`)
			if (el) new HelperElement(el, 'left', data[lang].title)
		})

		const colorsData = helpersDatas.colors
		const colorsBtn = document.getElementById('colorBtn-js')
		if (colorsBtn) new HelperElement(colorsBtn, 'right', colorsData[lang].title)

		const sizesData = helpersDatas.sizes
		const sizesBtn = document.querySelectorAll('.sizes_label')
		sizesBtn.forEach(el => {
			new HelperElement(el, 'right', sizesData[lang].title + ' ' + el.getAttribute('for') + 'px')
		})
	}

	constructor(el: Element, direction: 'right' | 'left', title: string, description?: string) {
		this._toHelp = el
		const { top, right, height, left } = this._toHelp.getBoundingClientRect()

		this._element = document.createElement('div')
		this._element.classList.add('helper')
		this._element.classList.add(direction === 'left' ? 'helper--left' : 'helper--right')
		//title
		const titleEl = document.createElement('h3')
		titleEl.textContent = title
		this._element.appendChild(titleEl)

		//description
		if (description) {
			const descriptionEl = document.createElement('p')
			descriptionEl.textContent = description
			this._element.appendChild(descriptionEl)
		}
		this._style = this._element.style
		this._style.position = 'absolute'
		this._style.zIndex = '2'
		this._style.display = 'none'
		this._style.left = direction === 'right' ? `${right}px` : `${left}px`
		this._style.top = `${top + height / 2}px`
		document.body.appendChild(this._element)

		this._toHelp.addEventListener('mouseenter', this._onMouseEnter.bind(this))
		this._toHelp.addEventListener('mouseleave', this._onMouseLeave.bind(this))
	}

	private _onMouseEnter() {
		this._style.display = 'block'
	}

	private _onMouseLeave() {
		this._style.display = 'none'
	}
}
