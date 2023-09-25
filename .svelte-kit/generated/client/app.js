export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8')
];

export const server_loads = [];

export const dictionary = {
		"/(app)": [3,[2]],
		"/(question)/in_construction": [7],
		"/(app)/lessons": [4,[2]],
		"/(app)/lessons/[id]": [~5,[2]],
		"/(app)/quiz": [~6,[2]],
		"/(question)/quiz/[totalQuestions]+[indexQuestion]": [~8]
	};

export const hooks = {
	handleError: (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';