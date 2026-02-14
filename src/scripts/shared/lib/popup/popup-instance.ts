import {
	ANIMATION_DURATION,
	BODY_LOCKED_CLASS,
	DATA_CLOSE_BUTTON,
	DATA_CLOSE_OVERLAY,
	ESCAPE_KEY,
	EVENT_BEFORE_CLOSE,
	EVENT_BEFORE_OPEN,
	EVENT_CLOSE,
	EVENT_OPEN,
	POPUP_OPENED_CLASS
} from './constants';
import { EventEmitter } from './event-emitter';
import { getDataAttributes } from './utils';

import type { IPopupConfig, IPopupEventData } from './types';

export class PopupInstance extends EventEmitter {
	private readonly _id: string;
	private readonly _element: HTMLElement;
	private _config: IPopupConfig;
	private _isOpened: boolean;
	private _overlayElement: HTMLElement | null;
	private _closeButtons: HTMLElement[];
	private _currentTrigger: HTMLElement | null;
	private _currentTriggerData: Record<string, string> | null;
	private _escapeHandler: ((event: KeyboardEvent) => void) | null;

	constructor(config: IPopupConfig) {
		super();

		this._id = config.id;
		this._element = config.element;
		this._config = {
			closeOnOverlay: true,
			closeOnEscape: true,
			lockBody: true,
			animationDuration: ANIMATION_DURATION,
			...config
		};
		this._isOpened = false;
		this._overlayElement = null;
		this._closeButtons = [];
		this._currentTrigger = null;
		this._currentTriggerData = null;
		this._escapeHandler = null;

		this.init();
	}

	public open(trigger?: HTMLElement): void {
		if (this._isOpened) {
			return;
		}

		this._currentTrigger = trigger || null;
		this.saveTriggerData(trigger);

		const eventData: IPopupEventData = {
			popup: this,
			trigger: this._currentTrigger,
			triggerData: this._currentTriggerData
		};

		this.emit(EVENT_BEFORE_OPEN, eventData);

		this._isOpened = true;
		this.addOpenedClass();

		if (this._config.lockBody) {
			this.lockPage();
		}

		if (this._config.closeOnEscape) {
			this.bindEscapeHandler();
		}

		setTimeout(
			() => this.emit(EVENT_OPEN, eventData),
			this._config.animationDuration
		);
	}

	public close(): void {
		if (!this._isOpened) {
			return;
		}

		const eventData: IPopupEventData = {
			popup: this,
			trigger: this._currentTrigger,
			triggerData: this._currentTriggerData
		};

		this.emit(EVENT_BEFORE_CLOSE, eventData);

		this._isOpened = false;
		this.removeOpenedClass();

		if (this._config.lockBody) {
			this.unlockPage();
		}

		if (this._escapeHandler) {
			this.unbindEscapeHandler();
		}

		setTimeout(
			() => {
				this.clearTriggerData();
				this.emit(EVENT_CLOSE, eventData);
			},
			this._config.animationDuration
		);
	}

	public isOpen(): boolean {
		return this._isOpened;
	}

	public getId(): string {
		return this._id;
	}

	public getElement(): HTMLElement {
		return this._element;
	}

	public getCurrentTrigger(): HTMLElement | null {
		return this._currentTrigger;
	}

	public getTriggerData(): Record<string, string> | null {
		return this._currentTriggerData;
	}

	public destroy(): void {
		if (this._isOpened) {
			this.close();
		}

		this.unbindEvents();
		this.clear();

		this._overlayElement = null;
		this._closeButtons = [];
		this._currentTrigger = null;
		this._currentTriggerData = null;
	}

	private init(): void {
		this.findElements();
		this.bindEvents();
	}

	private findElements(): void {
		this._overlayElement = this._element.querySelector<HTMLElement>(`[${DATA_CLOSE_OVERLAY}]`);
		this._closeButtons = [...this._element.querySelectorAll<HTMLElement>(`[${DATA_CLOSE_BUTTON}]`)];
	}

	private bindEvents(): void {
		if (this._config.closeOnOverlay && this._overlayElement) {
			this._overlayElement.addEventListener('click', this.handleOverlayClick);
		}

		this._closeButtons.forEach((button) => {
			button.addEventListener('click', this.handleCloseButtonClick);
		});
	}

	private unbindEvents(): void {
		this._overlayElement?.removeEventListener('click', this.handleOverlayClick);

		this._closeButtons.forEach((button) => {
			button.removeEventListener('click', this.handleCloseButtonClick);
		});
	}

	private handleOverlayClick = (event: MouseEvent): void => {
		if (event.target === this._overlayElement) {
			this.close();
		}
	};

	private handleCloseButtonClick = (event: MouseEvent): void => {
		event.preventDefault();
		this.close();
	};

	private handleEscapeKey(event: KeyboardEvent): void {
		if (event.key === ESCAPE_KEY) {
			this.close();
		}
	}

	private bindEscapeHandler(): void {
		this._escapeHandler = (event: KeyboardEvent) => this.handleEscapeKey(event);
		document.addEventListener('keydown', this._escapeHandler);
	}

	private unbindEscapeHandler(): void {
		if (this._escapeHandler) {
			document.removeEventListener('keydown', this._escapeHandler);
			this._escapeHandler = null;
		}
	}

	private saveTriggerData(trigger?: HTMLElement): void {
		if (trigger) {
			this._currentTriggerData = getDataAttributes(trigger, 'popup');
		}
		else {
			this._currentTriggerData = null;
		}
	}

	private clearTriggerData(): void {
		this._currentTrigger = null;
		this._currentTriggerData = null;
	}

	private lockPage(): void {
		document.documentElement.classList.add(BODY_LOCKED_CLASS);
	}

	private unlockPage(): void {
		document.documentElement.classList.remove(BODY_LOCKED_CLASS);
	}

	private addOpenedClass(): void {
		this._element.classList.add(POPUP_OPENED_CLASS);
	}

	private removeOpenedClass(): void {
		this._element.classList.remove(POPUP_OPENED_CLASS);
	}
}
