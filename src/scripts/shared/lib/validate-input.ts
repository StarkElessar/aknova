export type CallbackType = (value?: string) => boolean;

type ValidateInputOptions = {
	classError?: string;
	parentSelector?: string;
};

export const validateInput = (input: HTMLInputElement, options: ValidateInputOptions = {}) => {
	const { classError = 'error', parentSelector } = options;
	const wrapper = parentSelector ? input.closest<HTMLElement>(parentSelector) : input.parentElement;
	let isValid = false;

	return (callback: CallbackType = Boolean) => {
		if (input.type === 'tel') {
			const valueLength = input.dataset.value?.length || 0;
			isValid = valueLength === 11;
		}
		else {
			isValid = callback(input.value);
		}

		if (!isValid) input.focus();
		wrapper?.classList.toggle(classError, !isValid);
		return isValid;
	};
};
