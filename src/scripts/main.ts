// Global JavaScript code that runs on all pages
import { burgerMenuInit } from './features/burger-menu-init';
import { initVarScrollbarWidth } from './shared/lib/init-var-scrollbar-width';

document.addEventListener('DOMContentLoaded', () => {
	initVarScrollbarWidth();
	burgerMenuInit();
});
