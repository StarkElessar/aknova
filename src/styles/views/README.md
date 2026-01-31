# View-Specific Styles

This directory contains CSS files for view-specific styling. Each view is organized in its own subdirectory with a standardized structure.

## Structure

Each view has a dedicated directory with a `page.css` file:

```
src/styles/views/
├── README.md
├── home/
│   └── page.css         # Auto-discovered by Vite build
└── about/
    └── page.css
```

**Important:** The filename **must** be `page.css` - this is required by the Vite build system which automatically discovers `src/styles/views/**/page.css` files.

## Build System Integration

The Vite configuration automatically discovers all `page.css` files in view directories alongside their TypeScript counterparts:

```typescript
// vite.config.ts discovers both:
// - src/scripts/views/**/page.ts
// - src/styles/views/**/page.css
```

This generates output files like:
- `dist/assets/styles/views/home.css`
- `dist/assets/styles/views/about.css`

## Usage

Create a new view stylesheet by adding a `page.css` file in the view directory:

```css
/* src/styles/views/home/page.css */

/* View-specific styles for home page */
.home-hero {
  background: linear-gradient(to bottom, #667eea 0%, #764ba2 100%);
  padding: 4rem 2rem;
}

.home-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
```

Import in the corresponding view script:

```typescript
// src/scripts/views/home/page.ts
import '@styles/views/home/page.css';
```

The CSS will be automatically bundled and included when the view is loaded.

## Path Aliases

The project uses configured path aliases:

- `@styles/views/home/page.css` → `src/styles/views/home/page.css`
- Always use the `@styles` alias in TypeScript imports for consistency

## Best Practices

1. **Always name the file `page.css`** - required for auto-discovery
2. **Import via TypeScript** using `@styles` alias, not HTML `<link>` tags
3. **Keep view styles isolated** - scope with view-specific class prefixes
4. **Use clear naming conventions** - prefix classes with view name (e.g., `.home-`, `.about-`)
5. **Avoid duplicating common styles** - extract reusable patterns to global styles
6. **Organize logically** - group related styles with comments
7. **Match directory structure** - CSS and TS directories should mirror each other

## Naming Conventions

- **Directories:** lowercase-with-hyphens matching script directories (e.g., `about-us/`, `contact-form/`)
- **Entry file:** Always `page.css` (never `index.css`, `about.css`, `style.css`, etc.)
- **CSS Classes:** Use view-name prefix to avoid conflicts (e.g., `.home-hero`, `.about-team`, `.contact-form`)

## CSS Architecture

```css
/* page.css structure example */

/* ==========================================================================
   View: Home Page
   ========================================================================== */

/* Hero Section */
.home-hero { }
.home-hero__title { }
.home-hero__subtitle { }

/* Features Section */
.home-features { }
.home-features__item { }
.home-features__icon { }

/* Call to Action */
.home-cta { }
.home-cta__button { }
```

## Integration with HTML

Reference the built CSS in your HTML files:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="./assets/styles/main.css">
  <link rel="stylesheet" href="./assets/styles/views/home.css">
</head>
<body>
  <div class="home-hero">
    <!-- View content -->
  </div>
  <script type="module" src="./assets/scripts/views/home.js"></script>
</body>
</html>
```

Note: Global styles (`main.css`) should be loaded before view-specific styles.
