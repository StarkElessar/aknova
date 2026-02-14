export class EventEmitter {
	private listeners: Map<string, Set<Function>>;

	constructor() {
		this.listeners = new Map();
	}

	on(event: string, callback: Function): void {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, new Set());
		}
		this.listeners.get(event)!.add(callback);
	}

	off(event: string, callback: Function): void {
		const eventListeners = this.listeners.get(event);
		if (eventListeners) {
			eventListeners.delete(callback);
			if (eventListeners.size === 0) {
				this.listeners.delete(event);
			}
		}
	}

	emit(event: string, data?: any): void {
		const eventListeners = this.listeners.get(event);
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
		this.listeners.clear();
	}
}
