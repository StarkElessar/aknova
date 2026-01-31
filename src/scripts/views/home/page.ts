// Page-specific functionality for index.html
import '@styles/views/home/page.css';

export function initIndexPage() {
	console.log('Index page initialized');

	// Add page-specific logic here
	// For example: custom animations, form handlers, etc.
	document.addEventListener('click', () => {
		document.body.style.background = 'red';
	});
}

// Auto-initialize when module loads
initIndexPage();
