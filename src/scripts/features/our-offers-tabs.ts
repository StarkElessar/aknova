import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { TabsSE } from '@scripts/shared/lib/tabs-se';

export function initOurOffersTabs() {
	return new TabsSE('our-offers', {
		defaultTab: 0,
		enableNesting: false,
		onLoaded: () => {
			new Swiper('.our-offers__cards', {
				modules: [Navigation, Pagination],
				slidesPerView: 'auto',
				spaceBetween: 32,
			});
		}
	});
}
