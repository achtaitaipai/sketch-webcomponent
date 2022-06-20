export default function (fileName: string, imgs: HTMLCanvasElement[], scale: number, columns: number, rows: number) {
	const width = imgs[0].width * scale
	const height = imgs[0].height * scale
	const canvas = createCanvas(width, height, columns, rows)
	const ctx = canvas.getContext('2d')!
	ctx.imageSmoothingEnabled = false

	drawImgs(imgs, columns, ctx, width, height)
	download(fileName, canvas)
}

function createCanvas(width: number, height: number, columns: number, rows: number) {
	const canvas = document.createElement('canvas') as HTMLCanvasElement
	canvas.style.setProperty('-webkit-optimize-contrast', 'pixelated')
	canvas.style.setProperty('-ms-interpolation-mode', 'nearest-neighbor')
	canvas.style.setProperty('image-rendering', 'crisp-edges')
	canvas.style.setProperty('image-rendering', 'pixelated')
	canvas.width = width * columns
	canvas.height = height * rows
	return canvas
}

function drawImgs(imgs: HTMLCanvasElement[], columns: number, ctx: CanvasRenderingContext2D, width: number, height: number) {
	for (let i = 0; i < imgs.length; i++) {
		const y = Math.floor(i / columns)
		const x = y === 0 ? i : i % columns
		ctx.drawImage(imgs[i], x * width, y * height, width, height)
	}
}

function download(fileName: string, canvas: HTMLCanvasElement) {
	const link = document.createElement('a')
	link.download = fileName + '.png'
	link.href = canvas.toDataURL('image/png')
	link.click()
}
