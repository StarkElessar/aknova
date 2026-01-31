import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';

export function htmlInclude(options: { componentsDir: string }): Plugin {
	return {
		name: 'html-include',
		transformIndexHtml(html) {
			// Заменяем <%- include('component.html') %> на содержимое компонента
			return html.replace(/<%- include\(['"](.+?)['"]\) %>/g, (_, componentPath) => {
				const fullPath = resolve(options.componentsDir, componentPath);
				try {
					return readFileSync(fullPath, 'utf-8');
				} catch (error) {
					console.error(`Failed to include component: ${fullPath}`);
					return `<!-- Component not found: ${componentPath} -->`;
				}
			});
		}
	};
}
