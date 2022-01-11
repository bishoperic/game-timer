<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { PlusCircleIcon, XCircleIcon } from 'svelte-feather-icons';
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

	export let players = [
		{ id: Date.now(), name: '' },
		{ id: Date.now() + 1, name: '' }
	];
	export let turnLength = 0;
	$: turnLength = turnLengthMinutes * 60;

	let turnLengthMinutes = 0;

	export let visible = false;
</script>

{#if visible}
	<section>
		<h1>Configure Timer</h1>

		<div class="turn-length">
			<label for="time-per-turn">Turn length (minutes)</label>
			<input type="number" id="time-per-turn" bind:value={turnLengthMinutes} />
		</div>

		<hr />

		<button on:click={addPlayer} class="add-player"><PlusCircleIcon size="28" /> Add Player</button>

		<div
			class="players"
			use:dndzone={{ items: players, flipDurationMs: 300, dropTargetStyle }}
			on:consider={handleDndConsider}
			on:finalize={handleDndFinalize}
		>
			{#each players as item, i (item.id)}
				<div class="player" animate:flip={{ duration: 300 }}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
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
						<XCircleIcon size="28" />
					</button>
				</div>
			{/each}
		</div>
	</section>
{/if}

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: calc(0px + 112px);
		background-color: var(--color-primary);
		border: var(--border);
		border-color: var(--color-secondary);
		z-index: 1;
		overflow: scroll;
	}
	hr {
		width: 50%;
		border: 0;
		border-top: 4px solid var(--color-secondary);
	}

	.turn-length {
		margin-bottom: 0.5rem;
	}
	.turn-length label {
		margin: 0 0 0.25rem;
	}

	.add-player {
		border-radius: calc(var(--border-radius) / 2);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.25rem 1rem;
		margin-top: 0.5rem;
	}

	input {
		padding: 1.125rem 0.75rem;
		border-radius: calc(var(--border-radius) / 2);
		font-size: 1.25rem;
		line-height: 1.25;
		font-weight: bold;
		width: 15rem;
	}

	.players {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
	}

	.player {
		border: var(--border);
		border-radius: var(--border-radius);
		padding: 0.75rem;
		background-color: var(--color-primary);
		display: flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--color-text);
	}
	.player button {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		border: none;
	}
</style>
