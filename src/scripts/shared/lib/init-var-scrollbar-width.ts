export const initVarScrollbarWidth = () => {
	const value = innerWidth - document.body.clientWidth + 'px';
	document.documentElement.style.setProperty('--scrollbar-width', value);
};
