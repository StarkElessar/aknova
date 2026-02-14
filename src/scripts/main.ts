// Global JavaScript code that runs on all pages
import { burgerMenuInit } from '@scripts/features/burger-menu-init';
import { initVarScrollbarWidth } from '@scripts/shared/lib/init-var-scrollbar-width';
import { initGoTopButton } from '@scripts/features/go-top-button';
import { initPopups } from '@scripts/shared/lib/popup';
import { initPopupTitleHandler } from '@scripts/features/popup-title-handler';

document.addEventListener('DOMContentLoaded', () => {
	initVarScrollbarWidth();
	burgerMenuInit();
	initGoTopButton();
	initPopups();
	initPopupTitleHandler();
});
