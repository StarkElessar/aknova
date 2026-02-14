export const normalizeUrl = (url: string): string => {
	try {
		return new URL(url, location.origin).href;
	}
	catch {
		return url;
	}
};