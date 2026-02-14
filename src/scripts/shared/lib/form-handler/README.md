# Form Handler

Универсальный обработчик форм с встроенной валидацией, управлением состоянием кнопки отправки и гибкими колбэками для обработки различных сценариев.

## Содержание

- [Основные возможности](#основные-возможности)
- [Быстрый старт](#быстрый-старт)
- [API](#api)
- [Валидация](#валидация)
- [Примеры использования](#примеры-использования)
- [Интеграция с другими библиотеками](#интеграция-с-другими-библиотеками)

## Основные возможности

- ✅ **Автоматическая валидация** полей с атрибутом `data-required`
- ✅ **Управление состоянием кнопки** (loading, disabled)
- ✅ **Cooldown после отправки** для предотвращения спама
- ✅ **Автосброс формы** после успешной отправки
- ✅ **Гибкие колбэки** для обработки успеха, ошибок и завершения
- ✅ **Кастомная валидация** через callback
- ✅ **Поддержка телефонных масок** через `data-value`
- ✅ **Интеграция с Fetch API** для отправки данных

## Быстрый старт

### 1. Подготовка HTML

```html
<form id="contact-form" action="/api/contact" data-error-message="Не удалось отправить форму">
	<fieldset class="form-field" data-error-message="Поле обязательно для заполнения">
		<label for="name">Ваше имя <span class="form-field__required">*</span></label>
		<input
			id="name"
			name="name"
			type="text"
			class="input input_lg input_white"
			data-required
			placeholder="Как вас зовут?"
		/>
	</fieldset>

	<fieldset class="form-field" data-error-message="Поле обязательно для заполнения">
		<label for="phone">Ваш телефон <span class="form-field__required">*</span></label>
		<input
			id="phone"
			name="phone"
			type="tel"
			class="input input_lg input_white"
			data-required
			data-mask="phone"
			placeholder="Введите ваш номер телефона"
		/>
	</fieldset>

	<button type="submit" class="btn btn_lg btn_gradient btn_full">
		Отправить заявку
	</button>
</form>
```

### 2. Инициализация в JavaScript

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';

formHandler({ formId: 'contact-form' });
```

## API

### FormHandlerProps

| Параметр | Тип | Обязательный | По умолчанию | Описание |
|----------|-----|--------------|--------------|----------|
| `formId` | `string` | ✅ | - | ID элемента формы |
| `onSuccess` | `function` | ❌ | `undefined` | Колбэк при успешной отправке |
| `onAfterPrevent` | `function` | ❌ | `undefined` | Колбэк сразу после `preventDefault()` |
| `onError` | `function` | ❌ | `undefined` | Колбэк при ошибке отправки |
| `onFinally` | `function` | ❌ | `undefined` | Колбэк в блоке finally (всегда выполняется) |
| `customValidator` | `function` | ❌ | `undefined` | Кастомная функция валидации |
| `submitCooldown` | `number` | ❌ | `0` | Время (мс) блокировки кнопки после отправки |
| `autoResetForm` | `boolean` | ❌ | `true` | Автоматический сброс формы после успешной отправки |

### Типы колбэков

#### DefaultCallbackProps
```typescript
interface DefaultCallbackProps {
	form: HTMLFormElement;
	buttonSubmit: HTMLButtonElement;
}
```

#### SuccessCallbackProps
```typescript
interface SuccessCallbackProps extends DefaultCallbackProps {
	formData: FormData;
	response: Response;
}
```

#### ErrorCallbackProps
```typescript
interface ErrorCallbackProps extends DefaultCallbackProps {
	error: Error;
}
```

## Валидация

### Встроенная валидация

Form Handler автоматически валидирует все поля с атрибутом `data-required`:

#### Текстовые поля
```html
<input type="text" data-required />
```
- Проверяется, что значение не пустое (используется `Boolean(value)`)

#### Телефонные поля
```html
<input type="tel" data-required data-mask="phone" />
```
- Проверяется, что `data-value` содержит ровно 11 символов
- **Важно:** Маска телефона должна устанавливать атрибут `data-value` с чистым номером

### Отображение ошибок

При невалидных данных:
1. Родительский элемент (fieldset/div) получает класс `error`
2. Отображается сообщение из атрибута `data-error-message`
3. Невалидное поле получает фокус

Пример CSS для отображения ошибок:
```scss
.form-field {
	display: grid;
	gap: 8px;

	&.error {
		&::after {
			content: attr(data-error-message);
			display: inline-flex;
			font-size: 12px;
			color: var(--color-red-700);
		}
	}
}
```

### Кастомная валидация

Если встроенной валидации недостаточно, можно использовать `customValidator`:

```typescript
formHandler({
	formId: 'registration-form',
	customValidator: ({ form, buttonSubmit }) => {
		const email = form.querySelector<HTMLInputElement>('[name="email"]');
		const password = form.querySelector<HTMLInputElement>('[name="password"]');
		const confirmPassword = form.querySelector<HTMLInputElement>('[name="confirm-password"]');

		// Валидация email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email.value)) {
			email?.parentElement?.classList.add('error');
			return false;
		}

		// Валидация совпадения паролей
		if (password?.value !== confirmPassword?.value) {
			confirmPassword?.parentElement?.classList.add('error');
			return false;
		}

		return true; // Все проверки пройдены
	}
});
```

## Примеры использования

### Пример 1: Базовое использование

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';

formHandler({ formId: 'hero-form' });
```

### Пример 2: С обработкой успешной отправки

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';
import { PopupManager } from '@scripts/shared/lib/popup';

formHandler({
	formId: 'request-call-popup-form',
	onSuccess: ({ form, response }) => {
		// Закрыть текущий попап
		PopupManager.close('request-call-popup');

		// Показать попап успеха
		PopupManager.open('success-popup', {
			message: 'Ваша заявка успешно отправлена!'
		});
	}
});
```

### Пример 3: С обработкой ошибок

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';

formHandler({
	formId: 'contact-form',
	onError: ({ error, form, buttonSubmit }) => {
		console.error('Ошибка отправки формы:', error);

		// Показать уведомление об ошибке
		alert(`Произошла ошибка: ${error.message}`);
	}
});
```

### Пример 4: С cooldown и без автосброса

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';

formHandler({
	formId: 'subscribe-form',
	submitCooldown: 5000, // 5 секунд
	autoResetForm: false, // Не сбрасывать форму
	onSuccess: ({ form }) => {
		// Показать сообщение об успехе, но оставить данные в полях
		form.insertAdjacentHTML('beforeend',
			'<p class="success-message">Вы успешно подписались!</p>'
		);
	}
});
```

### Пример 5: С кастомной валидацией и отслеживанием этапов

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';

formHandler({
	formId: 'complex-form',

	onAfterPrevent: ({ form, buttonSubmit }) => {
		console.log('Форма отправлена, начинается валидация');
	},

	customValidator: ({ form }) => {
		const age = form.querySelector<HTMLInputElement>('[name="age"]');
		const ageValue = parseInt(age?.value || '0', 10);

		if (ageValue < 18) {
			alert('Вы должны быть старше 18 лет');
			return false;
		}

		return true;
	},

	onSuccess: ({ formData, response }) => {
		console.log('Форма успешно отправлена');
		console.log('Отправленные данные:', Object.fromEntries(formData));
	},

	onError: ({ error }) => {
		console.error('Ошибка:', error);
	},

	onFinally: ({ buttonSubmit }) => {
		console.log('Обработка завершена');
	}
});
```

### Пример 6: Работа с данными формы

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';

formHandler({
	formId: 'order-form',
	onSuccess: async ({ formData, response }) => {
		// Получить JSON-ответ от сервера
		const data = await response.json();

		// Вывести информацию о заказе
		console.log('Номер заказа:', data.orderId);
		console.log('Отправленные данные:', {
			name: formData.get('name'),
			phone: formData.get('phone'),
			comment: formData.get('comment')
		});

		// Перенаправить на страницу успеха
		window.location.href = `/order-success?id=${data.orderId}`;
	}
});
```

## Интеграция с другими библиотеками

### Интеграция с Popup Manager

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';
import { PopupManager } from '@scripts/shared/lib/popup';

// Инициализация формы внутри попапа
formHandler({
	formId: 'request-call-popup-form',
	onSuccess: () => {
		// Закрыть форму
		PopupManager.close('request-call-popup');

		// Открыть попап успеха
		PopupManager.open('success-popup');
	}
});

// Предзаполнение формы при открытии попапа
const popup = PopupManager.get('request-call-popup');
popup?.on('open', (data) => {
	const form = document.getElementById('request-call-popup-form') as HTMLFormElement;
	const productField = form?.querySelector('[name="product"]') as HTMLInputElement;

	if (data.triggerData?.['product'] && productField) {
		productField.value = data.triggerData['product'];
	}
});
```

### Интеграция с маской ввода

Убедитесь, что `initMaskInput()` вызвана до инициализации formHandler:

```typescript
import { formHandler } from '@scripts/shared/lib/form-handler';
import { initMaskInput } from '@scripts/features/mask-input';

document.addEventListener('DOMContentLoaded', () => {
	// Сначала инициализируем маски
	initMaskInput();

	// Затем формы
	formHandler({ formId: 'contact-form' });
});
```

## Требования к HTML-разметке

### Обязательные атрибуты формы

```html
<form
	id="unique-form-id"        <!-- Уникальный ID -->
	action="/api/endpoint"     <!-- URL для отправки -->
	data-error-message="..."   <!-- Сообщение об ошибке (опционально) -->
>
```

### Обязательные поля

```html
<fieldset
	class="form-field"                             <!-- Класс для стилизации -->
	data-error-message="Поле обязательно"          <!-- Сообщение ошибки поля -->
>
	<input
		type="text"
		name="field-name"          <!-- Имя поля для отправки -->
		data-required              <!-- Маркер обязательного поля -->
	/>
</fieldset>
```

### Телефонные поля

```html
<input
	type="tel"
	name="phone"
	data-required
	data-mask="phone"              <!-- Для работы с маской -->
	data-value=""                  <!-- Устанавливается маской -->
/>
```

### Кнопка отправки

```html
<button type="submit" class="btn">
	Отправить
</button>
```

## Поведение при отправке

1. **Предотвращение отправки:** `event.preventDefault()`
2. **Вызов `onAfterPrevent`:** Можно использовать для аналитики
3. **Валидация:** Проверка всех полей с `data-required`
4. **Блокировка кнопки:** Добавление класса `loading` и атрибута `disabled`
5. **Отправка данных:** POST-запрос через Fetch API
6. **Обработка ответа:**
   - **Успех:** Вызов `onSuccess`, сброс формы (если `autoResetForm: true`)
   - **Ошибка:** Вызов `onError`, разблокировка кнопки (если нет cooldown)
7. **Завершение:** Вызов `onFinally`, снятие класса `loading`
8. **Cooldown:** Кнопка остаётся заблокированной на указанное время

## Особенности работы с телефонными полями

Form Handler ожидает, что маска телефона устанавливает атрибут `data-value` с чистым номером:

```typescript
// В маске телефона
input.setAttribute('data-value', '79123456789'); // 11 цифр
```

При отправке используется значение из `data-value`:
```typescript
formData.set('phone', form.phone.dataset.value);
```

## Отладка

Включите логирование для отладки:

```typescript
formHandler({
	formId: 'my-form',
	onAfterPrevent: ({ form }) => {
		console.log('Submit prevented');
	},
	onSuccess: ({ formData, response }) => {
		console.log('Success!', Object.fromEntries(formData));
	},
	onError: ({ error }) => {
		console.error('Error:', error);
	},
	onFinally: () => {
		console.log('Finally executed');
	}
});
```

## Часто задаваемые вопросы

### Как отправить дополнительные данные с формой?

Используйте скрытые поля или модифицируйте FormData в `onAfterPrevent`:

```typescript
formHandler({
	formId: 'my-form',
	onAfterPrevent: ({ form }) => {
		const hiddenInput = document.createElement('input');
		hiddenInput.type = 'hidden';
		hiddenInput.name = 'source';
		hiddenInput.value = 'landing-page';
		form.appendChild(hiddenInput);
	}
});
```

### Как изменить метод отправки с POST на PUT/DELETE?

Form Handler использует только POST. Для других методов используйте кастомный код:

```typescript
form.addEventListener('submit', async (e) => {
	e.preventDefault();
	const formData = new FormData(form);
	await fetch(form.action, {
		method: 'PUT',
		body: formData
	});
});
```

### Как обработать JSON-ответ от сервера?

```typescript
formHandler({
	formId: 'my-form',
	onSuccess: async ({ response }) => {
		const data = await response.json();
		console.log(data);
	}
});
```

### Как отключить автосброс только для одного поля?

Используйте `autoResetForm: false` и сбросьте поля вручную:

```typescript
formHandler({
	formId: 'my-form',
	autoResetForm: false,
	onSuccess: ({ form }) => {
		// Сбросить все, кроме email
		const email = form.querySelector('[name="email"]')?.value;
		form.reset();
		form.querySelector('[name="email"]').value = email;
	}
});
```

## Лицензия

Этот компонент является частью проекта aknova.
