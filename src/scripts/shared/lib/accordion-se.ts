/**
 * Selector tokens for accordion elements
 */
export type AccordionSelectors = {
	/**
	 * Selector for accordion header element. Default is '.accordion__header'.
	 */
	header?: string;
	/**
	 * Selector for accordion item element. Default is '.accordion__item'.
	 */
	item?: string;
};

/**
 * Internal selectors with required properties
 */
type AccordionSelectorsConfig = {
	header: string;
	item: string;
};

/**
 * Configuration options for the Accordion component
 */
export type AccordionOptions = {
	/**
	 * Whether to keep previous items open or not. Default is false.
	 */
	shouldOpenAll?: boolean;
	/**
	 * The set of initially open items (by index). Default is an empty array.
	 */
	defaultOpen?: number[];
	/**
	 * CSS class to apply to collapsed/opened items. Default is 'open'.
	 */
	collapsedClass?: string;
	/**
	 * Custom selectors for accordion elements.
	 */
	selectors?: AccordionSelectors;
};

/**
 * Internal configuration with required properties
 */
type AccordionConfig = {
	shouldOpenAll: boolean;
	defaultOpen: number[];
	collapsedClass: string;
	selectors: AccordionSelectorsConfig;
};

/**
 * @class Accordion
 * @description Represents an accordion component.
 */
export class AccordionSE {
	private _options: AccordionConfig;
	private readonly _accordionSelector: string;
	private _accordions: NodeListOf<Element>;

	/**
	 * Creates a new Accordion instance
	 * @param {string} selector - The CSS selector for the accordion container.
	 * @param {AccordionOptions} options - The options for configuring the accordion.
	 */
	constructor(selector: string, options: AccordionOptions = {}) {
		const defaultConfig: AccordionConfig = {
			shouldOpenAll: false,
			defaultOpen: [],
			collapsedClass: 'opened',
			selectors: {
				header: '.accordion-se__header',
				item: '.accordion-se__item',
			},
		};

		this._options = {
			...defaultConfig,
			...options,
			selectors: {
				...defaultConfig.selectors,
				...options.selectors,
			},
		};
		this._accordionSelector = selector;
		this._accordions = document.querySelectorAll(this._accordionSelector);

		this._init();
	}

	private _init(): void {
		document.addEventListener('click', ({ target }: MouseEvent) => {
			if (target instanceof Element) {
				const header = target.closest(this._options.selectors.header);
				const item = header?.parentNode;

				if (item instanceof Element) {
					const accordion = item.closest(this._accordionSelector);

					if (accordion) {
						const accordionItems = accordion.querySelectorAll(this._options.selectors.item);

						this._toggle(item);

						if (this._isCollapsed(item) && !this._options.shouldOpenAll) {
							this._closeOthers(item, accordionItems);
						}
					}
				}
			}
		});

		this._accordions.forEach((accordion) => {
			const accordionItems = accordion.querySelectorAll(this._options.selectors.item);

			accordionItems.forEach((item, index) => {
				if (this._options.defaultOpen.includes(index)) {
					this._open(item);
				}
				else {
					this._close(item);
				}
			});
		});
	}

	private _toggle(element: Element): void {
		element.classList.toggle(this._options.collapsedClass);

		if (this._options.shouldOpenAll) {
			this._closeOthers(element);
		}
	}

	private _open(element: Element): void {
		element.classList.add(this._options.collapsedClass);
	}

	private _close(element: Element): void {
		element.classList.remove(this._options.collapsedClass);
	}

	private _closeOthers(currentItem: Element, items?: NodeListOf<Element>): void {
		if (items) {
			for (const item of items) {
				if (item !== currentItem && this._isCollapsed(item)) {
					this._close(item);
				}
			}
		}
	}

	private _isCollapsed(item: Element): boolean {
		return item.classList.contains(this._options.collapsedClass);
	}
}
