interface DefaultCallbackProps {
	form: HTMLFormElement;
	buttonSubmit: HTMLButtonElement;
}

interface SuccessCallbackProps extends DefaultCallbackProps {
	formData: FormData;
	response: Response;
}

interface ErrorCallbackProps extends DefaultCallbackProps {
	error: Error;
}

export interface FormHandlerProps {
	formId: string;
	onSuccess?: (props: SuccessCallbackProps) => void;
	onAfterPrevent?: (props: DefaultCallbackProps) => void;
	onError?: (props: ErrorCallbackProps) => void;
	onFinally?: (props: DefaultCallbackProps) => void;
	submitCooldown?: number;
	autoResetForm?: boolean;
	/**
     * Функция колбек-валидатор, чтобы указать свою валидацию вместо,
     * того, что предлагает formHandler
     * */
	customValidator?: (props: DefaultCallbackProps) => boolean;
}
