import GIF from 'gif.js'
import gifWorker from './gifWorker'

export default function exportGif(fileName: string, imgs: HTMLCanvasElement[], fps: number, scale: number = 1) {
	const gif = new GIF({
		workers: 4,
		workerScript: gifWorker,
		dither: 'FloydSteinberg',
	})

	gif.on('finished', function (blob) {
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.download = fileName + '.gif'
		link.href = url
		link.click()
	})

	createAnim(gif, imgs, fps, scale)

	gif.render()
}

function createAnim(gif: GIF, imgs: HTMLCanvasElement[], fps: number, scale: number = 1) {
	const delay = 1000 / fps
	const canvas = document.createElement('canvas') as HTMLCanvasElement
	canvas.style.setProperty('-webkit-optimize-contrast', 'pixelated')
	canvas.style.setProperty('-ms-interpolation-mode', 'nearest-neighbor')
	canvas.style.setProperty('image-rendering', 'crisp-edges')
	canvas.style.setProperty('image-rendering', 'pixelated')
	canvas.width = imgs[0].width * scale
	canvas.height = imgs[0].height * scale
	const ctx = canvas.getContext('2d')!
	ctx.imageSmoothingEnabled = false
	ctx.fillStyle = '#ffff'

	imgs.forEach(img => {
		ctx.fillRect(0, 0, canvas.width, canvas.height)
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
		gif.addFrame(canvas, {
			copy: true,
			delay,
		})
	})
}
