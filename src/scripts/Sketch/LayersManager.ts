import Sketch from '.'
import Drawing from './Images/Drawing'

interface iLayer {
	drawing: Drawing
	id: number
}

export default class LayersManager {
	public layers: iLayer[]
	public layerIndex: number = 1
	private _sketch: Sketch

	constructor(sketch: Sketch) {
		this.layers = [{ id: 1, drawing: new Drawing() }]
		this._sketch = sketch
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
	}

	public sortLayers(list: number[]) {
		const layers: iLayer[] = []
		list.forEach(id => {
			const layer = this.layers.find(layer => layer.id === id)
			if (layer) layers.push(layer)
		})
		this.layers = layers
	}

	public setLayerVisible(id: number, visible: boolean) {
		const layer = this.layers.find(layer => layer.id === id)
		if (layer) layer.drawing.actif = visible
		this._sketch.updatePreview()
	}

	public currentDrawing() {
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
