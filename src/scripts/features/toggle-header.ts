export function initToggleHeader() {
	const header = document.querySelector<HTMLElement>('.header');

	if (header) {
		const SCROLL_THRESHOLD = 600;
		let lastScrollY = window.scrollY;
		let ticking = false;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			const isScrollingDown = currentScrollY > lastScrollY;
			const isBelowThreshold = currentScrollY > SCROLL_THRESHOLD;

			// Скрываем шапку только при скролле вниз после 600px
			document.documentElement.classList.toggle('header-hidden', isScrollingDown && isBelowThreshold);

			lastScrollY = currentScrollY;
			ticking = false;
		};

		window.addEventListener('scroll', () => {
			if (!ticking) {
				window.requestAnimationFrame(handleScroll);
				ticking = true;
			}
		});
	}
}
