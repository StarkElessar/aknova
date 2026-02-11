import Swiper from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';

export function initUsefulArticlesSlider(selector: string = '#useful-articles-swiper') {
	const swiperElement = document.querySelector(selector);

	if (!swiperElement) {
		return null;
	}

	return new Swiper(selector, {
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
}
