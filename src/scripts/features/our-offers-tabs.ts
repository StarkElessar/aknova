import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { TabsSE } from '@scripts/shared/lib/tabs-se';
import { TooltipLoader } from '@scripts/shared/lib/tooltip';
import { FancyboxLoader } from '@scripts/shared/lib/fancybox';

const DESKTOP_BREAKPOINT = 1260;

function createSwipers(): Swiper[] {
	const swipers: Swiper[] = [];
	const containers = document.querySelectorAll<HTMLElement>('.our-offers__slider');

	containers.forEach((container) => {
		const swiper = new Swiper(container, {
			modules: [Navigation, Pagination],
			slidesPerView: 'auto',
			spaceBetween: 32,
			pagination: {
				el: '.swiper-pagination'
			},
			navigation: {
				nextEl: '[data-navigation="next"]',
				prevEl: '[data-navigation="prev"]'
			},
			breakpoints: {
				480: {
					slidesPerView: 'auto',
					spaceBetween: 32
				},
				0: {
					slidesPerView: 1,
					spaceBetween: 16
				}
			}
		});
		swipers.push(swiper);
	});

	return swipers;
}

function destroySwipers(swipers: Swiper[]): void {
	swipers.forEach((swiper) => {
		if (swiper && !swiper.destroyed) {
			swiper.destroy(true, true);
		}
	});
}

export function initOurOffersTabs() {
	let swipers: Swiper[] = [];
	const mediaQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
	let isDesktop = mediaQuery.matches;

	const handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
		const nowDesktop = event.matches;

		if (nowDesktop && !isDesktop) {
			// Переход на десктоп — уничтожаем слайдеры
			destroySwipers(swipers);
			swipers = [];
		}
		else if (!nowDesktop && isDesktop) {
			// Переход на мобилку — создаём слайдеры
			swipers = createSwipers();
		}

		isDesktop = nowDesktop;
	};

	return new TabsSE('our-offers', {
		defaultTab: 0,
		enableNesting: false,
		onLoaded: () => {
			// Инициализируем слайдеры только если не десктоп
			if (!isDesktop) {
				swipers = createSwipers();
			}

			mediaQuery.addEventListener('change', handleMediaChange);
			TooltipLoader.getInstance();
			FancyboxLoader.init();
		},
		onChanged: () => {
			// После смены таба обновляем слайдеры (если они есть)
			if (!isDesktop) {
				swipers.forEach((swiper) => swiper.update());
			}
		}
	});
}
