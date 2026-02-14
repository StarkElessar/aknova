import type { PopupInstance } from './popup-instance';

export interface IPopupConfig {
	id: string;
	element: HTMLElement;
	closeOnOverlay?: boolean;
	closeOnEscape?: boolean;
	lockBody?: boolean;
	animationDuration?: number;
}

export interface IPopupEventData {
	popup: PopupInstance;
	trigger: HTMLElement | null;
	triggerData: Record<string, string> | null;
}

export interface ITriggerConfig {
	element: HTMLElement;
	popupId: string;
	onBeforeOpen?: (data: IPopupEventData) => void | boolean;
	onOpen?: (data: IPopupEventData) => void;
}

export type PopupEventCallback = (data: IPopupEventData) => void;
