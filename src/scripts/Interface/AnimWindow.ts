import Sortable from 'sortablejs'
import Sketch from '../Sketch'
import deleteImgUrl from '../../../assets/icons/actions/effacer.png'

export default class AnimWindow {
	private static _sketch: Sketch
	private static _element: HTMLElement
	private static _frameList: HTMLUListElement

	static init(selector: string, sketch: Sketch) {
		this._element = document.querySelector(selector)!
		this._frameList = this._element.querySelector('#frameList-js')!
		this._sketch = sketch

		const newFrameBtn = this._element.querySelector('#newFrame-js')
		newFrameBtn?.addEventListener('click', this._addFrame.bind(this))
		Sortable.create(this._frameList, {
			onSort: this._onSort.bind(this),
		})
		this._addFrame()
	}
	private static _handleClick(e: MouseEvent) {
		const target = e.target as HTMLElement
		const frame = target?.closest('.anim_frame')!
		const btn = target?.closest('.anim_delete')
		if (btn === null) this._selectFrame(frame)
		else {
			this._removeFrame(frame)
		}
	}
	private static _onSort() {
		const frames = Array.from(this._frameList.querySelectorAll('.anim_frame:not(.anim_frame-btn)'))
		const ids = frames.map(el => Number(el.getAttribute('data-id')))
		console.log(ids)
	}

	private static _addFrame() {
		const frame = document.createElement('li')
		frame.classList.add('anim_frame')
		frame.setAttribute('data-id', this.newId().toString())
		const button = document.createElement('button')
		button.classList.add('anim_delete')
		button.setAttribute('tooltip-text', 'remove frame')
		button.setAttribute('tooltip-right', 'true')
		// button.addEventListener('click', this._removeFrame.bind(this))
		const img = document.createElement('img')
		img.src = deleteImgUrl
		img.setAttribute('alt', 'remove frame')
		button.appendChild(img)
		frame.appendChild(button)
		this._frameList.appendChild(frame)
		this._frameList.scrollTo(this._frameList.scrollWidth, 0)
		this._selectFrame(frame)
		frame.addEventListener('click', this._handleClick.bind(this))
	}
	private static _removeFrame(frame: Element) {
		const frames = this._frameList.querySelectorAll('.anim_frame')
		if (frames?.length > 2) {
			const selected = frame.classList.contains('selected')
			if (selected) {
				const index = Array.prototype.indexOf.call(this._frameList.children, frame)
				if (index > 1) {
					const toSelect = this._frameList.children[index - 1]
					this._selectFrame(toSelect)
				} else {
					const toSelect = this._frameList.children[index + 1]
					this._selectFrame(toSelect)
				}
			}

			frame.remove()
		}
	}
	private static _selectFrame(frame: Element) {
		const selected = this._frameList.querySelector('.selected')
		selected?.classList.remove('selected')
		frame.classList.add('selected')
	}
	private static newId() {
		const items = Array.from(this._frameList.querySelectorAll('.anim_frame') || [])
		const maxId = Math.max(...items.map(item => Number(item.getAttribute('data-id'))))
		return maxId > 0 ? maxId + 1 : 1
	}
}

// on sort
