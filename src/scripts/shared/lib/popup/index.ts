import { PopupManager } from './popup-manager';

export { PopupManager } from './popup-manager';
export { PopupInstance } from './popup-instance';
export { EventEmitter } from './event-emitter';
export * from './types';
export * from './constants';

export const initPopups = () => PopupManager.init();
export const openPopup = (id: string) => PopupManager.open(id);
export const closePopup = (id: string) => PopupManager.close(id);
export const closeLastPopup = () => PopupManager.closeLast();
export const getPopup = (id: string) => PopupManager.get(id);
