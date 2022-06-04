import Sketch from '.'
import Drawing from './Images/Drawing'

type layerType = {
	drawing: Drawing
	id: number
}

export default class LayersManager {
	public layers: layerType[]
	private _layerIndex: number = 1
	private _sketch: Sketch

	constructor(sketch: Sketch) {
		this.layers = [{ id: 1, drawing: new Drawing() }]
		this._sketch = sketch
	}

	public newLayer(id: number, pos: number) {
		const newLayer = { id: id, drawing: new Drawing(this._sketch.width, this._sketch.height) }
		this.layers.splice(pos, 0, newLayer)
	}

	public selectLayer(index: number) {
		this._layerIndex = index
	}

	public removeLayer(id: number) {
		this.layers = this.layers.filter(layer => layer.id !== id)
	}

	public sortLayer(list: number[]) {
		const layers: layerType[] = []
		list.forEach(id => {
			const layer = this.layers.find(layer => layer.id === id)
			if (layer) layers.push(layer)
		})
		this.layers = layers
	}

	public currentLayer() {
		return this.layers.find(layer => layer.id === this._layerIndex)?.drawing
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
