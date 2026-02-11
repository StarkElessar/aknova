import { AccordionSE } from '@scripts/shared/lib/accordion-se';
import { initHeroSlider } from '@scripts/features/hero-slider';
import { initHowWeDoSlider } from '@scripts/features/how-we-do-slider';
import { initUsefulArticlesSlider } from '@scripts/features/useful-articles-slider';
import { initReviewsSlider } from '@scripts/features/reviews-slider';
import { initStockSlider } from '@scripts/features/stock-slider';
import { initServicesSlider } from '@scripts/features/services-slider';

function initHomeScripts() {
	initHeroSlider();
	initHowWeDoSlider();
	initServicesSlider();
	initUsefulArticlesSlider();
	initReviewsSlider();
	initStockSlider();

	new AccordionSE('.accordion-se');
}

document.addEventListener('DOMContentLoaded', initHomeScripts);
