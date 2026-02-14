import cssUrl from '@styles/libs/fancybox.scss?url';

import type { FancyboxLoaderOptions } from './types';

export const DEFAULT_OPTIONS: Required<FancyboxLoaderOptions> = {
	cssUrl,
	containerDataAttr: 'data-fancybox',
	loaderTemplate: null,
	fancyboxOptions: {
		Carousel: {
			Thumbs: { type: 'classic' }
		}
	},
	virtualGalleryItems: []
};
