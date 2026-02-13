import Swiper from 'swiper';
import type { SwiperOptions } from 'swiper/types';
import { Navigation, Pagination } from 'swiper/modules';

export function initHowWeDoSlider() {
	const navigation = document.querySelector<HTMLElement>('.how-we-do__navigation');
	const prevButton = navigation?.querySelector<HTMLElement>('[data-navigation="prev"]');
	const nextButton = navigation?.querySelector<HTMLElement>('[data-navigation="next"]');
	const paginationContainer = navigation?.querySelector<HTMLElement>('.swiper-pagination');

	if (!prevButton || !nextButton || !paginationContainer) {
		console.warn('How We Do slider navigation elements not found. Slider will not be initialized.');
		return;
	}

	const config: SwiperOptions = {
		modules: [Navigation, Pagination],
		slidesPerView: 1,
		spaceBetween: 40,
		navigation: {
			nextEl: nextButton,
			prevEl: prevButton
		},
		pagination: {
			el: paginationContainer
		}
	};

	let mobileSwiper: Swiper | undefined;
	let desktopSwiper: Swiper | undefined;

	const mediaQuery = window.matchMedia('(min-width: 640px)');

	function handleSliderChange() {
		if (mediaQuery.matches) {
			// Desktop view (>= 640px)
			if (mobileSwiper) {
				mobileSwiper.destroy(true, true);
				mobileSwiper = undefined;
			}
			if (!desktopSwiper) {
				desktopSwiper = new Swiper('#how-we-do-desktop-swiper', {
					...config,
					pagination: {
						...(typeof config.pagination === 'object' ? config.pagination : {}),
						dynamicBullets: false
					}
				});
			}
		}
		else {
			// Mobile view (< 640px)
			if (desktopSwiper) {
				desktopSwiper.destroy(true, true);
				desktopSwiper = undefined;
			}
			if (!mobileSwiper) {
				mobileSwiper = new Swiper('#how-we-do-mobile-swiper', {
					...config,
					pagination: {
						...(typeof config.pagination === 'object' ? config.pagination : {}),
						dynamicBullets: true
					}
				});
			}
		}
	}

	handleSliderChange();
	mediaQuery.addEventListener('change', handleSliderChange);
}
