import { PopupInstance } from './popup-instance';
import type { IPopupConfig, ITriggerConfig, IPopupEventData } from './types';
import {
	POPUP_CLASS,
	DATA_POPUP_ID,
	EVENT_OPEN,
	EVENT_CLOSE,
} from './constants';
import { generateId, getDataAttributes } from './utils';

export class PopupManager {
	private static instance: PopupManager | null = null;
	private popups: Map<string, PopupInstance>;
	private triggers: Map<HTMLElement, ITriggerConfig>;
	private openedStack: PopupInstance[];
	private isInitialized: boolean;

	private constructor() {
		this.popups = new Map();
		this.triggers = new Map();
		this.openedStack = [];
		this.isInitialized = false;
	}

	public static getInstance(): PopupManager {
		if (!PopupManager.instance) {
			PopupManager.instance = new PopupManager();
		}
		return PopupManager.instance;
	}

	public static init(): void {
		const manager = PopupManager.getInstance();
		if (manager.isInitialized) return;

		manager.scanDOM();
		manager.isInitialized = true;
	}

	public static register(config: IPopupConfig): PopupInstance {
		const manager = PopupManager.getInstance();
		const popup = new PopupInstance(config);

		manager.popups.set(config.id, popup);

		popup.on(EVENT_OPEN, () => manager.handlePopupOpen(popup));
		popup.on(EVENT_CLOSE, () => manager.handlePopupClose(popup));

		return popup;
	}

	public static registerTrigger(config: ITriggerConfig): void {
		const manager = PopupManager.getInstance();
		manager.triggers.set(config.element, config);

		config.element.addEventListener('click', (event) => {
			event.preventDefault();
			manager.handleTriggerClick(config);
		});
	}

	public static unregister(popupId: string): void {
		const manager = PopupManager.getInstance();
		const popup = manager.popups.get(popupId);

		if (popup) {
			popup.destroy();
			manager.popups.delete(popupId);
		}
	}

	public static unregisterTrigger(element: HTMLElement): void {
		const manager = PopupManager.getInstance();
		manager.triggers.delete(element);
	}

	public static open(popupId: string, trigger?: HTMLElement): void {
		const manager = PopupManager.getInstance();
		const popup = manager.popups.get(popupId);

		if (popup) {
			popup.open(trigger);
		}
	}

	public static close(popupId: string): void {
		const manager = PopupManager.getInstance();
		const popup = manager.popups.get(popupId);

		if (popup) {
			popup.close();
		}
	}

	public static closeLast(): void {
		const manager = PopupManager.getInstance();
		const lastPopup = manager.openedStack[manager.openedStack.length - 1];

		if (lastPopup) {
			lastPopup.close();
		}
	}

	public static closeAll(): void {
		const manager = PopupManager.getInstance();
		[...manager.openedStack].forEach((popup) => popup.close());
	}

	public static get(popupId: string): PopupInstance | undefined {
		const manager = PopupManager.getInstance();
		return manager.popups.get(popupId);
	}

	public static getAll(): PopupInstance[] {
		const manager = PopupManager.getInstance();
		return Array.from(manager.popups.values());
	}

	public static getOpened(): PopupInstance[] {
		const manager = PopupManager.getInstance();
		return [...manager.openedStack];
	}

	public static isOpened(popupId: string): boolean {
		const manager = PopupManager.getInstance();
		const popup = manager.popups.get(popupId);
		return popup ? popup.isOpen() : false;
	}

	private scanDOM(): void {
		this.autoRegisterPopups();
		this.autoRegisterTriggers();
	}

	private findPopups(): HTMLElement[] {
		return Array.from(document.querySelectorAll(`.${POPUP_CLASS}`));
	}

	private findTriggers(): HTMLElement[] {
		return Array.from(document.querySelectorAll(`[${DATA_POPUP_ID}]`));
	}

	private autoRegisterPopups(): void {
		const popupElements = this.findPopups();

		popupElements.forEach((element) => {
			const id = element.id || generateId();

			if (!element.id) {
				element.id = id;
			}

			if (!this.popups.has(id)) {
				PopupManager.register({
					id,
					element,
				});
			}
		});
	}

	private autoRegisterTriggers(): void {
		const triggerElements = this.findTriggers();

		triggerElements.forEach((element) => {
			const popupId = element.getAttribute(DATA_POPUP_ID);

			if (popupId && !this.triggers.has(element)) {
				PopupManager.registerTrigger({
					element,
					popupId,
				});
			}
		});
	}

	private handleTriggerClick(config: ITriggerConfig): void {
		const popup = this.popups.get(config.popupId);

		if (!popup) return;

		const triggerData = getDataAttributes(config.element, 'popup');
		const eventData: IPopupEventData = {
			popup,
			trigger: config.element,
			triggerData,
		};

		if (config.onBeforeOpen) {
			const result = config.onBeforeOpen(eventData);
			if (result === false) return;
		}

		popup.open(config.element);

		if (config.onOpen) {
			popup.once(EVENT_OPEN, () => {
				config.onOpen!(eventData);
			});
		}
	}

	private handlePopupOpen(popup: PopupInstance): void {
		this.addToStack(popup);
	}

	private handlePopupClose(popup: PopupInstance): void {
		this.removeFromStack(popup);
	}

	private addToStack(popup: PopupInstance): void {
		if (!this.openedStack.includes(popup)) {
			this.openedStack.push(popup);
		}
	}

	private removeFromStack(popup: PopupInstance): void {
		const index = this.openedStack.indexOf(popup);
		if (index > -1) {
			this.openedStack.splice(index, 1);
		}
	}
}
