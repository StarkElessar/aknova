# План разработки функционала Popup Manager

## Краткое описание задачи

Разработать универсальную систему управления модальными окнами (попапами) с возможностью:
- Открытия/закрытия попапов через data-атрибуты
- Программного управления через публичное API
- Подписки на события открытия/закрытия
- Регистрации кастомных обработчиков для триггеров
- Динамического изменения контента попапа (например, title) в зависимости от триггера

## Архитектура решения

### Структура модулей

```
src/scripts/shared/lib/popup/
├── index.ts              # Публичный API и экспорты
├── constants.ts          # Все строковые константы
├── types.ts              # TypeScript типы и интерфейсы
├── popup-instance.ts     # Класс PopupInstance - управление одним попапом
├── popup-manager.ts      # Класс PopupManager - глобальный менеджер
├── event-emitter.ts      # Класс EventEmitter - система событий
└── utils.ts              # Вспомогательные функции
```

## Детальный план разработки

### Этап 1: Подготовка инфраструктуры

- [ ] **1.1. Создать файл `constants.ts`**
  - Определить константы для data-атрибутов:
    - `DATA_POPUP_ID` = `'data-popup-id'`
    - `DATA_POPUP_TITLE` = `'data-popup-title'`
    - `DATA_CLOSE_BUTTON` = `'data-close-button'`
    - `DATA_CLOSE_OVERLAY` = `'data-close-overlay'`
  - Определить константы для CSS-классов:
    - `POPUP_CLASS` = `'popup'`
    - `POPUP_OPENED_CLASS` = `'popup_opened'`
    - `BODY_LOCKED_CLASS` = `'body-locked'`
  - Определить константы для событий:
    - `EVENT_BEFORE_OPEN` = `'beforeOpen'`
    - `EVENT_OPEN` = `'open'`
    - `EVENT_BEFORE_CLOSE` = `'beforeClose'`
    - `EVENT_CLOSE` = `'close'`
  - Определить прочие константы:
    - `ESCAPE_KEY` = `'Escape'`
    - `ANIMATION_DURATION` = `300`

- [ ] **1.2. Создать файл `types.ts`**
  - Интерфейс `IPopupConfig`:
    - `id: string` - уникальный идентификатор попапа
    - `element: HTMLElement` - DOM элемент попапа
    - `closeOnOverlay?: boolean` - закрывать при клике на overlay (по умолчанию true)
    - `closeOnEscape?: boolean` - закрывать по клавише Escape (по умолчанию true)
    - `lockBody?: boolean` - блокировать скролл body при открытии (по умолчанию true)
    - `animationDuration?: number` - длительность анимации в мс
  - Интерфейс `IPopupEventData`:
    - `popup: PopupInstance` - инстанс попапа
    - `trigger: HTMLElement | null` - элемент-триггер (если открыто через триггер)
    - `triggerData: Record<string, string> | null` - все data-атрибуты триггера
  - Интерфейс `ITriggerConfig`:
    - `element: HTMLElement` - элемент-триггер
    - `popupId: string` - ID попапа
    - `onBeforeOpen?: (data: IPopupEventData) => void | boolean` - коллбэк перед открытием
    - `onOpen?: (data: IPopupEventData) => void` - коллбэк после открытия
  - Тип `PopupEventCallback = (data: IPopupEventData) => void`

### Этап 2: Реализация системы событий

- [ ] **2.1. Создать файл `event-emitter.ts`**
  - Класс `EventEmitter`:
    - Приватное поле `listeners: Map<string, Set<Function>>`
    - Метод `on(event: string, callback: Function): void` - подписка на событие
    - Метод `off(event: string, callback: Function): void` - отписка от события
    - Метод `emit(event: string, data: any): void` - генерация события
    - Метод `once(event: string, callback: Function): void` - подписка на одно срабатывание
    - Метод `clear(): void` - очистка всех подписчиков

### Этап 3: Реализация PopupInstance

