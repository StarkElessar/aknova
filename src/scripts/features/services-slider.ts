import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

export function initServicesSlider() {
	const swiperContainer = document.querySelector<HTMLElement>('#services-swiper');

	if (swiperContainer) {
		return new Swiper(swiperContainer, {
			modules: [Pagination, Navigation],
			slidesPerView: 1,
			spaceBetween: 12,
			navigation: {
				nextEl: '[data-navigation="next"]',
				prevEl: '[data-navigation="prev"]'
			},
			pagination: {
				el: '.swiper-pagination'
			},
			breakpoints: {
				960: {
					slidesPerView: 3,
					spaceBetween: 40
				},
				640: {
					slidesPerView: 2.1,
					spaceBetween: 20
				},
				480: {
					slidesPerView: 1.3
				}
			}
		});
	}
}
