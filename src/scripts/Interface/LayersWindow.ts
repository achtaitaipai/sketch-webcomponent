import Sortable, { SortableEvent } from 'sortablejs'
import Sketch from '../Sketch'

export default class LayersWindow {
	private static _sketch: Sketch
	private static _window: HTMLDivElement | null
	private static _layers: HTMLUListElement | null
	private static _sortable: Sortable | null = null

	static init(selector: string, sketch: Sketch) {
		this._window = document.querySelector(selector)
		this._sketch = sketch
		const newBtn = this._window?.querySelector('#newLayer-js')
		const deleteBtn = this._window?.querySelector('#deleteLayer-js')

		this._layers = this._window?.querySelector<HTMLUListElement>('ul') || null
		if (this._layers) {
			this._sortable = Sortable.create(this._layers, {
				animation: 100,
				dataIdAttr: 'data-id',
				onEnd: this._moveLayer.bind(this),
			})
		}
		this._layers?.addEventListener('click', this._layerClick.bind(this))
		newBtn?.addEventListener('click', this._addLayer.bind(this))
		deleteBtn?.addEventListener('click', this._removeLayer.bind(this))

		this._addLayer()
	}

	private static _addLayer() {
		const selected = this._layers?.querySelector('.selected')

		const newLayer = document.createElement('li')
		const id = this.newId()
		newLayer.classList.add('layers_item')
		newLayer.classList.add('selected')
		newLayer.setAttribute('data-id', id.toString())
		newLayer.textContent = 'Layer ' + id
		if (selected) this._layers?.insertBefore(newLayer, selected)
		else this._layers?.appendChild(newLayer)
		selected?.classList.remove('selected')

		const checkbox = document.createElement('input')
		checkbox.setAttribute('type', 'checkbox')
		checkbox.checked = true
		checkbox.setAttribute('name', 'visible')
		checkbox.classList.add('layers_checkbox')
		checkbox.addEventListener('change', this._checkBoxChange.bind(this))
		newLayer.insertAdjacentElement('afterbegin', checkbox)

		const layers = Array.from(this._layers?.querySelectorAll('li') || [])
		const pos = layers.indexOf(newLayer)

		this._sketch.layers.newLayer(id, pos)
		this._updateSelectedLayer()
		this._sketch.updatePreview()
	}

	private static _removeLayer() {
		const items = this._layers?.querySelectorAll('li')
		if (!items || items.length <= 1) return
		const selected = this._layers?.querySelector('.selected')
		const toSelect = selected?.nextElementSibling
		selected?.remove()
		if (toSelect) toSelect?.classList.add('selected')
		else this._layers?.lastElementChild?.classList.add('selected')

		const id = Number(selected?.getAttribute('data-id'))
		if (id) {
			this._sketch.layers.removeLayer(id)
		}
		this._updateSelectedLayer()
		this._sketch.updatePreview()
	}

	/**
	 * Update selected layer side layerManager
	 */

	private static _updateSelectedLayer() {
		const selected = this._layers?.querySelector('.selected')
		if (selected) {
			const id = Number(selected?.getAttribute('data-id'))
			if (id) {
				this._sketch.layers.selectLayer(id)
			}
		}
	}

	private static _moveLayer(e: SortableEvent) {
		this._sketch.layers.sortLayer(this._sortable?.toArray().map(Number) || [])
		this._sketch.updatePreview()
		const item = e.item
		if (item) {
			this._window?.querySelector('.selected')?.classList.remove('selected')
			item.classList.add('selected')
			this._updateSelectedLayer()
		}
	}

	private static _layerClick(e: MouseEvent) {
		const target = e.target as HTMLElement
		if (target.nodeName === 'LI') {
			this._window?.querySelector('.selected')?.classList.remove('selected')
			target.classList.add('selected')
		}
		this._updateSelectedLayer()
	}

	private static _checkBoxChange(e: Event) {
		const target = e.target as HTMLInputElement
		const li = target.closest('li')
		const id = Number(li?.getAttribute('data-id'))
		const visible = target.checked
		if (id) this._sketch.layers.setLayerVisible(id, visible)
	}

	private static newId() {
		const items = Array.from(this._layers?.querySelectorAll('li') || [])
		const maxId = Math.max(...items.map(item => Number(item.getAttribute('data-id'))))
		return maxId > 0 ? maxId + 1 : 1
	}
}
