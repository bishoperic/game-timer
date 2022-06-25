<script>
	import { dndzone } from 'svelte-dnd-action';
	import { PlusIcon, XCircleIcon } from 'svelte-feather-icons';

	const dropTargetStyle = {};

	function handleDndConsider(e) {
		players = e.detail.items;
	}
	function handleDndFinalize(e) {
		players = e.detail.items;
	}
	function transformDraggedElement(draggedEl, data, index) {
		let styles = draggedEl.querySelector('.player').style;
		styles.borderRadius = 'calc(var(--border-radius) / 2)';
		styles.border = 'var(--border)';
		styles.borderColor = 'var(--color-highlight)';
	}

	function addPlayer() {
		players = [...players, { id: Date.now(), name: '' }];
	}

	export let players = [
		{ id: Date.now(), name: 'Jack' },
		{ id: Date.now() + 1, name: 'Jill' }
	];
</script>

<input type="hidden" name="players" value={JSON.stringify(players)} />

<div class="list">
	<div class="header">
		<h3>Players</h3>
		<button type="button" on:click={addPlayer} class="add-player">
			<PlusIcon size="28" />
		</button>
	</div>
	<div
		class="players"
		use:dndzone={{
			items: players,
			flipDurationMs: 300,
			// @ts-ignore
			dropTargetStyle,
			transformDraggedElement
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each players as item, i (item.id)}
			<div>
				<div class="player">
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
						type="button"
						on:click={() => {
							if (players.length <= 2) return;
							players.splice(i, 1);
							players = players;
						}}
					>
						<XCircleIcon size="28" />
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		border-bottom: var(--border);
		background-color: var(--color-secondary);
	}
	.header button {
		border-color: transparent;
		color: var(--color-text-muted);
	}
	.header button:hover,
	.header button:focus {
		border-color: var(--color-highlight);
	}
	.header > * {
		margin-left: auto;
	}

	h3 {
		margin: 0;
		text-align: center;
	}

	.add-player {
		border-radius: calc(var(--border-radius) / 2);
		padding: 0.125rem;
	}

	.list {
		display: flex;
		flex-direction: column;
		border-radius: calc(var(--border-radius) / 2);
		border: var(--border);
		overflow: auto;
	}
	.players > *:not(:last-child) > .player {
		border-bottom: var(--border);
	}

	:global(#dnd-action-dragged-el .player) {
		border-bottom: none;
		border-radius: calc(var(--border-radius) / 2);
	}

	input {
		padding: 1.125rem 0.75rem;
		border-radius: calc(var(--border-radius) / 2);
		font-size: 1.25rem;
		line-height: 1.25;
		width: 15rem;
	}

	.player {
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
