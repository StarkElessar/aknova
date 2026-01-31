import '@styles/views/home/page.scss';

import Swiper from 'swiper';
import { Scrollbar, FreeMode } from 'swiper/modules';

document.addEventListener('DOMContentLoaded', () => {
	new Swiper('#hero-slider', {
		modules: [Scrollbar, FreeMode],
		spaceBetween: 20,
		slidesPerView: 'auto',
		grabCursor: true,
		breakpoints: {
			480: {
				spaceBetween: 32
			}
		},
		scrollbar: {
			el: '.swiper-scrollbar',
			draggable: true
		}
	});
});
