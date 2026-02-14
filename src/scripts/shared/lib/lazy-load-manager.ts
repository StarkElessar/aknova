import LazyLoad from 'vanilla-lazyload';

import type { ILazyLoadInstance, ILazyLoadOptions } from 'vanilla-lazyload';

export class LazyLoadManager {
	private static instance: ILazyLoadInstance;

	static getInstance(options: Partial<ILazyLoadOptions> = {}) {
		return LazyLoadManager.instance ??= new LazyLoad({
			elements_selector: '.lazy',
			threshold: 500,
			use_native: false,
			...options
		});
	}
}
