let uniqueIdCounter = 0;

export function generateId(prefix = 'popup'): string {
	return `${prefix}-${Date.now()}-${++uniqueIdCounter}`;
}

export function isHTMLElement(element: any): element is HTMLElement {
	return element instanceof HTMLElement;
}

export function getDataAttributes(
	element: HTMLElement,
	prefix?: string,
): Record<string, string> {
	const data: Record<string, string> = {};
	const attributes = element.attributes;

	for (let i = 0; i < attributes.length; i++) {
		const attr = attributes[i];
		if (attr.name.startsWith('data-')) {
			const key = attr.name.slice(5);
			if (!prefix || key.startsWith(prefix)) {
				const normalizedKey = prefix ? key.slice(prefix.length + 1) : key;
				data[normalizedKey] = attr.value;
			}
		}
	}

	return data;
}

export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return function (this: any, ...args: Parameters<T>) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn.apply(this, args), delay);
	};
}

export function focusTrap(element: HTMLElement): () => void {
	const focusableElements = element.querySelectorAll<HTMLElement>(
		'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
	);

	const firstFocusable = focusableElements[0];
	const lastFocusable = focusableElements[focusableElements.length - 1];

	const handleTabKey = (event: KeyboardEvent) => {
		if (event.key !== 'Tab') return;

		if (event.shiftKey) {
			if (document.activeElement === firstFocusable) {
				lastFocusable?.focus();
				event.preventDefault();
			}
		} else {
			if (document.activeElement === lastFocusable) {
				firstFocusable?.focus();
				event.preventDefault();
			}
		}
	};

	element.addEventListener('keydown', handleTabKey);

	return () => {
		element.removeEventListener('keydown', handleTabKey);
	};
}

export function getScrollbarWidth(): number {
	const outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.overflow = 'scroll';
	document.body.appendChild(outer);

	const inner = document.createElement('div');
	outer.appendChild(inner);

	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

	outer.parentNode?.removeChild(outer);

	return scrollbarWidth;
}
