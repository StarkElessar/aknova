import Swiper from 'swiper';
import { Scrollbar } from 'swiper/modules';

export function initHeroSlider(selector: string = '#hero-slider') {
	const swiperElement = document.querySelector(selector);

	if (!swiperElement) {
		return null;
	}

	return new Swiper(selector, {
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
}