- [ ] **3.1. Создать файл `popup-instance.ts`**
  - Класс `PopupInstance extends EventEmitter`:
    - **Приватные поля:**
      - `id: string` - уникальный ID
      - `element: HTMLElement` - DOM элемент попапа
      - `config: IPopupConfig` - конфигурация
      - `isOpened: boolean` - флаг состояния
      - `overlayElement: HTMLElement | null` - элемент overlay
      - `closeButtons: HTMLElement[]` - кнопки закрытия
      - `currentTrigger: HTMLElement | null` - текущий триггер
      - `currentTriggerData: Record<string, string> | null` - данные текущего триггера
    
    - **Публичные методы:**
      - `constructor(config: IPopupConfig)` - инициализация
      - `open(trigger?: HTMLElement): void` - открытие попапа
      - `close(): void` - закрытие попапа
      - `isOpen(): boolean` - проверка состояния
      - `getId(): string` - получение ID
      - `getElement(): HTMLElement` - получение DOM элемента
      - `getCurrentTrigger(): HTMLElement | null` - получение текущего триггера
      - `getTriggerData(): Record<string, string> | null` - получение данных триггера
      - `destroy(): void` - уничтожение инстанса
    
    - **Приватные методы:**
      - `init(): void` - инициализация DOM и обработчиков
      - `findElements(): void` - поиск вложенных элементов (overlay, close buttons)
      - `bindEvents(): void` - привязка обработчиков событий
      - `unbindEvents(): void` - отвязка обработчиков
      - `handleOverlayClick(event: MouseEvent): void` - обработчик клика на overlay
      - `handleCloseButtonClick(event: MouseEvent): void` - обработчик кнопки закрытия
      - `handleEscapeKey(event: KeyboardEvent): void` - обработчик клавиши Escape
      - `saveTriggerData(trigger: HTMLElement): void` - сохранение данных триггера
      - `clearTriggerData(): void` - очистка данных триггера
      - `lockBody(): void` - блокировка скролла body
      - `unlockBody(): void` - разблокировка скролла body
      - `addOpenedClass(): void` - добавление класса открытия
      - `removeOpenedClass(): void` - удаление класса открытия

### Этап 4: Реализация PopupManager

- [ ] **4.1. Создать файл `popup-manager.ts`**
  - Класс `PopupManager`:
    - **Приватные статические поля:**
      - `instance: PopupManager | null` - Singleton инстанс
      - `popups: Map<string, PopupInstance>` - коллекция зарегистрированных попапов
      - `triggers: Map<HTMLElement, ITriggerConfig>` - коллекция триггеров
      - `openedStack: PopupInstance[]` - стек открытых попапов
      - `isInitialized: boolean` - флаг инициализации
    
    - **Публичные статические методы:**
      - `getInstance(): PopupManager` - получение Singleton инстанса
      - `init(): void` - глобальная инициализация (сканирование DOM, привязка триггеров)
      - `register(config: IPopupConfig): PopupInstance` - регистрация попапа
      - `registerTrigger(config: ITriggerConfig): void` - регистрация триггера
      - `unregister(popupId: string): void` - удаление попапа из реестра
      - `unregisterTrigger(element: HTMLElement): void` - удаление триггера
      - `open(popupId: string, trigger?: HTMLElement): void` - открытие попапа по ID
      - `close(popupId: string): void` - закрытие попапа по ID
      - `closeLast(): void` - закрытие последнего открытого попапа
      - `closeAll(): void` - закрытие всех попапов
      - `get(popupId: string): PopupInstance | undefined` - получение инстанса попапа
      - `getAll(): PopupInstance[]` - получение всех зарегистрированных попапов
      - `getOpened(): PopupInstance[]` - получение всех открытых попапов
      - `isOpened(popupId: string): boolean` - проверка, открыт ли попап
    
    - **Приватные статические методы:**
      - `constructor()` - приватный конструктор для Singleton
      - `scanDOM(): void` - сканирование DOM для поиска попапов и триггеров
      - `findPopups(): HTMLElement[]` - поиск всех элементов с классом popup
      - `findTriggers(): HTMLElement[]` - поиск всех элементов с data-popup-id
      - `autoRegisterPopups(): void` - автоматическая регистрация найденных попапов
      - `autoRegisterTriggers(): void` - автоматическая регистрация найденных триггеров
      - `getTriggerData(element: HTMLElement): Record<string, string>` - извлечение data-атрибутов
      - `addToStack(popup: PopupInstance): void` - добавление в стек открытых
      - `removeFromStack(popup: PopupInstance): void` - удаление из стека
      - `handlePopupOpen(popup: PopupInstance): void` - обработчик открытия попапа
      - `handlePopupClose(popup: PopupInstance): void` - обработчик закрытия попапа
      - `bindGlobalEscapeHandler(): void` - привязка глобального обработчика Escape
      - `unbindGlobalEscapeHandler(): void` - отвязка глобального обработчика Escape

