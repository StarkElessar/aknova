# Copilot Instructions for aknova

## Build, Test, and Lint Commands

```bash
# Development server (runs on port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Architecture Overview

This is a **multi-page Vite application** using vanilla TypeScript without a framework. The architecture is based on a view-specific structure where each page/view has its own JavaScript and CSS files.

### Build System

**Vite configuration** (`vite.config.ts`) uses a custom glob-based entry point system:
- Main entry points: `src/scripts/main.ts` and `src/styles/main.css`
- View-specific entry points: Automatically discovered from `src/{scripts,styles}/views/**/page.{ts,css}`
- Output structure: All assets go to `dist/assets/` with predictable naming

**Entry point pattern**: Each view gets two files:
- `src/scripts/views/{view-name}/page.ts` - View-specific JavaScript
- `src/styles/views/{view-name}/page.css` - View-specific CSS

### Directory Structure

```
src/
  scripts/
    main.ts              # Global JavaScript entry point
    views/               # View-specific scripts
      {view-name}/
        page.ts          # Auto-discovered by Vite build
  styles/
    main.css             # Global styles entry point
    views/               # View-specific styles
      {view-name}/
        page.css         # Auto-discovered by Vite build
```

### Path Aliases

- `@` → `src/`
- `@scripts` → `src/scripts/`
- `@styles` → `src/styles/`

## Key Conventions

### Adding a New View

1. Create directory structure:
   ```
   src/scripts/views/{view-name}/page.ts
   src/styles/views/{view-name}/page.css
   ```

2. The Vite build automatically discovers `page.{ts,css}` files and creates entry points

3. Import styles in the TypeScript file:
   ```typescript
   import '@styles/views/{view-name}/page.css';
   ```

4. Export and auto-initialize the view:
   ```typescript
   export function initViewName() {
     // View logic here
   }
   
   initViewName();
   ```

### View Script Pattern

Each view script should:
- Import its corresponding CSS file using the `@styles` alias
- Export an initialization function for testability
- Auto-execute the initialization when the module loads

### File and Directory Naming

**Strict kebab-case naming rule:**

All directories and files **MUST** use kebab-case (lowercase with hyphens) for the following:

- **Directories**: All directories without exceptions (e.g., `about-us/`, `user-profile/`)
- **Static assets**: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.ico`, `.woff`, `.woff2`, `.ttf`, `.otf`, `.eot`
- **Stylesheets**: `.css`, `.scss`, `.sass`, `.less`
- **Scripts**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Markup**: `.html`, `.pug`
- **Configuration**: `.json`, `.yml`, `.yaml`

**Exceptions** (not required to use kebab-case):
- Markdown files: `.md` (e.g., `README.md`, `CHANGELOG.md`)
- Docker files: `Dockerfile`, `Dockerfile.*`
- Special config files with conventional names (e.g., `tsconfig.json`, `package.json`)

**Examples:**
- ✅ `user-profile.ts`, `about-us.html`, `main-hero.css`
- ✅ `components/`, `user-settings/`, `api-client/`
- ✅ `logo-small.svg`, `background-image.png`
- ❌ `userProfile.ts`, `AboutUs.html`, `mainHero.css`
- ❌ `UserSettings/`, `apiClient/`

**View-specific naming:**
- View directories: Use kebab-case (e.g., `about-us/`, `contact-form/`)
- Entry files: Always named `page.ts` and `page.css` (required by build system)

### TypeScript Configuration

- Strict mode enabled
- Using ES2022 target with DOM types
- Bundler module resolution
- `noEmit: true` (Vite handles transpilation)

## Git Commit Message Guidelines

When generating commit messages, follow these rules:

### Format

Use **Conventional Commits** format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Rules

1. **Language**: Use English for all commit messages
2. **Type**: Must be one of:
   - `feat`: New feature
   - `fix`: Bug fix
   - `docs`: Documentation changes
   - `style`: Code style changes (formatting, missing semicolons, etc.)
   - `refactor`: Code refactoring without functionality changes
   - `perf`: Performance improvements
   - `test`: Adding or updating tests
   - `build`: Build system or dependency changes
   - `ci`: CI/CD configuration changes
   - `chore`: Other changes that don't modify src or test files

3. **Scope**: Optional, describes affected area (e.g., `auth`, `api`, `ui`, `config`)

4. **Subject**:
   - Use imperative mood ("add" not "added" or "adds")
   - Start with lowercase letter
   - No period at the end
   - Maximum 72 characters
   - Be specific and descriptive

5. **Body**:
   - Add body for complex changes
   - Explain WHY, not WHAT (code shows what)
   - Wrap at 72 characters
   - Separate from subject with blank line

6. **Footer**:
   - Reference issues: `Fixes #123`, `Closes #456`
   - Breaking changes: `BREAKING CHANGE: description`

### Examples

```
feat(auth): add JWT token refresh mechanism

Implement automatic token refresh before expiration
to improve user experience and reduce re-login frequency.

Fixes #42
```

```
fix(ui): correct button alignment in header

The submit button was misaligned on mobile devices
due to incorrect flexbox properties.
```

```
docs: update installation instructions
```

```
refactor(api): simplify error handling logic
```

### Additional Guidelines

- Keep commits atomic (one logical change per commit)
- Avoid generic messages like "fix bug" or "update code"
- Reference issue numbers when applicable
- Use present tense
- Be clear and concise
