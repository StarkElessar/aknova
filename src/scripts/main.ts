// Global JavaScript code that runs on all pages
import { formHandler } from '@scripts/shared/lib/form-handler';
import { initVarScrollbarWidth } from '@scripts/shared/lib/init-var-scrollbar-width';
import { LazyLoadManager } from '@scripts/shared/lib/lazy-load-manager';
import { initPopups } from '@scripts/shared/lib/popup';

import { burgerMenuInit } from '@scripts/features/burger-menu-init';
import { initGoTopButton } from '@scripts/features/go-top-button';
import { initMaskInput } from '@scripts/features/mask-input.ts';
import { initPopupTitleHandler } from '@scripts/features/popup-title-handler';

document.addEventListener('DOMContentLoaded', () => {
	initVarScrollbarWidth();
	burgerMenuInit();
	LazyLoadManager.getInstance();
	initGoTopButton();
	initPopups();
	initPopupTitleHandler();

	formHandler({ formId: 'request-call-popup-form' });
	initMaskInput();
});
