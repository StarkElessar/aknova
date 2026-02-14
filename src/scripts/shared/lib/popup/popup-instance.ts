import { EventEmitter } from './event-emitter';
import type { IPopupConfig, IPopupEventData } from './types';
import {
	DATA_CLOSE_BUTTON,
	DATA_CLOSE_OVERLAY,
	POPUP_OPENED_CLASS,
	BODY_LOCKED_CLASS,
	EVENT_BEFORE_OPEN,
	EVENT_OPEN,
	EVENT_BEFORE_CLOSE,
	EVENT_CLOSE,
	ESCAPE_KEY,
	ANIMATION_DURATION,
} from './constants';
import { getDataAttributes, getScrollbarWidth } from './utils';

export class PopupInstance extends EventEmitter {
	private id: string;
	private element: HTMLElement;
	private config: IPopupConfig;
	private isOpened: boolean;
	private overlayElement: HTMLElement | null;
	private closeButtons: HTMLElement[];
	private currentTrigger: HTMLElement | null;
	private currentTriggerData: Record<string, string> | null;
	private escapeHandler: ((event: KeyboardEvent) => void) | null;
	private scrollbarWidth: number;

	constructor(config: IPopupConfig) {
		super();

		this.id = config.id;
		this.element = config.element;
		this.config = {
			closeOnOverlay: true,
			closeOnEscape: true,
			lockBody: true,
			animationDuration: ANIMATION_DURATION,
			...config,
		};
		this.isOpened = false;
		this.overlayElement = null;
		this.closeButtons = [];
		this.currentTrigger = null;
		this.currentTriggerData = null;
		this.escapeHandler = null;
		this.scrollbarWidth = 0;

		this.init();
	}

	public open(trigger?: HTMLElement): void {
		if (this.isOpened) return;

		this.currentTrigger = trigger || null;
		this.saveTriggerData(trigger);

		const eventData: IPopupEventData = {
			popup: this,
			trigger: this.currentTrigger,
			triggerData: this.currentTriggerData,
		};

		this.emit(EVENT_BEFORE_OPEN, eventData);

		this.isOpened = true;
		this.addOpenedClass();

		if (this.config.lockBody) {
			this.lockBody();
		}

		if (this.config.closeOnEscape) {
			this.bindEscapeHandler();
		}

		setTimeout(() => {
			this.emit(EVENT_OPEN, eventData);
		}, this.config.animationDuration);
	}

	public close(): void {
		if (!this.isOpened) return;

		const eventData: IPopupEventData = {
			popup: this,
			trigger: this.currentTrigger,
			triggerData: this.currentTriggerData,
		};

		this.emit(EVENT_BEFORE_CLOSE, eventData);

		this.isOpened = false;
		this.removeOpenedClass();

		if (this.config.lockBody) {
			this.unlockBody();
		}

		if (this.escapeHandler) {
			this.unbindEscapeHandler();
		}

		setTimeout(() => {
			this.clearTriggerData();
			this.emit(EVENT_CLOSE, eventData);
		}, this.config.animationDuration);
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
		this.overlayElement = this.element.querySelector(
			`[${DATA_CLOSE_OVERLAY}]`,
		);
		this.closeButtons = Array.from(
			this.element.querySelectorAll(`[${DATA_CLOSE_BUTTON}]`),
		);
	}

	private bindEvents(): void {
		if (this.config.closeOnOverlay && this.overlayElement) {
			this.overlayElement.addEventListener('click', (event) =>
				this.handleOverlayClick(event),
			);
		}

		this.closeButtons.forEach((button) => {
			button.addEventListener('click', (event) =>
				this.handleCloseButtonClick(event),
			);
		});
	}

	private unbindEvents(): void {
		if (this.overlayElement) {
			this.overlayElement.removeEventListener('click', (event) =>
				this.handleOverlayClick(event),
			);
		}

		this.closeButtons.forEach((button) => {
			button.removeEventListener('click', (event) =>
				this.handleCloseButtonClick(event),
			);
		});
	}

	private handleOverlayClick(event: MouseEvent): void {
		if (event.target === this.overlayElement) {
			this.close();
		}
	}

	private handleCloseButtonClick(event: MouseEvent): void {
		event.preventDefault();
		this.close();
	}

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
		} else {
			this.currentTriggerData = null;
		}
	}

	private clearTriggerData(): void {
		this.currentTrigger = null;
		this.currentTriggerData = null;
	}

	private lockBody(): void {
		this.scrollbarWidth = getScrollbarWidth();
		document.body.style.paddingRight = `${this.scrollbarWidth}px`;
		document.body.classList.add(BODY_LOCKED_CLASS);
	}

	private unlockBody(): void {
		document.body.style.paddingRight = '';
		document.body.classList.remove(BODY_LOCKED_CLASS);
	}

	private addOpenedClass(): void {
		this.element.classList.add(POPUP_OPENED_CLASS);
	}

	private removeOpenedClass(): void {
		this.element.classList.remove(POPUP_OPENED_CLASS);
	}
}
