import Swiper from 'swiper';
import { Scrollbar, Pagination, Navigation } from 'swiper/modules';
import { AccordionSE } from '@scripts/shared/lib/accordion-se';

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
			640: {
				slidesPerView: 'auto'
			},
			480: {
				slidesPerView: 1.3
			}
		}
	});


	new AccordionSE('.accordion-se');
}

document.addEventListener('DOMContentLoaded', initHomeScripts);
