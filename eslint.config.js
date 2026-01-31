import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	js.configs.recommended,
	...tsEslint.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts,tsx}'],
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
			'@stylistic': stylistic,
			'simple-import-sort': simpleImportSort,
		},
		languageOptions: {
			parser: tsEslint.parser,
			parserOptions: {
				sourceType: 'module',
			},
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
		rules: {
			semi: ['error', 'always'],
			'prefer-const': 'error',
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						// Static assets (images, icons, fonts, etc) - non JS/TS files
						['^.+\\.(svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$'],
						// Side effect imports (CSS, SCSS)
						['^.+\\.(css|scss)$'],
						// Node modules / external packages
						['^@?\\w'],
						// Internal packages via aliases - with FSD layer ordering
						// shared layer
						['^@/shared', '^@scripts/shared'],
						// entities layer
						['^@/entities', '^@scripts/entities'],
						// features layer
						['^@/features', '^@scripts/features'],
						// widgets layer
						['^@/widgets', '^@scripts/widgets'],
						// Other internal aliases
						['^@/(?!(shared|entities|features|widgets))', '^@scripts/(?!(shared|entities|features|widgets))', '^@styles'],
						// Parent imports - put `..` last
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						// Other relative imports - same-folder imports and `.` last
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
						// Type imports (should be at the end of each logical group)
						['^.+\\u0000$'],
					],
				},
			],
			'simple-import-sort/exports': 'error',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-object-type': [
				'warn',
				{ allowInterfaces: 'with-single-extends' },
			],
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					fixStyle: 'separate-type-imports',
				},
			],
			'@stylistic/quotes': [
				'error',
				'single',
				{
					avoidEscape: true,
					allowTemplateLiterals: 'always',
				},
			],
			'@stylistic/jsx-quotes': ['error', 'prefer-double'],
			'@stylistic/brace-style': ['error', 'stroustrup'],
			'@stylistic/indent': ['error', 'tab', {
				ignoredNodes: ['TemplateLiteral > *'],
			}],
			'@stylistic/indent-binary-ops': ['error', 'tab'],
			'@stylistic/template-curly-spacing': ['error', 'never'],
			'no-restricted-syntax': [
				'error',
				{
					selector:
						'ImportDeclaration[source.value=/\\.(css|scss)$/] > ImportDefaultSpecifier[local.name!="css"]',
					message:
						'CSS/SCSS module imports must use "css" as the import name. Use "import css from \'...\'" instead.',
				},
			],
		},
	},
	{
		files: ['src/**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsEslint.parser,
			parserOptions: {
				sourceType: 'module',
				project: './tsconfig.json',
			},
		},
	},
	{
		ignores: ['dist', 'node_modules'],
	},
];
