import viteLogo from '/vite.svg';

import '../styles/main.css';

import { setupCounter } from './counter.ts';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<div>
		<a href="https://vite.dev" target="_blank">
			<img src="${viteLogo}" class="logo" alt="Vite logo" />
		</a>
	</div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
