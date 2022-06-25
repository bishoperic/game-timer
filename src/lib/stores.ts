import { browser } from '$app/env';
import { writable } from 'svelte/store';

export const settings = createLocalStorageStore('settings', {
	turnLength: 60_000,
	muteAlarm: false,
	players: [
		{ id: Date.now(), name: 'Jack' },
		{ id: Date.now() + 1, name: 'Jill' }
	]
});

export function createLocalStorageStore<T>(
	key: string,
	defaultValue: T,
	getter = (valueInStorage: string) => {
		return JSON.parse(valueInStorage);
	},
	setter = (valueToStore: unknown) => {
		return JSON.stringify(valueToStore);
	}
): SvelteStore<T> {
	let initialValue;

	try {
		const valueInStorage = localStorage.getItem(key);

		if (valueInStorage) {
			initialValue = getter(valueInStorage);
		} else {
			initialValue = defaultValue;
		}
	} catch (error) {
		initialValue = defaultValue;

		console.log('Malformed data found in localStorage, resetting to default');
		if (browser) {
			window.localStorage.setItem(key, setter(defaultValue));
		}
	}

	const store = writable(initialValue);

	store.subscribe((value) => {
		if (browser) {
			window.localStorage.setItem(key, setter(value));
		}
	});

	return store;
}
