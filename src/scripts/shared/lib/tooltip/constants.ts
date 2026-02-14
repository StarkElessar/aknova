import type { TooltipLoaderOptions } from './types';

export const DEFAULT_OPTIONS: Required<TooltipLoaderOptions> = {
    elementDataAttr: 'data-tippy-content',
    tippyOptions: {
		placement: 'top',
	    allowHTML: true
    },
};
