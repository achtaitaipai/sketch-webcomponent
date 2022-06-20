import { InstantType } from '../../../History'

export default function exportJson(fileName: string, datas: InstantType) {
	const datasToSave = replaceCanvasByDataUrl(datas)
	downloadJson(fileName, JSON.stringify(datasToSave))
}

function replaceCanvasByDataUrl(datas: InstantType) {
	const width = datas.width
	const height = datas.height
	const frames = datas.frames.map(frame => {
		return frame.layers.map(layer => layer.drawing.toDataURL())
	})
	return { width, height, frames }
}

function downloadJson(fileName: string, datas: string) {
	const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(datas)
	const linkElement = document.createElement('a')
	linkElement.setAttribute('href', dataUri)
	linkElement.setAttribute('download', fileName)
	linkElement.click()
}
