// Global JavaScript code that runs on all pages
import { initVarScrollbarWidth } from './shared/lib/init-var-scrollbar-width';
import { burgerMenuInit } from './features/burger-menu-init';

document.addEventListener('DOMContentLoaded', () => {
	initVarScrollbarWidth();
	burgerMenuInit();
});
