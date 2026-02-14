export const initGoTopButton = () => {
	const button = document.getElementById('go-top-button');

	if (button) {
		// Создаём элемент-триггер в начале страницы
		const triggerElement = document.createElement('div');

		triggerElement.style.cssText = `
			position: absolute;
			top: 0;
			left: 0;
			width: 1px;
			height: 1px;
			pointer-events: none;
			opacity: 0;
			visibility: hidden;
		`;

		document.body.prepend(triggerElement);

		const observer = new IntersectionObserver(
			([entry]) => {
				// Кнопка показывается, когда триггер не виден (прокрутили вниз)
				button.classList.toggle('go-top-button_show', !entry.isIntersecting);
			},
			{
				root: null,
				threshold: 0,
				rootMargin: '0px',
			},
		);

		observer.observe(triggerElement);

		button.onclick = () => {
			scrollTo({
				top: 0,
				behavior: 'smooth',
			});
		};
	}
};
