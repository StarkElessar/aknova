# Fancybox Loader

Обёртка для библиотеки [Fancybox](https://fancyapps.com/fancybox/) с ленивой загрузкой, автоматическим определением галерей и поддержкой виртуальных галерей.

## Содержание

- [Основные возможности](#основные-возможности)
- [Быстрый старт](#быстрый-старт)
- [API](#api)
- [Примеры использования](#примеры-использования)
- [Виртуальные галереи](#виртуальные-галереи)
- [Кастомизация](#кастомизация)
- [Производительность](#производительность)

## Основные возможности

- ✅ **Ленивая загрузка** - CSS и JS загружаются только при первом клике
- ✅ **Автоматические галереи** - элементы с одинаковым атрибутом объединяются в галерею
- ✅ **Виртуальные галереи** - создание галерей программно без DOM-элементов
- ✅ **Singleton паттерн** - гарантирует единственный экземпляр
- ✅ **Loader UI** - индикатор загрузки при первом открытии
- ✅ **Thumbnails** - автоматическое извлечение превью из `<img>`
- ✅ **Гибкая настройка** - полная поддержка опций Fancybox

## Быстрый старт

### 1. Подготовка HTML

```html
<!-- Галерея продуктов -->
<a href="/images/product-1-full.jpg" data-fancybox="products">
	<img src="/images/product-1-thumb.jpg" alt="Продукт 1" />
</a>

<a href="/images/product-2-full.jpg" data-fancybox="products">
	<img src="/images/product-2-thumb.jpg" alt="Продукт 2" />
</a>

<a href="/images/product-3-full.jpg" data-fancybox="products">
	<img src="/images/product-3-thumb.jpg" alt="Продукт 3" />
</a>

<!-- Отдельная галерея -->
<a href="/images/gallery-1.jpg" data-fancybox="gallery">
	<img src="/images/gallery-1-thumb.jpg" alt="Фото 1" />
</a>

<a href="/images/gallery-2.jpg" data-fancybox="gallery">
	<img src="/images/gallery-2-thumb.jpg" alt="Фото 2" />
</a>
```

### 2. Инициализация в JavaScript

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

// Базовая инициализация
FancyboxLoader.init();
```

Вот и всё! Теперь клик по любой ссылке с `data-fancybox` откроет галерею.

## API

### FancyboxLoader.init(options?)

Инициализирует Fancybox Loader с заданными опциями. Возвращает singleton-экземпляр.

```typescript
const loader = FancyboxLoader.init({
	containerDataAttr: 'data-fancybox',
	cssUrl: '/path/to/fancybox.css',
	fancyboxOptions: {
		// Опции Fancybox
	},
	loaderTemplate: null,
	virtualGalleryItems: []
});
```

### FancyboxLoaderOptions

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `containerDataAttr` | `string` | `'data-fancybox'` | Атрибут для группировки элементов в галереи |
| `cssUrl` | `string` | `fancybox.scss?url` | URL файла стилей Fancybox |
| `fancyboxOptions` | `Partial<FancyboxOptions>` | `{ Carousel: { Thumbs: { type: 'classic' } } }` | Опции Fancybox |
| `loaderTemplate` | `null \| () => UnmountLoader` | `null` | Кастомный шаблон загрузчика |
| `virtualGalleryItems` | `IVirtualGalleryItem[]` | `[]` | Виртуальные галереи |

### Методы экземпляра

#### addVirtualGallery(virtualGalleryItem)

Добавляет виртуальную галерею к существующему экземпляру.

```typescript
const loader = FancyboxLoader.init();

loader.addVirtualGallery({
	galleryContainerAttr: 'dynamic-gallery',
	images: [
		{ src: '/images/1.jpg', thumbSrc: '/images/1-thumb.jpg' },
		{ src: '/images/2.jpg', thumbSrc: '/images/2-thumb.jpg' }
	]
});
```

### Типы

#### ThumbImage

```typescript
interface ThumbImage {
	src: string;           // URL полноразмерного изображения
	thumbSrc?: string;     // URL превью (опционально)
	caption?: string;      // Подпись к изображению (опционально)
	thumbAlt?: string;     // Alt для превью (опционально)
	thumbClass?: string;   // CSS-класс для превью (опционально)
}
```

#### IVirtualGalleryItem

```typescript
interface IVirtualGalleryItem {
	galleryContainerAttr: string;  // Значение атрибута для связи с триггером
	images: ThumbImage[];          // Массив изображений галереи
}
```

## Примеры использования

### Пример 1: Базовая галерея

```html
<div class="product-gallery">
	<a href="/images/product-1.jpg" data-fancybox="product-photos">
		<img src="/images/product-1-thumb.jpg" alt="Вид спереди" />
	</a>
	<a href="/images/product-2.jpg" data-fancybox="product-photos">
		<img src="/images/product-2-thumb.jpg" alt="Вид сбоку" />
	</a>
	<a href="/images/product-3.jpg" data-fancybox="product-photos">
		<img src="/images/product-3-thumb.jpg" alt="Вид сзади" />
	</a>
</div>
```

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init();
```

### Пример 2: Несколько независимых галерей

```html
<!-- Галерея 1: Окна -->
<div class="windows-gallery">
	<a href="/images/window-1.jpg" data-fancybox="windows">
		<img src="/images/window-1-thumb.jpg" alt="" />
	</a>
	<a href="/images/window-2.jpg" data-fancybox="windows">
		<img src="/images/window-2-thumb.jpg" alt="" />
	</a>
</div>

<!-- Галерея 2: Балконы -->
<div class="balconies-gallery">
	<a href="/images/balcony-1.jpg" data-fancybox="balconies">
		<img src="/images/balcony-1-thumb.jpg" alt="" />
	</a>
	<a href="/images/balcony-2.jpg" data-fancybox="balconies">
		<img src="/images/balcony-2-thumb.jpg" alt="" />
	</a>
</div>
```

При клике на изображение окна откроется галерея только с окнами, при клике на балкон - только балконы.

### Пример 3: Кастомный атрибут галереи

```html
<a href="/image1.jpg" data-gallery="my-photos">
	<img src="/image1-thumb.jpg" alt="" />
</a>
<a href="/image2.jpg" data-gallery="my-photos">
	<img src="/image2-thumb.jpg" alt="" />
</a>
```

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init({
	containerDataAttr: 'data-gallery'
});
```

### Пример 4: С настройками Fancybox

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init({
	fancyboxOptions: {
		// Анимация
		showClass: 'f-fadeIn',
		hideClass: 'f-fadeOut',

		// Carousel настройки
		Carousel: {
			infinite: true,
			Thumbs: {
				type: 'classic'
			}
		},

		// Toolbar кнопки
		Toolbar: {
			display: {
				left: ['infobar'],
				middle: [],
				right: ['slideshow', 'thumbs', 'close']
			}
		},

		// Поведение
		Hash: false,
		dragToClose: true,

		// Callbacks
		on: {
			done: (fancybox, slide) => {
				console.log('Слайд открыт:', slide);
			}
		}
	}
});
```

### Пример 5: Без превью (lazy loading)

```html
<a href="/images/photo-1.jpg" data-fancybox="lazy-gallery">
	<img src="#" data-src="/images/photo-1-thumb.jpg" alt="" />
</a>
<a href="/images/photo-2.jpg" data-fancybox="lazy-gallery">
	<img src="#" data-src="/images/photo-2-thumb.jpg" alt="" />
</a>
```

FancyboxLoader автоматически извлечёт превью из `data-src` или `srcset`.

### Пример 6: Инициализация в табах

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';
import { TabsSE } from '@scripts/shared/lib/tabs-se';

new TabsSE('product-tabs', {
	onLoaded: () => {
		// Инициализируем Fancybox после загрузки табов
		FancyboxLoader.init();
	}
});
```

## Виртуальные галереи

Виртуальные галереи позволяют создавать галереи программно, без необходимости создавать все элементы в DOM.

### Пример 1: Базовая виртуальная галерея

```html
<!-- Только один триггер в DOM -->
<button data-fancybox="virtual-gallery">
	Открыть галерею (50 фото)
</button>
```

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

// Генерируем массив изображений программно
const images = Array.from({ length: 50 }, (_, i) => ({
	src: `/images/gallery/photo-${i + 1}.jpg`,
	thumbSrc: `/images/gallery/photo-${i + 1}-thumb.jpg`,
	caption: `Фотография ${i + 1}`
}));

FancyboxLoader.init({
	virtualGalleryItems: [
		{
			galleryContainerAttr: 'virtual-gallery',
			images
		}
	]
});
```

### Пример 2: Динамическое добавление виртуальной галереи

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

// Первоначальная инициализация
const loader = FancyboxLoader.init();

// Позже, например, после загрузки данных с API
fetch('/api/gallery/123')
	.then(res => res.json())
	.then(data => {
		loader.addVirtualGallery({
			galleryContainerAttr: 'api-gallery',
			images: data.images.map(img => ({
				src: img.fullUrl,
				thumbSrc: img.thumbUrl,
				caption: img.title
			}))
		});
	});
```

```html
<button data-fancybox="api-gallery">
	Открыть загруженную галерею
</button>
```

### Пример 3: Виртуальная галерея с данными из JSON

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';
import galleryData from '@data/accessories.json';

const loader = FancyboxLoader.init();

galleryData.forEach(category => {
	loader.addVirtualGallery({
		galleryContainerAttr: `category-${category.id}`,
		images: category.photos.map(photo => ({
			src: photo.url,
			thumbSrc: photo.thumbnail,
			caption: photo.description
		}))
	});
});
```

```html
<button data-fancybox="category-1">Категория 1</button>
<button data-fancybox="category-2">Категория 2</button>
```

### Пример 4: Комбинация реальной и виртуальной галерей

```html
<!-- Реальная галерея -->
<a href="/images/real-1.jpg" data-fancybox="real-gallery">
	<img src="/images/real-1-thumb.jpg" alt="" />
</a>

<!-- Виртуальная галерея -->
<button data-fancybox="virtual-gallery">
	Открыть виртуальную галерею
</button>
```

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init({
	virtualGalleryItems: [
		{
			galleryContainerAttr: 'virtual-gallery',
			images: [
				{ src: '/images/virtual-1.jpg' },
				{ src: '/images/virtual-2.jpg' }
			]
		}
	]
});
```

## Кастомизация

### Кастомный loader

По умолчанию используется простая белая анимированная overlay. Вы можете заменить её своим loader'ом:

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init({
	loaderTemplate: () => {
		// Создаём элементы loader'а
		const loader = document.createElement('div');
		loader.className = 'custom-loader';
		loader.innerHTML = `
			<div class="spinner"></div>
			<p>Загрузка галереи...</p>
		`;

		document.body.appendChild(loader);

		// Возвращаем функцию для удаления loader'а
		return () => {
			loader.remove();
		};
	}
});
```

### Кастомные стили

```typescript
import customFancyboxCss from '@styles/custom-fancybox.scss?url';
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init({
	cssUrl: customFancyboxCss,
	fancyboxOptions: {
		// Переопределяем классы анимации
		showClass: 'custom-fade-in',
		hideClass: 'custom-fade-out'
	}
});
```

### Расширенные опции Fancybox

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init({
	fancyboxOptions: {
		// Клавиатурная навигация
		Keyboard: {
			Escape: 'close',
			Delete: 'close',
			Backspace: 'close',
			PageUp: 'prev',
			PageDown: 'next',
			ArrowUp: 'prev',
			ArrowDown: 'next',
			ArrowLeft: 'prev',
			ArrowRight: 'next'
		},

		// Toolbar
		Toolbar: {
			display: {
				left: ['infobar'],
				middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
				right: ['slideshow', 'thumbs', 'close']
			}
		},

		// Fullscreen
		Fullscreen: {
			autoStart: false
		},

		// Images
		Images: {
			zoom: true,
			Panzoom: {
				maxScale: 3
			}
		},

		// Carousel
		Carousel: {
			infinite: true,
			transition: 'slide',
			friction: 0.8,
			Thumbs: {
				type: 'classic',
				Carousel: {
					slidesPerPage: 1,
					fill: true,
					center: true
				}
			}
		}
	}
});
```

## Производительность

### Ленивая загрузка

FancyboxLoader **не загружает** CSS и JavaScript Fancybox до первого клика по галерее. Это улучшает:

- **Время первой загрузки страницы** (FCP, LCP)
- **Размер первоначального бундла**
- **Время интерактивности** (TTI)

### Singleton паттерн

Класс использует Singleton паттерн - гарантирует, что создаётся только один экземпляр:

```typescript
const loader1 = FancyboxLoader.init();
const loader2 = FancyboxLoader.init(); // Вернёт тот же экземпляр

console.log(loader1 === loader2); // true
```

### Code splitting

Fancybox загружается через динамический import:

```typescript
const Fancybox = await import('@fancyapps/ui').then(m => m.Fancybox);
```

Это создаёт отдельный chunk, который загружается только при необходимости.

### Оптимизация изображений

Используйте `thumbSrc` для превью:

```typescript
{
	src: '/images/photo-full-4k.jpg',      // 5MB, 4000x3000
	thumbSrc: '/images/photo-thumb.jpg'    // 50KB, 400x300
}
```

## Как это работает

1. **Инициализация**: При вызове `FancyboxLoader.init()` на `document` вешается глобальный обработчик клика
2. **Клик**: При клике проверяется, есть ли у элемента атрибут `data-fancybox` (или кастомный)
3. **Определение галереи**:
   - Проверяется, есть ли виртуальная галерея с таким значением атрибута
   - Если нет - собираются все элементы с таким же значением атрибута из DOM
4. **Загрузка**: Асинхронно загружаются CSS и JS Fancybox (только при первом открытии)
5. **Показ loader**: Пока идёт загрузка, показывается индикатор
6. **Открытие**: После загрузки открывается галерея на нужном слайде

## Требования

### Зависимости

```json
{
	"dependencies": {
		"@fancyapps/ui": "^5.0.0"
	}
}
```

### HTML структура

Минимальная структура для работы:

```html
<a href="[FULL_IMAGE_URL]" data-fancybox="[GALLERY_NAME]">
	<img src="[THUMB_IMAGE_URL]" alt="" />
</a>
```

Где:
- `href` - URL полноразмерного изображения
- `data-fancybox` - значение для группировки в галерею
- `<img>` - превью (опционально, но рекомендуется)

## Отладка

Включите логирование для отслеживания работы:

```typescript
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

FancyboxLoader.init({
	fancyboxOptions: {
		on: {
			init: (fancybox) => {
				console.log('Fancybox инициализирован', fancybox);
			},
			ready: (fancybox) => {
				console.log('Fancybox готов', fancybox);
			},
			'Carousel.createSlide': (fancybox, carousel, slide) => {
				console.log('Слайд создан', slide);
			},
			done: (fancybox, slide) => {
				console.log('Слайд показан', slide);
			},
			close: (fancybox) => {
				console.log('Fancybox закрыт');
			}
		}
	}
});
```

## Часто задаваемые вопросы

### Почему галерея не открывается?

1. Проверьте, что FancyboxLoader инициализирован
2. Убедитесь, что элемент имеет корректный атрибут (по умолчанию `data-fancybox`)
3. Проверьте, что `href` указывает на корректный URL изображения
4. Откройте DevTools и проверьте консоль на наличие ошибок

### Как добавить видео в галерею?

```html
<a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" data-fancybox="media">
	<img src="/images/video-thumb.jpg" alt="" />
</a>

<a href="/images/photo.jpg" data-fancybox="media">
	<img src="/images/photo-thumb.jpg" alt="" />
</a>
```

Fancybox автоматически определит тип контента.

### Можно ли использовать без превью?

Да, но это не рекомендуется для UX:

```html
<a href="/images/photo.jpg" data-fancybox="gallery">
	Открыть фото
</a>
```

### Как изменить порядок изображений в галерее?

Порядок определяется порядком элементов в DOM. Изменяйте порядок элементов или используйте виртуальные галереи:

```typescript
loader.addVirtualGallery({
	galleryContainerAttr: 'sorted-gallery',
	images: unsortedImages.sort((a, b) => a.date - b.date)
});
```

### Как открыть галерею программно?

Используйте стандартный API Fancybox после загрузки:

```typescript
const loader = FancyboxLoader.init();

// Создаём "фейковый" триггер
const fakeLink = document.createElement('a');
fakeLink.href = '/images/photo.jpg';
fakeLink.setAttribute('data-fancybox', 'gallery');
fakeLink.style.display = 'none';
document.body.appendChild(fakeLink);

// Кликаем по нему
fakeLink.click();
```

### Почему CSS не применяется?

Убедитесь, что:
1. CSS файл существует по указанному пути
2. В Vite конфиге правильно настроен import стилей с `?url`
3. Проверьте Network tab в DevTools - загружается ли CSS

## Лицензия

Этот компонент является частью проекта aknova.

Fancybox распространяется под лицензией [GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html) для некоммерческого использования. Для коммерческого использования требуется [лицензия](https://fancyapps.com/fancybox/license/).
