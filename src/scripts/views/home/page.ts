import { AccordionSE } from '@scripts/shared/lib/accordion-se';

import { initHeroSlider } from '@scripts/features/hero-slider';
import { initHowWeDoSlider } from '@scripts/features/how-we-do-slider';
import { initReviewsSlider } from '@scripts/features/reviews-slider';
import { initStockSlider } from '@scripts/features/stock-slider';
import { initUsefulArticlesSlider } from '@scripts/features/useful-articles-slider';

function initHomeScripts() {
	// Инициализация слайдеров через features
	initHeroSlider();
	initHowWeDoSlider();
	initUsefulArticlesSlider();
	initReviewsSlider();
	initStockSlider();

	// Инициализация аккордеона
	new AccordionSE('.accordion-se');
}

document.addEventListener('DOMContentLoaded', initHomeScripts);
