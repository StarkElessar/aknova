import { asyncLoadCSS } from '@scripts/shared/lib/async-load-css';

import { DEFAULT_OPTIONS } from './constants';
import { normalizeUrl } from './normalize-url';

import type { FancyboxLoaderOptions, IVirtualGalleryItem, ThumbImage } from './types';
import type { Fancybox } from '@fancyapps/ui';
import type { TypeOrNull } from '@scripts/shared/types';

export class FancyboxLoader {
	private static _instance: FancyboxLoader;
	private readonly _options: Required<FancyboxLoaderOptions>;

	public static init(options?: FancyboxLoaderOptions) {
		return (this._instance ??= new FancyboxLoader(options));
	}

	private constructor(options: FancyboxLoaderOptions = {}) {
		this._options = { ...DEFAULT_OPTIONS, ...options };
		document.addEventListener('click', this.handleDocumentClick);
	}

	public addVirtualGallery(virtualGalleryItem: IVirtualGalleryItem) {
		this._options.virtualGalleryItems.push(virtualGalleryItem);
	}

	private handleDocumentClick = async (event: MouseEvent) => {
		const { containerDataAttr } = this._options;
		const target = event.target as HTMLElement;
		const trigger = target.closest<HTMLAnchorElement>(`[${containerDataAttr}]`);

		if (trigger) {
			event.preventDefault();
			await this.openFancybox(trigger);
		}
	};

	private async openFancybox(trigger: HTMLAnchorElement) {
		const { fancyboxOptions, containerDataAttr, virtualGalleryItems } = this._options;
		const galleryAttrValue = trigger.getAttribute(containerDataAttr);
		const foundedVirtualGallery = virtualGalleryItems.find(g => g.galleryContainerAttr === galleryAttrValue);
		const galleryItems = foundedVirtualGallery ? foundedVirtualGallery.images : this.getGalleryItems(trigger);
		const startIndex = galleryItems.findIndex(g => normalizeUrl(g.src) === normalizeUrl(trigger.href));
		const unmountLoader = this.createLoader();

		try {
			const fancybox = await this.loadFancyBox();

			fancybox?.show(galleryItems, {
				...fancyboxOptions,
				startIndex
			});
		}
		finally {
			unmountLoader();
		}
	}

	private getGalleryItems(clickedElement: HTMLAnchorElement): ThumbImage[] {
		const { containerDataAttr } = this._options;
		const gallerySelector = clickedElement.getAttribute(containerDataAttr);
		const galleryElements = document.querySelectorAll<HTMLAnchorElement>(`[${containerDataAttr}="${gallerySelector}"]`);

		return [...galleryElements].map((item) => {
			const image = item.querySelector('img');
			const imgSrc = image?.getAttribute('src');
			const thumbSrc = imgSrc && imgSrc !== '#' ? imgSrc : (image?.dataset.src || image?.srcset);

			return {
				src: item.href,
				thumbSrc
			};
		});
	}

	private async loadFancyBox(): Promise<TypeOrNull<typeof Fancybox>> {
		const { cssUrl } = this._options;
		await asyncLoadCSS(cssUrl);
		return import('@fancyapps/ui').then(m => m.Fancybox);
	}

	private createLoader() {
		if (this._options.loaderTemplate) {
			return this._options.loaderTemplate();
		}

		const overlay = document.createElement('div');
		const style = document.createElement('style');

		overlay.style.position = 'fixed';
		overlay.style.inset = '0';
		overlay.style.width = '100%';
		overlay.style.height = '100%';
		overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
		overlay.style.zIndex = '100';
		overlay.style.animation = 'pulse 2.5s infinite';

		style.textContent = `
            @keyframes pulse {
                0% { opacity: 0.8; }
                70% { opacity: 0.4; }
                100% { opacity: 0.8; }
            }
        `;
		document.head.appendChild(style);
		document.body.append(overlay);

		return () => {
			overlay.remove();
			style.remove();
		};
	}
}
