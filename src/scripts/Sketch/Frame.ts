import Sketch from '.'
import Drawing from './Images/Drawing'

interface iLayer {
	drawing: Drawing
	id: number
}

export default class Frame {
	public layers: iLayer[] = []
	public layerIndex: number = 1
	private _sketch: Sketch
	public id: number

	constructor(sketch: Sketch, id: number, frame?: Frame) {
		this._sketch = sketch
		this.id = id
		if (!frame) this.layers = [{ id: 1, drawing: new Drawing() }]
		else {
			frame.layers.forEach(itm => {
				console.log(itm)
				const layer = new Drawing(this._sketch.width, this._sketch.height)
				layer.drawImg(itm.drawing.canvas)
				this.layers.push({ id: itm.id, drawing: layer })
			})
		}
	}

	get preview() {
		const canvas = document.createElement('canvas')
		canvas.width = this._sketch.width
		canvas.height = this._sketch.height
		const ctx = canvas.getContext('2d')!

		for (let i = this.layers.length - 1; i >= 0; i--) {
			const layer = this.layers[i]
			if (layer.drawing.actif) ctx.drawImage(layer.drawing.canvas, 0, 0)
		}
		return canvas
	}

	get actif() {
		return this.layers.find(layer => layer.id === this.layerIndex)?.drawing.actif ?? false
	}

	public newLayer(id: number, pos: number) {
		const newLayer = { id: id, drawing: new Drawing(this._sketch.width, this._sketch.height) }
		this.layers.splice(pos, 0, newLayer)
	}

	public selectLayer(index: number) {
		this.layerIndex = index
	}

	public removeLayer(id: number) {
		this.layers = this.layers.filter(layer => layer.id !== id)
		this._sketch.dispatchUpdate()
		this._sketch.updatePreview()
	}

	public sortLayers(list: number[]) {
		const layers: iLayer[] = []
		list.forEach(id => {
			const layer = this.layers.find(layer => layer.id === id)
			if (layer) layers.push(layer)
		})
		this.layers = layers
		this._sketch.dispatchUpdate()
	}

	public setLayerVisible(id: number, visible: boolean) {
		const layer = this.layers.find(layer => layer.id === id)
		if (layer) layer.drawing.actif = visible
		this._sketch.updatePreview()
		this._sketch.dispatchUpdate()
	}

	public mergeLayer(id: number, id2: number) {
		const layer1 = this.layers.find(layer => layer.id === id)
		const layer2 = this.layers.find(layer => layer.id === id2)
		if (layer1 && layer2) {
			layer1?.drawing.drawImg(layer2?.drawing.canvas)
			this.removeLayer(id2)
		}
	}

	public currentLayer() {
		return this.layers.find(layer => layer.id === this.layerIndex)?.drawing
	}

	public clear() {
		this.layers.forEach(layer => layer.drawing.clear())
	}

	public resize(width: number, height: number, hAlign: number = -1, vAlign: number = -1) {
		this.layers.forEach(layer => {
			layer.drawing.resize(width, height, hAlign, vAlign)
		})
	}

	public crop(x: number, y: number, width: number, height: number) {
		this.layers.forEach(layer => layer.drawing.crop(x, y, width, height))
	}
}