### Этап 5: Вспомогательные утилиты

- [ ] **5.1. Создать файл `utils.ts`**
  - Функции:
    - `generateId(prefix = 'popup'): string` - генерация уникального ID
    - `isHTMLElement(element: any): element is HTMLElement` - проверка типа
    - `getDataAttributes(element: HTMLElement, prefix?: string): Record<string, string>` - получение data-атрибутов
    - `debounce(fn: Function, delay: number): Function` - debounce функция
    - `focusTrap(element: HTMLElement): void` - ловушка фокуса внутри элемента
    - `getScrollbarWidth(): number` - получение ширины scrollbar

### Этап 6: Публичное API

- [ ] **6.1. Создать файл `index.ts`**
  - Экспорты:
    - `export { PopupManager } from './popup-manager'`
    - `export { PopupInstance } from './popup-instance'`
    - `export * from './types'`
    - `export * from './constants'`
  - Функции-обёртки для удобства:
    - `export const initPopups = () => PopupManager.init()`
    - `export const openPopup = (id: string) => PopupManager.open(id)`
    - `export const closePopup = (id: string) => PopupManager.close(id)`
    - `export const closeLastPopup = () => PopupManager.closeLast()`
    - `export const getPopup = (id: string) => PopupManager.get(id)`

### Этап 7: Интеграция в проект

- [ ] **7.1. Добавить инициализацию в `main.ts`**
  - Импортировать `initPopups` из popup модуля
  - Вызвать `initPopups()` при загрузке страницы
  - Добавить в `window` для отладки (опционально):
    ```typescript
    if (import.meta.env.DEV) {
      window.popupManager = PopupManager.getInstance();
    }
    ```

- [ ] **7.2. Обновить HTML структуру попапов**
  - Добавить уникальный `id` для каждого попапа
  - Убедиться, что структура соответствует:
    ```html
    <div id="popup-id" class="popup">
      <div class="popup__overlay" data-close-overlay>
        <div class="popup__body">
          <button class="popup__close" data-close-button>×</button>
          <div class="popup__title">Заголовок</div>
          <!-- контент попапа -->
        </div>
      </div>
    </div>
    ```

- [ ] **7.3. Добавить data-атрибуты на триггеры**
  - Пример для простого открытия:
    ```html
    <button data-popup-id="request-call">Заказать звонок</button>
    ```
  - Пример с кастомным заголовком:
    ```html
    <button 
      data-popup-id="request-call" 
      data-popup-title="Заказать окно">
      Заказать окно
    </button>
    ```
  - Пример с дополнительными данными:
    ```html
    <button 
      data-popup-id="request-call" 
      data-popup-title="Заказать окно и модель Арктика"
      data-popup-product="Арктика">
      Заказать
    </button>
    ```

### Этап 8: Пример реализации use-case (динамический title)

> **Важно:** Этот этап демонстрирует, как использовать библиотеку для реализации конкретного бизнес-требования. 
> Сама библиотека остаётся универсальной и не содержит специфичной бизнес-логики.

- [ ] **8.1. Создать файл примера `src/scripts/features/popup-title-handler.ts`**
  - Это будет отдельный модуль, использующий popup библиотеку
  - Функция `initPopupTitleHandler()`:
    - Получить все зарегистрированные попапы через PopupManager
    - Для каждого попапа подписаться на события `beforeOpen` и `close`
    - В `beforeOpen`:
      - Проверить наличие `data-popup-title` в `triggerData`
      - Если есть - обновить title попапа
      - Сохранить оригинальный title в data-атрибуте попапа
    - В `close`:
      - Восстановить оригинальный title из data-атрибута

