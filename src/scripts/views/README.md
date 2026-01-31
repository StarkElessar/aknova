# View-Specific Scripts

This directory contains TypeScript files for view-specific functionality. Each view is organized in its own subdirectory with a standardized structure.

## Structure

Each view has a dedicated directory with a `page.ts` file that serves as the entry point:

```
src/scripts/views/
├── README.md
├── home/
│   └── page.ts          # Auto-discovered by Vite build
└── about/
    └── page.ts
```

**Important:** The filename **must** be `page.ts` - this is required by the Vite build system which automatically discovers `src/scripts/views/**/page.ts` files.

## Build System Integration

The Vite configuration automatically discovers all `page.ts` files in view directories:

```typescript
// vite.config.ts (simplified)
globSync('src/{scripts,styles}/views/**/page.{ts,css}').map(file => {
	const { dir } = parse(file);
	const relPath = relative('src', dir); // e.g., 'scripts/views/home'
	return [relPath, resolve(__dirname, file)];
});
```

This generates output files like:

- `dist/assets/scripts/views/home.js`
- `dist/assets/scripts/views/about.js`

## Usage

Create a new view by adding a directory with a `page.ts` file:

```typescript
// src/scripts/views/home/page.ts
import '@styles/views/home/page.css';

export function initHomePage() {
	console.log('Home page initialized');

	// View-specific logic here
	const hero = document.querySelector('.hero');
	if (hero) {
		// Add interactivity
	}
}

// Auto-initialize when module loads
initHomePage();
```

Reference in HTML:

```html
<script type="module" src="./assets/scripts/views/home.js"></script>
```

## Path Aliases

Use configured aliases for cleaner imports:

- `@styles` → `src/styles/`
- `@scripts` → `src/scripts/`
- `@` → `src/`

```typescript
import '@styles/views/home/page.css'; // Preferred
import '../../styles/views/home/page.css'; // Also works
```

## Best Practices

1. **Always name the entry file `page.ts`** - required for auto-discovery
2. **Import corresponding CSS at the top** using `@styles` alias
3. **Export initialization function** for testability and reusability
4. **Auto-execute initialization** at the end of the file
5. **Keep view logic isolated** - don't mix concerns with other views
6. **Use descriptive directory names** matching the view purpose (lowercase with hyphens)

## Naming Conventions

- **Directories:** lowercase-with-hyphens (e.g., `about-us/`, `contact-form/`)
- **Entry file:** Always `page.ts` (never `index.ts`, `about.ts`, etc.)
- **Functions:** camelCase with clear intent (e.g., `initAboutPage()`, `setupContactForm()`)
