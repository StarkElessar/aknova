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
	private readonly id: string;
	private readonly element: HTMLElement;
	private config: IPopupConfig;
	private isOpened: boolean;
	private overlayElement: HTMLElement | null;
	private closeButtons: HTMLElement[];
	private currentTrigger: HTMLElement | null;
	private currentTriggerData: Record<string, string> | null;
	private escapeHandler: ((event: KeyboardEvent) => void) | null;

	constructor(config: IPopupConfig) {
		super();

		this.id = config.id;
		this.element = config.element;
		this.config = {
			closeOnOverlay: true,
			closeOnEscape: true,
			lockBody: true,
			animationDuration: ANIMATION_DURATION,
			...config
		};
		this.isOpened = false;
		this.overlayElement = null;
		this.closeButtons = [];
		this.currentTrigger = null;
		this.currentTriggerData = null;
		this.escapeHandler = null;

		this.init();
	}

	public open(trigger?: HTMLElement): void {
		if (this.isOpened) {
			return;
		}

		this.currentTrigger = trigger || null;
		this.saveTriggerData(trigger);

		const eventData: IPopupEventData = {
			popup: this,
			trigger: this.currentTrigger,
			triggerData: this.currentTriggerData
		};

		this.emit(EVENT_BEFORE_OPEN, eventData);

		this.isOpened = true;
		this.addOpenedClass();

		if (this.config.lockBody) {
			this.lockPage();
		}

		if (this.config.closeOnEscape) {
			this.bindEscapeHandler();
		}

		setTimeout(() => {
			this.emit(EVENT_OPEN, eventData);
		}, this.config.animationDuration);
	}

	public close(): void {
		if (!this.isOpened) {
			return;
		}

		const eventData: IPopupEventData = {
			popup: this,
			trigger: this.currentTrigger,
			triggerData: this.currentTriggerData
		};

		this.emit(EVENT_BEFORE_CLOSE, eventData);

		this.isOpened = false;
		this.removeOpenedClass();

		if (this.config.lockBody) {
			this.unlockPage();
		}

		if (this.escapeHandler) {
			this.unbindEscapeHandler();
		}

		setTimeout(
			() => {
				this.clearTriggerData();
				this.emit(EVENT_CLOSE, eventData);
			},
			this.config.animationDuration
		);
	}

	public isOpen(): boolean {
		return this.isOpened;
	}

	public getId(): string {
		return this.id;
	}

	public getElement(): HTMLElement {
		return this.element;
	}

	public getCurrentTrigger(): HTMLElement | null {
		return this.currentTrigger;
	}

	public getTriggerData(): Record<string, string> | null {
		return this.currentTriggerData;
	}

	public destroy(): void {
		if (this.isOpened) {
			this.close();
		}

		this.unbindEvents();
		this.clear();

		this.overlayElement = null;
		this.closeButtons = [];
		this.currentTrigger = null;
		this.currentTriggerData = null;
	}

	private init(): void {
		this.findElements();
		this.bindEvents();
	}

	private findElements(): void {
		this.overlayElement = this.element.querySelector<HTMLElement>(`[${DATA_CLOSE_OVERLAY}]`);
		this.closeButtons = [...this.element.querySelectorAll<HTMLElement>(`[${DATA_CLOSE_BUTTON}]`)];
	}

	private bindEvents(): void {
		if (this.config.closeOnOverlay && this.overlayElement) {
			this.overlayElement.addEventListener('click', this.handleOverlayClick);
		}

		this.closeButtons.forEach((button) => {
			button.addEventListener('click', this.handleCloseButtonClick);
		});
	}

	private unbindEvents(): void {
		this.overlayElement?.removeEventListener('click', this.handleOverlayClick);

		this.closeButtons.forEach((button) => {
			button.removeEventListener('click', this.handleCloseButtonClick);
		});
	}

	private handleOverlayClick = (event: MouseEvent): void => {
		if (event.target === this.overlayElement) {
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
		this.escapeHandler = (event: KeyboardEvent) => this.handleEscapeKey(event);
		document.addEventListener('keydown', this.escapeHandler);
	}

	private unbindEscapeHandler(): void {
		if (this.escapeHandler) {
			document.removeEventListener('keydown', this.escapeHandler);
			this.escapeHandler = null;
		}
	}

	private saveTriggerData(trigger?: HTMLElement): void {
		if (trigger) {
			this.currentTriggerData = getDataAttributes(trigger, 'popup');
		}
		else {
			this.currentTriggerData = null;
		}
	}

	private clearTriggerData(): void {
		this.currentTrigger = null;
		this.currentTriggerData = null;
	}

	private lockPage(): void {
		document.documentElement.classList.add(BODY_LOCKED_CLASS);
	}

	private unlockPage(): void {
		document.documentElement.classList.remove(BODY_LOCKED_CLASS);
	}

	private addOpenedClass(): void {
		this.element.classList.add(POPUP_OPENED_CLASS);
	}

	private removeOpenedClass(): void {
		this.element.classList.remove(POPUP_OPENED_CLASS);
	}
}
