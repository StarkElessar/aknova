import Swiper from 'swiper';

export function initHowWeDoSlider(selector: string = '.how-we-do__slider') {
	const swiperElement = document.querySelector(selector);

	if (!swiperElement) {
		return null;
	}

	return new Swiper(selector, {
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
}
