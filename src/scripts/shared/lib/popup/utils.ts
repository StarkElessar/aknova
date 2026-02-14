let uniqueIdCounter = 0;

export function generateId(prefix = 'popup'): string {
	return `${prefix}-${Date.now()}-${++uniqueIdCounter}`;
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
