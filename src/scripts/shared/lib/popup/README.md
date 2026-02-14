# Popup Library

Универсальная библиотека для управления модальными окнами (попапами) на чистом TypeScript.

## Возможности

- ✅ Открытие/закрытие через data-атрибуты
- ✅ Программное управление через API
- ✅ Система событий для подписки на открытие/закрытие
- ✅ Регистрация кастомных обработчиков для триггеров
- ✅ Стек попапов для корректной работы нескольких открытых окон
- ✅ Блокировка скролла body с компенсацией scrollbar
- ✅ Закрытие по Escape, клику на overlay или кнопке закрытия
- ✅ TypeScript типизация

## Быстрый старт

### 1. Инициализация

```typescript
import { initPopups } from '@scripts/shared/lib/popup';

document.addEventListener('DOMContentLoaded', () => {
	initPopups(); // Автоматически найдёт все попапы и триггеры в DOM
});
```

### 2. HTML разметка

```html
<!-- Попап -->
<div id="my-popup" class="popup">
	<div class="popup__overlay" data-close-overlay>
		<div class="popup__body">
			<button class="popup__close" type="button" data-close-button>×</button>
			<h2 class="popup__title">Заголовок попапа</h2>
			<p>Контент попапа</p>
		</div>
	</div>
</div>

<!-- Триггер для открытия -->
<button data-popup-id="my-popup">Открыть попап</button>
```

### 3. Стили

Убедитесь, что у попапа есть базовые стили:

```scss
.popup {
	display: none;
	position: fixed;
	inset: 0;
	z-index: 1000;

	&.popup_opened {
		display: block;
	}
}

.body-locked {
	overflow: hidden;
}
```

## Публичное API

### PopupManager

Глобальный менеджер для управления попапами.

#### Методы

```typescript
// Инициализация (сканирует DOM и регистрирует попапы)
PopupManager.init(): void

// Регистрация попапа
PopupManager.register(config: IPopupConfig): PopupInstance

// Регистрация триггера
PopupManager.registerTrigger(config: ITriggerConfig): void

// Открытие попапа по ID
PopupManager.open(popupId: string, trigger?: HTMLElement): void

// Закрытие попапа по ID
PopupManager.close(popupId: string): void

// Закрытие последнего открытого попапа
PopupManager.closeLast(): void

// Закрытие всех попапов
PopupManager.closeAll(): void

// Получение инстанса попапа
PopupManager.get(popupId: string): PopupInstance | undefined

// Получение всех зарегистрированных попапов
PopupManager.getAll(): PopupInstance[]

// Получение всех открытых попапов
PopupManager.getOpened(): PopupInstance[]

// Проверка, открыт ли попап
PopupManager.isOpened(popupId: string): boolean

// Удаление попапа из реестра
PopupManager.unregister(popupId: string): void

// Удаление триггера
PopupManager.unregisterTrigger(element: HTMLElement): void
```

### PopupInstance

Инстанс отдельного попапа.

#### Методы

```typescript
// Открытие попапа
popup.open(trigger?: HTMLElement): void

// Закрытие попапа
popup.close(): void

// Проверка состояния
popup.isOpen(): boolean

// Получение ID
popup.getId(): string

// Получение DOM элемента
popup.getElement(): HTMLElement

// Получение текущего триггера
popup.getCurrentTrigger(): HTMLElement | null

// Получение данных триггера (все data-popup-* атрибуты)
popup.getTriggerData(): Record<string, string> | null

// Уничтожение инстанса
popup.destroy(): void

// Подписка на события (наследуется от EventEmitter)
popup.on(event: string, callback: Function): void
popup.off(event: string, callback: Function): void
popup.once(event: string, callback: Function): void
```

### Вспомогательные функции

```typescript
import { initPopups, openPopup, closePopup, closeLastPopup, getPopup } from '@scripts/shared/lib/popup';

// Инициализация
initPopups();

// Открыть попап
openPopup('my-popup');

// Закрыть попап
closePopup('my-popup');

// Закрыть последний
closeLastPopup();

// Получить инстанс
const popup = getPopup('my-popup');
```

