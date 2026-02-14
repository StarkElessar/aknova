export const initMaskInput = () => {
	let IMask: typeof import('imask');
	const maskTypes = {
		phone: '+{7} (000) 000-00-00',
		abc: /[А-яЁёA-z ]+$/
	}

	document.querySelectorAll<HTMLInputElement>('[data-mask]').forEach(input => {
		const maskType = input.getAttribute('data-mask') ?? '';
		let isMaskLoaded = false;

		if (maskType === 'phone') input.setAttribute('placeholder', '+7 (999) 999-99-99');

		const initMask = async () => {
			IMask ??= await import('imask');
			if (isMaskLoaded || !IMask) return;
			const mask = IMask.default(input, maskTypes[maskType as never]);
			isMaskLoaded = true;

			input.addEventListener('change', () => {
				input.setAttribute('data-value', mask.unmaskedValue);
			});
		};

		input.addEventListener('focus', initMask);
	});
};
