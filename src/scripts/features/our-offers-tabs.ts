import { TabsSE } from '@scripts/shared/lib/tabs-se.ts';

export function initOurOffersTabs() {
	return new TabsSE('our-offers', {
		defaultTab: 0,
		enableNesting: false
	});
}
