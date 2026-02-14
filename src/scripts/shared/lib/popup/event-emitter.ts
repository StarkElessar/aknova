export class EventEmitter {
	private _listeners: Map<string, Set<Function>>;

	constructor() {
		this._listeners = new Map();
	}

	on(event: string, callback: Function): void {
		if (!this._listeners.has(event)) {
			this._listeners.set(event, new Set());
		}
		this._listeners.get(event)?.add(callback);
	}

	off(event: string, callback: Function): void {
		const eventListeners = this._listeners.get(event);
		if (eventListeners) {
			eventListeners.delete(callback);
			if (eventListeners.size === 0) {
				this._listeners.delete(event);
			}
		}
	}

	emit(event: string, data?: any): void {
		const eventListeners = this._listeners.get(event);
		if (eventListeners) {
			eventListeners.forEach((callback) => {
				callback(data);
			});
		}
	}

	once(event: string, callback: Function): void {
		const onceWrapper = (data: any) => {
			callback(data);
			this.off(event, onceWrapper);
		};
		this.on(event, onceWrapper);
	}

	clear(): void {
		this._listeners.clear();
	}
}
