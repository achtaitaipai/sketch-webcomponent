export default class Color {
	public rgba = [0, 0, 0, 255]
	constructor(col: [number, number, number] | [number, number, number, number] | string) {
		const vals =
			col instanceof Array
				? col
				: col
						.replace('#', '')
						.match(/(..?)/g)
						?.map(n => parseInt(n, 16)) || this.rgba
		console.log(vals, col)
		this.rgba = vals
		console.log(this.rgba)
	}

	get hex() {
		return '#' + this.rgba.map(n => ('0' + n.toString(16)).slice(-2)).join('')
	}
}
