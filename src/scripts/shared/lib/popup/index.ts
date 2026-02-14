import { PopupManager } from './popup-manager';

export * from './constants';
export { EventEmitter } from './event-emitter';
export { PopupInstance } from './popup-instance';
export { PopupManager } from './popup-manager';
export * from './types';

export const initPopups = () => PopupManager.init();
export const openPopup = (id: string) => PopupManager.open(id);
export const closePopup = (id: string) => PopupManager.close(id);
export const closeLastPopup = () => PopupManager.closeLast();
export const getPopup = (id: string) => PopupManager.get(id);
