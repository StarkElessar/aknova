import { type IPopupEventData,PopupManager } from '@scripts/shared/lib/popup';

export function initPopupTitleHandler() {
	const popup = PopupManager.get('request-call-popup');
	const element = popup?.getElement();
	const titleElement = element?.querySelector('.popup__title');

	if (titleElement) {
		const originalTitle = titleElement.textContent;

		popup?.on('beforeOpen', (data: IPopupEventData) => {
			const customTitle = data.triggerData?.['title'];
			if (customTitle && titleElement) {
				titleElement.textContent = customTitle;
			}
		});

		popup?.on('close', () => {
			titleElement.textContent = originalTitle;
		});
	}
}
