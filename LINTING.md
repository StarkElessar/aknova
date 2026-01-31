# Linting & Formatting

Этот проект использует разделение ответственности между инструментами:

## Инструменты

- **ESLint + @stylistic** - форматирование и проверка JS/TS кода
- **Stylelint** - форматирование и проверка CSS/SCSS
- **Prettier** - форматирование ТОЛЬКО HTML файлов
- **EditorConfig** - базовые настройки редактора

## Почему Prettier не форматирует JS/TS/CSS?

Prettier может конфликтовать с ESLint и Stylelint. Чтобы избежать этого:
- JS/TS файлы форматируются через ESLint + @stylistic
- CSS файлы форматируются через Stylelint
- HTML файлы форматируются через Prettier

Это настроено в `.prettierignore`.

## Команды

```bash
# Проверка всего кода
bun run lint

# Автоматическое исправление
bun run lint:fix

# Форматирование HTML/JSON/MD
bun run format
```

## Порядок импортов

Импорты автоматически сортируются в следующем порядке:
1. Статические файлы (.svg, .png, .jpg, и т.д.)
2. CSS/SCSS файлы
3. Node modules
4. Внутренние пакеты (FSD слои): shared → entities → features → widgets
5. Другие алиасы (@/, @scripts/, @styles/)
6. Родительские директории (..)
7. Текущая директория (.)
8. Type импорты (в конце каждой группы)