- [ ] **8.2. Пример кода реализации**
  ```typescript
  // src/scripts/features/popup-title-handler.ts
  import { PopupManager } from '@scripts/shared/lib/popup';
  
  export function initPopupTitleHandler() {
    const manager = PopupManager.getInstance();
    
    manager.on('popupRegistered', ({ popup }) => {
      const element = popup.getElement();
      const titleElement = element.querySelector('.popup__title');
      
      if (!titleElement) return;
      
      // Сохраняем оригинальный title
      const originalTitle = titleElement.textContent || '';
      element.dataset.originalTitle = originalTitle;
      
      popup.on('beforeOpen', (data) => {
        const customTitle = data.triggerData?.['popup-title'];
        if (customTitle && titleElement) {
          titleElement.textContent = customTitle;
        }
      });
      
      popup.on('close', () => {
        const original = element.dataset.originalTitle;
        if (original && titleElement) {
          titleElement.textContent = original;
        }
      });
    });
  }
  ```

- [ ] **8.3. Добавить инициализацию в `main.ts`**
  ```typescript
  import { initPopups } from '@scripts/shared/lib/popup';
  import { initPopupTitleHandler } from '@scripts/features/popup-title-handler';
  
  initPopups();
  initPopupTitleHandler(); // Подключаем кастомную логику
  ```

### Этап 9: Стилизация и CSS

- [ ] **9.1. Обновить `src/styles/components/popup.scss`**
  - Базовые стили для `.popup`:
    - `display: none` по умолчанию
    - `position: fixed; top: 0; left: 0; width: 100%; height: 100%;`
    - `z-index: 1000`
  - Стили для `.popup_opened`:
    - `display: block` или `display: flex`
  - Стили для `.popup__overlay`:
    - Полупрозрачный фон
    - Анимация fade-in/fade-out
  - Стили для `.popup__body`:
    - Центрирование
    - Анимация scale/fade
  - Стили для `.body-locked`:
    - `overflow: hidden`
    - Компенсация ширины scrollbar через padding

- [ ] **9.2. Добавить CSS переменные для кастомизации**
  - `--popup-overlay-bg: rgba(0, 0, 0, 0.5)`
  - `--popup-animation-duration: 300ms`
  - `--popup-z-index: 1000`

### Этап 10: Документация

- [ ] **10.1. Создать README.md в `src/scripts/shared/lib/popup/`**
  - **Описание библиотеки**: что это, для чего, основные концепции
  - **Быстрый старт**: минимальный пример использования
  - **Публичное API**:
    - PopupManager методы: `init()`, `register()`, `open()`, `close()`, `closeLast()`, `get()`
    - PopupInstance методы: `open()`, `close()`, `isOpen()`, `getId()`, `getElement()`, `getTriggerData()`
    - EventEmitter методы: `on()`, `off()`, `once()`
  - **Data-атрибуты**:
    - `data-popup-id` - ID попапа для открытия
    - `data-close-button` - кнопка закрытия
    - `data-close-overlay` - закрытие по overlay
    - Кастомные `data-popup-*` - передача произвольных данных
  - **События**:
    - `beforeOpen` - перед открытием (можно отменить)
    - `open` - после открытия
    - `beforeClose` - перед закрытием (можно отменить)
    - `close` - после закрытия
  - **Примеры использования**:
    - Автоматическая инициализация
    - Программное открытие/закрытие
    - Подписка на события
    - Регистрация кастомных триггеров
    - Реализация use-case (динамический title) - ссылка на `popup-title-handler.ts`
  - **HTML структура**: требования к разметке попапа
  - **CSS классы**: описание используемых классов

## Итоговая структура файлов

```
src/scripts/shared/lib/popup/
├── index.ts              (публичное API, ~50 строк)
├── constants.ts          (все константы, ~30 строк)
├── types.ts              (TypeScript типы, ~60 строк)
├── event-emitter.ts      (система событий, ~80 строк)
├── popup-instance.ts     (управление попапом, ~300 строк)
├── popup-manager.ts      (глобальный менеджер, ~250 строк)
├── utils.ts              (утилиты, ~100 строк)
└── README.md             (документация)
```

## Примеры использования (после реализации)

### Автоматическая инициализация

