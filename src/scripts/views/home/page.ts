import Swiper from 'swiper';
import { Scrollbar,  } from 'swiper/modules';

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
		slidesPerGroupSkip: 7 ,
		spaceBetween: 32,
		breakpoints: {
			640: {
				slidesPerGroup: 7,
			}
		}
	})
}

document.addEventListener('DOMContentLoaded', initHomeScripts);
