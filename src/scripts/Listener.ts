export default class Listener<T> {
	private _observers: { id: number; callback: Function }[] = []

	private _newId = (function* () {
		let i = 0
		while (true) {
			yield i
			i++
		}
	})()

	public subscribe(callback: Function) {
		const id = this._newId.next().value
		this._observers.push({ id, callback })
		return id
	}

	public unsubscribe(id: number) {
		this._observers = this._observers.filter(el => el.id !== id)
	}

	public notify(event: T) {
		this._observers.forEach(l => l.callback(event))
	}
}
