import Swiper from 'swiper';
import { Navigation,Pagination } from 'swiper/modules';

export function initReviewsSlider(selector: string = '#reviews-swiper') {
	const swiperElement = document.querySelector(selector);

	if (!swiperElement) {
		return null;
	}

	return new Swiper(selector, {
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
}
