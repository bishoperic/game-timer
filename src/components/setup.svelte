<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { XCircleIcon } from 'svelte-feather-icons';
	import { Buffer } from 'buffer';
	import type { TimerSettings } from '$lib/timer-settings';

	const dropTargetStyle = { outline: 'var(--border)', 'border-radius': 'var(--border-radius)' };
	function handleDndConsider(e) {
		players = e.detail.items;
	}
	function handleDndFinalize(e) {
		players = e.detail.items;
	}

	function addPlayer() {
		players = [...players, { id: Date.now(), name: '' }];
	}

	let players = [
		{ id: Date.now(), name: '' },
		{ id: Date.now() + 1, name: '' }
	];
	let turnLength = 0;

	let data: TimerSettings;
	$: data = {
		players,
		turnLength: turnLength * 60
	};

	$: encodedData = Buffer.from(JSON.stringify(data), 'ascii').toString('base64');
</script>

<h1>Configure Timer</h1>
<button on:click={addPlayer}>Add Player</button>

<section
	use:dndzone={{ items: players, flipDurationMs: 300, dropTargetStyle }}
	on:consider={handleDndConsider}
	on:finalize={handleDndFinalize}
>
	{#each players as item, i (item.id)}
		<div class="player" animate:flip={{ duration: 300 }}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<circle cx="9" cy="12" r="1" />
				<circle cx="9" cy="5" r="1" />
				<circle cx="9" cy="19" r="1" />
				<circle cx="15" cy="12" r="1" />
				<circle cx="15" cy="5" r="1" />
				<circle cx="15" cy="19" r="1" />
			</svg>
			<input type="text" placeholder={'Player ' + (i + 1)} bind:value={item.name} />
			<button
				on:click={() => {
					players.splice(i, 1);
					players = players;
				}}
			>
				<XCircleIcon size="20" />
			</button>
		</div>
	{/each}
</section>

<label for="time-per-turn">Time per turn (in minutes)</label>
<input type="number" id="time-per-turn" bind:value={turnLength} />

<button><a href={`/timer?data=${encodedData}`}>Next</a></button>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		margin: 0.5rem;
		padding: 1rem;
	}
	.player {
		border: var(--border);
		padding: 0.5rem;
		background-color: var(--color-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.player button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: none;
	}
</style>