## Data-атрибуты

### Для триггеров

- `data-popup-id` - ID попапа, который нужно открыть (обязательный)
- `data-popup-*` - любые кастомные данные, которые будут доступны через `getTriggerData()`

**Примеры:**

```html
<!-- Простое открытие -->
<button data-popup-id="request-call">Заказать звонок</button>

<!-- С кастомными данными -->
<button data-popup-id="request-call" data-popup-title="Заказать окно" data-popup-product="Арктика">Заказать окно</button>
```

### Для попапов

- `data-close-button` - элемент, закрывающий попап при клике
- `data-close-overlay` - элемент overlay, закрывающий попап при клике на него

**Пример:**

```html
<div id="my-popup" class="popup">
	<div class="popup__overlay" data-close-overlay>
		<div class="popup__body">
			<button data-close-button>×</button>
			<!-- контент -->
		</div>
	</div>
</div>
```

## События

Попап генерирует следующие события:

- `beforeOpen` - перед открытием (можно отменить)
- `open` - после открытия
- `beforeClose` - перед закрытием (можно отменить)
- `close` - после закрытия

### Данные события (IPopupEventData)

```typescript
{
	popup: PopupInstance,        // Инстанс попапа
	trigger: HTMLElement | null, // Элемент-триггер
	triggerData: Record<string, string> | null // Data-атрибуты триггера
}
```

### Примеры подписки

```typescript
import { getPopup } from '@scripts/shared/lib/popup';

const popup = getPopup('my-popup');

if (popup) {
	// Подписка на открытие
	popup.on('open', data => {
		console.log('Попап открыт', data);
	});

	// Подписка на закрытие
	popup.on('close', data => {
		console.log('Попап закрыт', data);
	});

	// Одноразовая подписка
	popup.once('open', data => {
		console.log('Это сработает только один раз');
	});
}
```

## Конфигурация

### IPopupConfig

```typescript
interface IPopupConfig {
	id: string; // Уникальный ID попапа
	element: HTMLElement; // DOM элемент
	closeOnOverlay?: boolean; // Закрывать по overlay (default: true)
	closeOnEscape?: boolean; // Закрывать по Escape (default: true)
	lockBody?: boolean; // Блокировать скролл body (default: true)
	animationDuration?: number; // Длительность анимации в мс (default: 300)
}
```

### Ручная регистрация попапа

```typescript
import { PopupManager } from '@scripts/shared/lib/popup';

const element = document.getElementById('custom-popup')!;

const popup = PopupManager.register({
	id: 'custom-popup',
	element: element,
	closeOnOverlay: true,
	closeOnEscape: true,
	lockBody: true,
	animationDuration: 300,
});
```

## Регистрация кастомных триггеров

Можно зарегистрировать триггер с кастомной логикой:

```typescript
import { PopupManager } from '@scripts/shared/lib/popup';

const button = document.querySelector('.custom-button')!;

PopupManager.registerTrigger({
	element: button,
	popupId: 'my-popup',
	onBeforeOpen: data => {
		// Выполнится перед открытием
		console.log('Trigger data:', data.triggerData);

		// Можно отменить открытие
		if (someCondition) {
			return false;
		}
	},
	onOpen: data => {
		// Выполнится после открытия
		console.log('Popup opened!');
	},
});
```

## Примеры использования

### Пример 1: Программное открытие

```typescript
import { openPopup, closePopup } from '@scripts/shared/lib/popup';

// Открыть через 2 секунды
setTimeout(() => {
	openPopup('welcome-popup');
}, 2000);

// Закрыть через 5 секунд
setTimeout(() => {
	closePopup('welcome-popup');
}, 5000);
```

### Пример 2: Динамический title (use-case)

Реализация бизнес-требования - изменение заголовка попапа в зависимости от триггера:

