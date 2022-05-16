class Color {
	public rgba: number[] = [0, 0, 0, 255]
	public get hex(): string {
		return '#' + this.rgba.map(n => ('0' + n.toString(16)).slice(-2)).join('')
	}
}

class hexColor extends Color {
	constructor(color: string) {
		super()
		const col =
			color
				.replace('#', '')
				.match(/(..?)/g)
				?.map(n => parseInt(n, 16)) || []
		this.rgba = this.rgba.map((n, i) => col[i] || n)
	}
}

class rgbaColor extends Color {
	constructor(color: number[]) {
		super()
		this.rgba = color
	}
}

export default function createColor(col: string | number[]): Color {
	return typeof col === 'string' ? new hexColor(col) : new rgbaColor(col)
}