```typescript
// main.ts
import { initPopups } from '@scripts/shared/lib/popup';

initPopups(); // Автоматически найдёт все попапы и триггеры
```

### HTML разметка

```html
<!-- Попап -->
<div id="request-call-popup" class="popup">
  <div class="popup__overlay" data-close-overlay>
    <div class="popup__body">
      <button class="popup__close" data-close-button>×</button>
      <h2 class="popup__title">Заказать звонок</h2>
      <!-- контент -->
    </div>
  </div>
</div>

<!-- Триггеры -->
<button data-popup-id="request-call-popup">
  Заказать звонок
</button>

<button 
  data-popup-id="request-call-popup" 
  data-popup-title="Заказать окно Арктика">
  Заказать окно
</button>
```

### Программное использование

```typescript
import { openPopup, closePopup, getPopup, PopupManager } from '@scripts/shared/lib/popup';

// Открыть попап
openPopup('request-call-popup');

// Закрыть попап
closePopup('request-call-popup');

// Закрыть последний открытый
PopupManager.closeLast();

// Получить инстанс и подписаться на события
const popup = getPopup('request-call-popup');
if (popup) {
  popup.on('open', (data) => {
    console.log('Попап открыт', data);
  });
  
  popup.on('close', (data) => {
    console.log('Попап закрыт', data);
  });
}
```

### Регистрация кастомного триггера

```typescript
import { PopupManager } from '@scripts/shared/lib/popup';

const button = document.querySelector('.custom-button');

PopupManager.registerTrigger({
  element: button,
  popupId: 'request-call-popup',
  onBeforeOpen: (data) => {
    // Можно отменить открытие, вернув false
    if (someCondition) {
      return false;
    }
    
    // Получаем данные из триггера
    console.log('Trigger data:', data.triggerData);
  },
  onOpen: (data) => {
    // Кастомная логика после открытия
    console.log('Попап открыт с триггера:', data.trigger);
  }
});
```

### Реализация динамического title (use-case)

```typescript
// src/scripts/features/popup-title-handler.ts
import { PopupManager } from '@scripts/shared/lib/popup';

export function initPopupTitleHandler() {
  const manager = PopupManager.getInstance();
  const popups = manager.getAll(); // Получаем все зарегистрированные попапы
  
  popups.forEach(popup => {
    const element = popup.getElement();
    const titleElement = element.querySelector('.popup__title');
    
    if (!titleElement) return;
    
    // Сохраняем оригинальный title
    const originalTitle = titleElement.textContent || '';
    
    popup.on('beforeOpen', (data) => {
      // Проверяем data-popup-title в триггере
      const customTitle = data.triggerData?.['popup-title'];
      if (customTitle) {
        titleElement.textContent = customTitle;
      }
    });
    
    popup.on('close', () => {
      // Восстанавливаем оригинальный заголовок
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

## Критерии завершения

- ✅ Все файлы библиотеки созданы и реализованы
- ✅ Попапы открываются/закрываются через data-атрибуты
- ✅ Публичное API работает корректно
- ✅ Система событий работает
- ✅ Стек попапов работает корректно
- ✅ Скролл body блокируется при открытии
- ✅ Все строки вынесены в константы
- ✅ Код покрыт TypeScript типами
- ✅ Библиотека универсальна и не содержит бизнес-логики
- ✅ Документация написана с примерами
- ✅ Создан пример use-case (popup-title-handler.ts)

## Принципы разработки библиотеки

- **Универсальность**: Библиотека не должна знать о специфичных бизнес-требованиях
- **Расширяемость**: Предоставить API для реализации любых use-case снаружи
- **События**: Все ключевые моменты должны генерировать события для подписки
- **Data-driven**: Передача данных через data-атрибуты и события
- **Минимализм**: Только core функционал, всё остальное - через расширения

## Заметки

- Следовать соглашениям именования проекта (kebab-case для файлов)
- Использовать существующие утилиты проекта где возможно
- Минимизировать зависимости, использовать vanilla JS/TS
- Учитывать производительность при работе с DOM
- Обеспечить обратную совместимость с существующими попапами
- Бизнес-логика реализуется отдельными модулями в `src/scripts/features/`
