import Sketch from '../..'
import { exportType } from '../export/json/exportJson'

export default function loadJson(str: string, sketch: Sketch) {
	const datas: exportType = JSON.parse(str)
	sketch.resize(datas.width, datas.height, 0, 0)
	sketch.animation.frames = []
	const promises: Promise<HTMLImageElement>[] = []
	for (let i = 0; i < datas.frames.length; i++) {
		const frame = sketch.animation.newFrame(i + 1)
		frame.layers = []
		const layers = datas.frames[i]
		layers.forEach((l, i) => {
			const layer = frame.newLayer(layers.length - i, i)
			const promise = new Promise<HTMLImageElement>(resolve => {
				const img = new Image()
				img.onload = () => {
					layer.drawing.drawImg(img)
					resolve(img)
				}
				img.src = l
			})
			promises.push(promise)
		})
		frame.selectLayer(1)
	}
	Promise.all(promises).then(() => {
		sketch.dispatchLoadFile()
		sketch.updatePreview()
		sketch.historyPush()
	})
}
