import { validateInput } from '@scripts/shared/lib/validate-input';

import type { FormHandlerProps } from './types';

export const formHandler = (props: FormHandlerProps) => {
	const {
		formId,
		onSuccess,
		onAfterPrevent,
		onError,
		onFinally,
		customValidator,
		submitCooldown = 0,
		autoResetForm = true,
	} = props;
	const form = document.getElementById(formId);

	if (!(form instanceof HTMLFormElement)) {
		console.error(`Element with id "${formId}" is not a form or does not exist.`);
		return;
	}

	const requiredInputs = [...form.querySelectorAll<HTMLInputElement>('[data-required]')];
	const buttonSubmit = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
	const validateHandlers = requiredInputs.reverse().map((input) => validateInput(input));
	const { errorMessage = 'Network response was not ok' } = form.dataset;

	form.addEventListener('submit', async event => {
		event.preventDefault();
		onAfterPrevent?.({ form, buttonSubmit });

		if (!form.hasAttribute('action')) {
			console.error('Url action was not defined or not specified');
			return;
		}

		const isValid = customValidator?.({ form, buttonSubmit }) ?? !validateHandlers.map(cb => cb()).includes(false);

		if (isValid) {
			let timeoutId: ReturnType<typeof setTimeout> | null = null;

			try {
				buttonSubmit.classList.add('loading');
				buttonSubmit.disabled = true;

				if (submitCooldown) {
					timeoutId = setTimeout(
						() => (buttonSubmit.disabled = false),
						submitCooldown
					);
				}

				const formData = new FormData(form);
				formData.set('phone', form.phone.dataset.value);

				const response = await fetch(form.action, {
					method: 'POST',
					body: formData
				});

				if (!response.ok) {
					throw new Error(errorMessage);
				}

				onSuccess?.({ form, buttonSubmit, response, formData });
			}
			catch (e) {
				if (timeoutId) {
					clearTimeout(timeoutId);
					buttonSubmit.disabled = false;
				}

				onError?.({
					error: e instanceof Error ? e : new Error('Произошла ошибка, попробуйте еще раз или позвоните нам.'),
					form,
					buttonSubmit
				});
			}
			finally {
				if (autoResetForm) {
					form.reset();
					form.Phone?.setAttribute('data-value', '');
				}

				buttonSubmit.classList.remove('loading');
				if (!submitCooldown) {
					buttonSubmit.disabled = false;
				}
				onFinally?.({ form, buttonSubmit });
			}
		}
	});
};
