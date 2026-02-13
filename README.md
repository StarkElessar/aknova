# aknova

Multi-page Vite application using vanilla TypeScript without a framework.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installing Bun](#installing-bun)
  - [macOS](#macos)
  - [Linux](#linux)
  - [Windows](#windows)
- [Project Setup](#project-setup)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Code Quality](#code-quality)
- [Project Structure](#project-structure)

## Prerequisites

This project uses **Bun** as the JavaScript runtime and package manager. You need to install Bun before setting up the project.

**System Requirements:**
- macOS, Linux, or Windows (via WSL2 or native Windows support)
- 64-bit processor

## Installing Bun

### macOS

**Option 1: Using curl (recommended)**

```bash
curl -fsSL https://bun.sh/install | bash
```

**Option 2: Using Homebrew**

```bash
brew install oven-sh/bun/bun
```

After installation, restart your terminal or run:

```bash
source ~/.zshrc  # For Zsh
# or
source ~/.bashrc  # For Bash
```

**Verify installation:**

```bash
bun --version
```

### Linux

**Using curl (works on most distributions)**

```bash
curl -fsSL https://bun.sh/install | bash
```

After installation, restart your terminal or run:

```bash
source ~/.bashrc  # For Bash
# or
source ~/.zshrc   # For Zsh
```

**Alternative: Using package managers**

For **Arch Linux** (AUR):
```bash
yay -S bun-bin
```

For **NixOS**:
```bash
nix-shell -p bun
```

**Verify installation:**

```bash
bun --version
```

### Windows

**Option 1: Native Windows (recommended)**

Open PowerShell and run:

```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Option 2: Using WSL2 (Windows Subsystem for Linux)**

1. Install WSL2 if you haven't already:
   ```powershell
   wsl --install
   ```

2. Open your WSL2 terminal (Ubuntu, Debian, etc.) and run:
   ```bash
   curl -fsSL https://bun.sh/install | bash
   ```

3. Restart your WSL terminal or source your profile:
   ```bash
   source ~/.bashrc
   ```

**Option 3: Using Scoop**

```powershell
scoop install bun
```

**Verify installation:**

```powershell
bun --version
```

## Project Setup

1. **Clone the repository:**

```bash
git clone <repository-url>
cd aknova
```

2. **Install dependencies:**

```bash
bun install
```

This will install all dependencies defined in `package.json` and create a `bun.lock` file.

## Development

**Start the development server:**

```bash
bun run dev
```

The development server will start on `http://localhost:3000` (or the next available port).

**Features:**
- Hot Module Replacement (HMR)
- Fast refresh on file changes
- Automatic browser reload

## Building for Production

**Standard build:**

```bash
bun run build
```

This will:
1. Run TypeScript type checking (`tsc`)
2. Build the project using Vite
3. Output files to the `dist/` directory

**MODX build (alternative configuration):**

```bash
bun run modx:build
```

Uses the `vite.modx.config.ts` configuration.

**Preview production build:**

```bash
bun run preview
```

Starts a local server to preview the production build.

## Code Quality

**Run linters:**

```bash
bun run lint
```

This checks:
- JavaScript/TypeScript code with ESLint
- CSS with Stylelint
- HTML/CSS formatting with Prettier

**Auto-fix issues:**

```bash
bun run lint:fix
```

Automatically fixes:
- ESLint issues
- Stylelint issues
- Code formatting with Prettier

## Project Structure

```
aknova/
├── src/
│   ├── scripts/           # TypeScript source files
│   │   ├── main.ts        # Global JavaScript entry point
│   │   ├── features/      # Shared features (sliders, etc.)
│   │   └── views/         # View-specific scripts
│   │       └── {view}/
│   │           └── page.ts
│   ├── styles/            # CSS/SCSS source files
│   │   ├── main.scss      # Global styles entry point
│   │   ├── components/    # Component styles
│   │   ├── config/        # Style configuration
│   │   └── views/         # View-specific styles
│   │       └── {view}/
│   │           └── page.css
│   └── shared/            # Shared HTML components
│       ├── components/    # Reusable components
│       └── sections/      # Page sections
├── public/                # Static assets
│   ├── fonts/
│   ├── icons/
│   └── images/
├── data/                  # JSON data files
├── dist/                  # Build output (generated)
├── index.html             # Main HTML entry
├── about.html             # About page
├── package.json           # Project dependencies
├── bun.lock              # Bun lockfile
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
└── eslint.config.js      # ESLint configuration
```

### Key Conventions

- **View structure**: Each view has `page.ts` and `page.css` in its respective directories
- **Path aliases**:
  - `@` → `src/`
  - `@scripts` → `src/scripts/`
  - `@styles` → `src/styles/`
- **Naming**: Use kebab-case for all directories and files
- **Auto-discovery**: Vite automatically discovers `page.{ts,css}` files in view directories

## Technology Stack

- **Runtime**: Bun
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: SCSS with PostCSS
- **Linting**: ESLint, Stylelint, Prettier
- **UI Library**: Swiper (for sliders)

## Additional Resources

- [Bun Documentation](https://bun.sh/docs)
- [Vite Documentation](https://vite.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Troubleshooting

**Bun command not found after installation:**
- Restart your terminal
- Source your shell profile: `source ~/.bashrc` or `source ~/.zshrc`
- Check if Bun is in your PATH: `echo $PATH`

**Port already in use:**
- The dev server will automatically use the next available port
- Or manually specify a port: `bun run dev -- --port 3001`

**Build errors:**
- Clear the cache: `rm -rf node_modules .vite dist`
- Reinstall dependencies: `bun install`
- Run type checking: `bunx tsc --noEmit`

**Windows-specific issues:**
- If using native Windows and encountering issues, try WSL2
- Ensure your PowerShell execution policy allows scripts
- Run PowerShell as Administrator if needed

## License

[Add your license here]
