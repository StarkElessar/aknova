import {
	DATA_POPUP_ID,
	EVENT_CLOSE,
	EVENT_OPEN,
	POPUP_CLASS,
} from './constants';
import { PopupInstance } from './popup-instance';
import { generateId, getDataAttributes } from './utils';

import type { IPopupConfig, IPopupEventData,ITriggerConfig } from './types';

export class PopupManager {
	private static _instance: PopupManager | null = null;
	private _popups: Map<string, PopupInstance>;
	private _triggers: Map<HTMLElement, ITriggerConfig>;
	private _openedStack: PopupInstance[];
	private _isInitialized: boolean;

	private constructor() {
		this._popups = new Map();
		this._triggers = new Map();
		this._openedStack = [];
		this._isInitialized = false;
	}

	public static getInstance(): PopupManager {
		return PopupManager._instance ??= new PopupManager();
	}

	public static init(): void {
		const manager = PopupManager.getInstance();
		if (manager._isInitialized) return;

		manager.scanDOM();
		manager._isInitialized = true;
	}

	public static register(config: IPopupConfig): PopupInstance {
		const manager = PopupManager.getInstance();
		const popup = new PopupInstance(config);

		manager._popups.set(config.id, popup);

		popup.on(EVENT_OPEN, () => manager.handlePopupOpen(popup));
		popup.on(EVENT_CLOSE, () => manager.handlePopupClose(popup));

		return popup;
	}

	public static registerTrigger(config: ITriggerConfig): void {
		const manager = PopupManager.getInstance();
		manager._triggers.set(config.element, config);

		config.element.addEventListener('click', (event) => {
			event.preventDefault();
			manager.handleTriggerClick(config);
		});
	}

	public static unregister(popupId: string): void {
		const manager = PopupManager.getInstance();
		const popup = manager._popups.get(popupId);

		if (popup) {
			popup.destroy();
			manager._popups.delete(popupId);
		}
	}

	public static unregisterTrigger(element: HTMLElement): void {
		const manager = PopupManager.getInstance();
		manager._triggers.delete(element);
	}

	public static open(popupId: string, trigger?: HTMLElement): void {
		const manager = PopupManager.getInstance();
		const popup = manager._popups.get(popupId);
		popup?.open(trigger);
	}

	public static close(popupId: string): void {
		const manager = PopupManager.getInstance();
		const popup = manager._popups.get(popupId);
		popup?.close();
	}

	public static closeLast(): void {
		const manager = PopupManager.getInstance();
		const lastPopup = manager._openedStack[manager._openedStack.length - 1];
		lastPopup?.close();
	}

	public static closeAll(): void {
		const manager = PopupManager.getInstance();
		[...manager._openedStack].forEach((popup) => popup.close());
	}

	public static get(popupId: string): PopupInstance | undefined {
		const manager = PopupManager.getInstance();
		return manager._popups.get(popupId);
	}

	public static getAll(): PopupInstance[] {
		const manager = PopupManager.getInstance();
		return [...manager._popups.values()];
	}

	public static getOpened(): PopupInstance[] {
		const manager = PopupManager.getInstance();
		return [...manager._openedStack];
	}

	public static isOpened(popupId: string): boolean {
		const manager = PopupManager.getInstance();
		const popup = manager._popups.get(popupId);
		return popup?.isOpen() ?? false;
	}

	private scanDOM(): void {
		this.autoRegisterPopups();
		this.autoRegisterTriggers();
	}

	private findPopups(): HTMLElement[] {
		return [...document.querySelectorAll<HTMLElement>(`.${POPUP_CLASS}`)];
	}

	private findTriggers(): HTMLElement[] {
		return [...document.querySelectorAll<HTMLElement>(`[${DATA_POPUP_ID}]`)];
	}

	private autoRegisterPopups(): void {
		const popupElements = this.findPopups();

		popupElements.forEach((element) => {
			const id = element.id || generateId();
			element.id ||= id;

			if (!this._popups.has(id)) {
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

			if (popupId && !this._triggers.has(element)) {
				PopupManager.registerTrigger({
					element,
					popupId,
				});
			}
		});
	}

	private handleTriggerClick(config: ITriggerConfig): void {
		const popup = this._popups.get(config.popupId);

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
			popup.once(EVENT_OPEN, () => config.onOpen?.(eventData));
		}
	}

	private handlePopupOpen(popup: PopupInstance): void {
		this.addToStack(popup);
	}

	private handlePopupClose(popup: PopupInstance): void {
		this.removeFromStack(popup);
	}

	private addToStack(popup: PopupInstance): void {
		if (!this._openedStack.includes(popup)) {
			this._openedStack.push(popup);
		}
	}

	private removeFromStack(popup: PopupInstance): void {
		const index = this._openedStack.indexOf(popup);
		if (index === -1) return;
		this._openedStack.splice(index, 1);
	}
}
