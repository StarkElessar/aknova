import { AccordionSE } from '@scripts/shared/lib/accordion-se';
import { formHandler } from '@scripts/shared/lib/form-handler';

import { initHeroSlider } from '@scripts/features/hero-slider';
import { initHowWeDoSlider } from '@scripts/features/how-we-do-slider';
import { initOurOffersTabs } from '@scripts/features/our-offers-tabs';
import { initReviewsSlider } from '@scripts/features/reviews-slider';
import { initServicesSlider } from '@scripts/features/services-slider';
import { initStockSlider } from '@scripts/features/stock-slider';
import { initUsefulArticlesSlider } from '@scripts/features/useful-articles-slider';

function initHomeScripts() {
	initHeroSlider();
	initOurOffersTabs();
	initHowWeDoSlider();
	initServicesSlider();
	initUsefulArticlesSlider();
	initReviewsSlider();
	initStockSlider();

	new AccordionSE('.accordion-se');

	formHandler({ formId: 'hero-form' });
	formHandler({ formId: 'call-request-cta-form' });
}

document.addEventListener('DOMContentLoaded', initHomeScripts);
