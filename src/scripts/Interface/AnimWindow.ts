import Sortable from 'sortablejs'
import Sketch from '../Sketch'
import deleteImgUrl from '../../../assets/icons/actions/effacer.png'
import MicroModal from 'micromodal'

export default class AnimWindow {
	private static _sketch: Sketch
	private static _element: HTMLElement
	private static _frameList: HTMLUListElement
	private static _updateLayers: () => void

	static init(selector: string, sketch: Sketch, updateLayers: () => void) {
		this._element = document.querySelector(selector)!
		this._frameList = this._element.querySelector('#frameList-js')!
		this._sketch = sketch
		this._updateLayers = updateLayers
		const newFrameBtn = this._element.querySelector('#newFrame-js')
		newFrameBtn?.addEventListener('click', this._addFrame.bind(this))
		Sortable.create(this._frameList, {
			onStart: this._onSortStart.bind(this),
			onSort: this._onSort.bind(this),
		})
		this._addFrame()

		this._sketch.addEventListener('update', this._onSketchChange.bind(this))
	}
	private static _handleClick(e: MouseEvent) {
		if (this._sketch.playing) {
			MicroModal.show('inactifClick-modal')
			return
		}
		const target = e.target as HTMLElement
		const frame = target?.closest('.anim_frame')!
		const btn = target?.closest('.anim_delete')
		//select a layer
		if (btn === null) {
			this._selectFrame(frame)
			this._updateLayers()
		} else {
			this._removeFrame(frame)
			this._updateLayers()
		}
	}

	private static _onSortStart(e: Sortable.SortableEvent) {
		if (this._sketch.playing) {
			MicroModal.show('inactifClick-modal')
			e.preventDefault
		}
	}

	private static _onSort(e: Sortable.SortableEvent) {
		const frames = Array.from(this._frameList.querySelectorAll('.anim_frame:not(.anim_frame-new)'))
		const ids = frames.map(el => Number(el.getAttribute('data-id')))
		const frame = e.item
		this._sketch.frameManager.sortFrames(ids)
		if (this._sketch.playing) {
			MicroModal.show('inactifClick-modal')
			return
		}
		this._selectFrame(frame)
		this._updateLayers()
	}

	private static _addFrame() {
		if (this._sketch.playing) {
			MicroModal.show('inactifClick-modal')
			return
		}
		const frame = document.createElement('li')
		frame.classList.add('anim_frame')
		const id = this.newId()
		frame.setAttribute('data-id', id.toString())
		const button = document.createElement('button')
		button.classList.add('anim_delete')
		button.setAttribute('tooltip-text', 'remove frame')
		button.setAttribute('tooltip-right', 'true')
		const img = document.createElement('img')
		img.src = deleteImgUrl
		img.setAttribute('alt', 'remove frame')
		button.appendChild(img)
		frame.appendChild(button)
		this._frameList.appendChild(frame)
		this._frameList.scrollTo(this._frameList.scrollWidth, 0)
		frame.addEventListener('click', this._handleClick.bind(this))
		this._sketch.frameManager.newFrame(id)
		this._selectFrame(frame)
		this._updateLayers()
	}

	private static _removeFrame(frame: Element) {
		if (this._sketch.playing) {
			MicroModal.show('inactifClick-modal')
			return
		}
		const frames = this._frameList.querySelectorAll('.anim_frame')
		if (frames?.length > 2) {
			const selected = frame.classList.contains('selected')
			if (selected) {
				const childrens = Array.from(this._frameList.querySelectorAll('.anim_frame:not(.anim_frame-new)'))
				// const index = Array.prototype.indexOf.call(this._frameList.children, frame)
				const index = childrens.indexOf(frame)
				if (index >= 1) {
					const toSelect = childrens[index - 1]
					console.log(index, toSelect)
					this._selectFrame(toSelect)
				} else {
					console.log(index)
					const toSelect = childrens[1]
					this._selectFrame(toSelect)
				}
			}
			const id = Number(frame.getAttribute('data-id'))
			this._sketch.frameManager.removeFrame(id)
			frame.remove()
		}
	}
	private static _selectFrame(frame: Element) {
		const selected = this._frameList.querySelector('.selected')
		selected?.classList.remove('selected')
		frame.classList.add('selected')
		const id = Number(frame.getAttribute('data-id'))
		this._sketch.frameManager.selectFrame(id)
		this._sketch.updatePreview()
	}
	private static newId() {
		const items = Array.from(this._frameList.querySelectorAll('.anim_frame') || [])
		const maxId = Math.max(...items.map(item => Number(item.getAttribute('data-id'))))
		return maxId > 0 ? maxId + 1 : 1
	}

	private static _onSketchChange() {
		const items = Array.from(this._frameList.querySelectorAll<HTMLElement>('.anim_frame:not(.anim_frame-new)'))
		items.forEach(itm => {
			const id = Number(itm.getAttribute('data-id'))
			const frame = this._sketch.frameManager.frames.find(f => f.id === id)

			itm.style.backgroundImage = `url(${frame!.preview.toDataURL()})`
		})
	}
}
