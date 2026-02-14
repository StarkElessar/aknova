// Global JavaScript code that runs on all pages
import { initVarScrollbarWidth } from '@scripts/shared/lib/init-var-scrollbar-width';
import { initPopups } from '@scripts/shared/lib/popup';

import { burgerMenuInit } from '@scripts/features/burger-menu-init';
import { initGoTopButton } from '@scripts/features/go-top-button';
import { initPopupTitleHandler } from '@scripts/features/popup-title-handler';
import { formHandler } from '@scripts/shared/lib/form-handler';
import { initMaskInput } from '@scripts/features/mask-input.ts';

document.addEventListener('DOMContentLoaded', () => {
	initVarScrollbarWidth();
	burgerMenuInit();
	initGoTopButton();
	initPopups();
	initPopupTitleHandler();

	formHandler({ formId: 'request-call-popup-form' });
	initMaskInput();
});
