import { browser } from '$app/env';
import { writable } from 'svelte/store';

const defaultTurnLength = 300;
const defaultPlayers = [
	{ id: Date.now(), name: '' },
	{ id: Date.now() + 1, name: '' }
];

const initialTurnLength = browser
	? +window.localStorage.getItem('turnLength') ?? defaultTurnLength
	: defaultTurnLength;
const initialPlayers = browser
	? JSON.parse(window.localStorage.getItem('players')) ?? defaultPlayers
	: defaultPlayers;

export const turnLength = writable(initialTurnLength);
export const players = writable(initialPlayers);

turnLength.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('turnLength', value.toString());
	}
});
players.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('players', JSON.stringify(value));
	}
});
