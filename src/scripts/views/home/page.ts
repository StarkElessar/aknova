import Swiper from 'swiper';
import { Scrollbar, Pagination, Navigation } from 'swiper/modules';
import { AccordionSE } from '@scripts/shared/lib/accordion-se';

function initStockSwiper() {
	const TABLET_BREAKPOINT = 640;
	const swiperContainer = document.querySelector('#stock-swiper');

	if (swiperContainer) {
		const slides = swiperContainer.querySelectorAll('.swiper-slide');
		const slideCount = slides.length;
		const navigationElement = swiperContainer.querySelector('.stock__navigation') as HTMLElement;

		const mediaQuery = matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`);

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
				[TABLET_BREAKPOINT]: {
					slidesPerView: 2
				},
				480: {
					slidesPerView: 1.3
				}
			}
		};

		new Swiper('#stock-swiper', swiperConfig);

		updateNavigationVisibility();

		mediaQuery.addEventListener('change', updateNavigationVisibility);
	}
}

function initHomeScripts() {
	new Swiper('#hero-slider', {
		modules: [Scrollbar],
		spaceBetween: 20,
		slidesPerView: 'auto',
		grabCursor: true,
		breakpoints: {
			480: {
				spaceBetween: 32
			}
		},
		scrollbar: {
			el: '.swiper-scrollbar'
		}
	});

	new Swiper('.how-we-do__slider', {
		slidesPerGroup: 1,
		slidesPerView: 7,
		centeredSlides: false,
		slidesPerGroupSkip: 7,
		spaceBetween: 32,
		breakpoints: {
			640: {
				slidesPerGroup: 7
			}
		}
	});

	new Swiper('#useful-articles-swiper', {
		modules: [Pagination, Navigation],
		spaceBetween: 40,
		slidesPerView: 1,
		navigation: {
			nextEl: '[data-navigation="next"]',
			prevEl: '[data-navigation="prev"]'
		},
		pagination: {
			el: '.swiper-pagination'
		},
		breakpoints: {
			640: {
				slidesPerView: 'auto'
			},
			480: {
				slidesPerView: 1.3
			}
		}
	});

	new Swiper('#reviews-swiper', {
		modules: [Pagination, Navigation],
		spaceBetween: 40,
		centeredSlides: true,
		initialSlide: 1,
		navigation: {
			nextEl: '[data-navigation="next"]',
			prevEl: '[data-navigation="prev"]'
		},
		pagination: {
			el: '.swiper-pagination'
		},
		breakpoints: {
			1240: {
				slidesPerView: 3
			},
			640: {
				slidesPerView: 1.5
			},
			480: {
				slidesPerView: 1.3
			}
		}
	});

	initStockSwiper();

	new AccordionSE('.accordion-se');
}

document.addEventListener('DOMContentLoaded', initHomeScripts);
