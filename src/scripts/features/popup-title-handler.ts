import { PopupManager, type IPopupEventData } from '@scripts/shared/lib/popup';

export function initPopupTitleHandler() {
	const popups = PopupManager.getAll();

	popups.forEach((popup) => {
		const element = popup.getElement();
		const titleElement = element.querySelector('.popup__title');

		if (!titleElement) return;

		const originalTitle = titleElement.textContent || '';

		popup.on('beforeOpen', (data: IPopupEventData) => {
			const customTitle = data.triggerData?.['title'];
			if (customTitle && titleElement) {
				titleElement.textContent = customTitle;
			}
		});

		popup.on('close', () => {
			if (titleElement) {
				titleElement.textContent = originalTitle;
			}
		});
	});
}
