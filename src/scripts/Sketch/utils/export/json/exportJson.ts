import { InstantType } from '../../../History'

export type exportType = {
	frames: string[][]
	width: number
	height: number
}

export default function exportJson(fileName: string, datas: InstantType) {
	const datasToSave = replaceCanvasByDataUrl(datas)
	downloadJson(fileName, JSON.stringify(datasToSave))
}

function replaceCanvasByDataUrl(datas: InstantType): exportType {
	const width = datas.width
	const height = datas.height

	const frames = datas.frames.map(frame => {
		const layers = frame.layers.map(l => l.drawing.toDataURL())
		return layers
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
