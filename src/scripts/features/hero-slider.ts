import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

export function initHeroSlider() {
	const swiperElement = document.querySelector<HTMLElement>('#hero-slider');
	const prevButton = document.querySelector<HTMLElement>('.hero-home__slider-nav [data-navigation=prev]');
	const nextButton = document.querySelector<HTMLElement>('.hero-home__slider-nav [data-navigation=next]');

	if (!swiperElement || !prevButton || !nextButton) {
		return null;
	}

	return new Swiper(swiperElement, {
		modules: [Navigation],
		spaceBetween: 20,
		slidesPerView: 'auto',
		grabCursor: true,
		breakpoints: {
			480: {
				spaceBetween: 32
			}
		},
		navigation: {
			nextEl: nextButton,
			prevEl: prevButton
		}
	});
}