```typescript
// src/scripts/features/popup-title-handler.ts
import { PopupManager } from '@scripts/shared/lib/popup';

export function initPopupTitleHandler() {
	const popups = PopupManager.getAll();

	popups.forEach(popup => {
		const element = popup.getElement();
		const titleElement = element.querySelector('.popup__title');

		if (!titleElement) return;

		// Сохраняем оригинальный заголовок
		const originalTitle = titleElement.textContent || '';

		// Перед открытием - проверяем data-popup-title
		popup.on('beforeOpen', data => {
			const customTitle = data.triggerData?.['title'];
			if (customTitle) {
				titleElement.textContent = customTitle;
			}
		});

		// При закрытии - восстанавливаем оригинал
		popup.on('close', () => {
			titleElement.textContent = originalTitle;
		});
	});
}

// main.ts
import { initPopups } from '@scripts/shared/lib/popup';
import { initPopupTitleHandler } from '@scripts/features/popup-title-handler';

initPopups();
initPopupTitleHandler();
```

HTML:

```html
<!-- Попап -->
<div id="request-call" class="popup">
	<div class="popup__overlay" data-close-overlay>
		<div class="popup__body">
			<button data-close-button>×</button>
			<h2 class="popup__title">Заказать звонок</h2>
			<!-- форма -->
		</div>
	</div>
</div>

<!-- Кнопка 1: title не меняется -->
<button data-popup-id="request-call">Заказать звонок</button>

<!-- Кнопка 2: title = "Заказать окно" -->
<button data-popup-id="request-call" data-popup-title="Заказать окно">Заказать окно</button>

<!-- Кнопка 3: title = "Заказать окно Арктика" -->
<button data-popup-id="request-call" data-popup-title="Заказать окно Арктика" data-popup-product="Арктика">Купить</button>
```

### Пример 3: Предзаполнение формы данными

```typescript
import { PopupManager } from '@scripts/shared/lib/popup';

const popup = PopupManager.get('contact-form');

if (popup) {
	popup.on('open', data => {
		const form = popup.getElement().querySelector('form');
		const productField = form?.querySelector('[name="product"]') as HTMLInputElement;

		// Берём данные из триггера
		const product = data.triggerData?.['product'];

		if (product && productField) {
			productField.value = product;
		}
	});
}
```

### Пример 4: Закрытие по клавише Escape только для последнего попапа

```typescript
import { PopupManager } from '@scripts/shared/lib/popup';

// Глобальный обработчик Escape
document.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		PopupManager.closeLast();
	}
});
```

## HTML Требования

Базовая структура попапа должна быть следующей:

```html
<div id="unique-popup-id" class="popup">
	<div class="popup__overlay" data-close-overlay>
		<div class="popup__body">
			<button class="popup__close" data-close-button>×</button>
			<!-- Контент попапа -->
		</div>
	</div>
</div>
```

**Обязательные элементы:**

- `.popup` - корневой элемент с уникальным `id`
- `[data-close-overlay]` - элемент, по клику на который закрывается попап
- `.popup__body` - контейнер контента
- `[data-close-button]` - кнопка закрытия

## CSS Классы

### Используемые библиотекой

- `.popup` - корневой класс попапа
- `.popup_opened` - добавляется при открытии попапа
- `.body-locked` - добавляется к `<body>` при блокировке скролла

### CSS переменные (опционально)

```css
:root {
	--popup-animation-duration: 300ms;
	--popup-z-index: 1000;
}
```

## Принципы работы

1. **Универсальность**: Библиотека не содержит бизнес-логики, только core функционал
2. **Расширяемость**: Вся кастомная логика реализуется через события и API
3. **Data-driven**: Передача данных через data-атрибуты и события
4. **Стек попапов**: Корректная работа с несколькими открытыми попапами
5. **Производительность**: Минимальные манипуляции с DOM

## TypeScript Types

```typescript
import type { IPopupConfig, IPopupEventData, ITriggerConfig, PopupEventCallback } from '@scripts/shared/lib/popup';
```

## Лицензия

Внутренняя библиотека проекта aknova.
