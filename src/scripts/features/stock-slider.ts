import Swiper from 'swiper';
import { Navigation,Pagination } from 'swiper/modules';

interface StockSliderConfig {
	selector?: string;
	tabletBreakpoint?: number;
}

export function initStockSlider({
	selector = '#stock-swiper',
	tabletBreakpoint = 640
}: StockSliderConfig = {}) {
	const swiperContainer = document.querySelector(selector);

	if (!swiperContainer) {
		return null;
	}

	const slides = swiperContainer.querySelectorAll('.swiper-slide');
	const slideCount = slides.length;
	const navigationElement = swiperContainer.querySelector('.stock__navigation') as HTMLElement;

	const mediaQuery = matchMedia(`(min-width: ${tabletBreakpoint}px)`);

	function updateNavigationVisibility() {
		if (navigationElement) {
			const isWideViewport = mediaQuery.matches;

			switch (slideCount) {
				case 1:
					// 1 слайд - всегда скрываем навигацию
					navigationElement.style.display = 'none';
					break;
				case 2:
					// 2 слайда - скрываем навигацию на широких экранах (640px+), показываем на узких
					navigationElement.style.display = isWideViewport ? 'none' : 'flex';
					break;
				default:
					// Больше 2 слайдов - всегда показываем навигацию
					navigationElement.style.display = 'flex';
			}
		}
	}

	const swiperConfig = {
		modules: [Pagination, Navigation],
		spaceBetween: 40,
		centeredSlides: slideCount === 1,
		navigation: {
			nextEl: '[data-navigation="next"]',
			prevEl: '[data-navigation="prev"]'
		},
		pagination: {
			el: '.swiper-pagination'
		},
		breakpoints: {
			[tabletBreakpoint]: {
				slidesPerView: 2
			},
			480: {
				slidesPerView: 1.3
			}
		}
	};

	const swiper = new Swiper(selector, swiperConfig);

	updateNavigationVisibility();
	mediaQuery.addEventListener('change', updateNavigationVisibility);

	return swiper;
}
