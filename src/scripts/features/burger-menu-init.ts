export function burgerMenuInit() {
	document.querySelector<HTMLButtonElement>('#burger-btn')?.addEventListener(
		'click',
		() => {
			document.documentElement.classList.toggle('burger-menu-opened');
		}
	);

	document.addEventListener(
		'click',
		(event) => {
			const target = event.target as HTMLElement;
			const burgerMenuOpened = document.documentElement.classList.contains('burger-menu-opened');

			if (burgerMenuOpened && !target?.closest('.header')) {
				document.documentElement.classList.remove('burger-menu-opened');
			}
		}
	);
}
