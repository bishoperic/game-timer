<script>
	import { slide } from 'svelte/transition';
	import {
		SettingsIcon,
		ArrowRightIcon,
		ArrowLeftIcon,
		CornerDownLeftIcon
	} from 'svelte-feather-icons';

	let players = [
		{
			name: 'Jeremy',
			scores: []
		},
		{
			name: 'Steven',
			scores: []
		},
		{
			name: 'Marc',
			scores: []
		}
	];

	function addUpScore(player, scoreIndex) {
		let sum = 0;
		for (let i = 0; i < scoreIndex && i < player.scores.length; i++) {
			sum += player.scores[i];
		}
		return sum;
	}

	function nextPlayer() {
		playerIndex = (playerIndex + 1) % players.length;
	}
	function previousPlayer() {
		playerIndex = (playerIndex - 1 + players.length) % players.length;
	}

	let playerIndex = 0;
	$: currentPlayer = players[playerIndex];
	let scoreInput;
</script>

<main>
	<h1>Score Calculator <button><SettingsIcon size="32" /></button></h1>

	<form
		class="player"
		on:submit={(e) => {
			e.preventDefault();
			if (!scoreInput) {
				return;
			}
			currentPlayer.scores.push(scoreInput);
			players = players;

			scoreInput = '';
		}}
	>
		<div class="player-name">
			<span>Player</span>
			{currentPlayer.name}
		</div>
		<div class="player-score">
			<span class="current-score">
				{addUpScore(currentPlayer, currentPlayer.scores.length)}
			</span>
			<ul>
				{#each currentPlayer.scores as scores, i}
					<div transition:slide>
						<li>
							{addUpScore(currentPlayer, i)}
						</li>
						<li data-sign={currentPlayer.scores[i] < 0 ? '-' : '+'}>
							{Math.abs(currentPlayer.scores[i])}
						</li>
					</div>
				{/each}
			</ul>
		</div>
		<input
			type="number"
			name="new-score"
			id="new-score"
			placeholder="Enter score"
			bind:value={scoreInput}
		/>
	</form>
	<div class="controls">
		<div>
			<span>Previous Player</span>
			<button class="icon-button" on:click={nextPlayer}>
				<ArrowLeftIcon size="64" />
			</button>
		</div>
		<div>
			<span>Next Player</span>
			<button class="icon-button" on:click={previousPlayer}>
				<ArrowRightIcon size="64" />
			</button>
		</div>
	</div>
</main>

<style>
	main {
		max-width: 700px;
		margin: 0 auto;
		position: relative;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-bottom: 2rem;
	}
	h1 {
		display: flex;
		flex-direction: row;
		align-items: center;
		text-align: center;
		gap: 0.5rem;
		margin: 1rem 0 0;
		font-size: 1.75rem;
	}
	h1 button {
		display: inline;
		color: var(--color-text-muted);
		cursor: pointer;
		border: none;
		padding: 0.5rem;
	}

	.icon-button {
		padding: 0.25rem;
		border-radius: var(--border-radius);
	}

	.player {
		max-width: 300px;
		text-align: center;
		margin: 0 1rem;
	}
	.player-name {
		font-size: 2.25rem;
		padding: 0.5rem;
		border: var(--border);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.player-name span {
		color: var(--color-text-muted);
		font-size: 1.25rem;
	}

	.player-score {
		border-left: var(--border);
		border-right: var(--border);
		padding: 0.5rem;

		max-height: 400px;
		overflow-y: scroll;

		display: flex;
		flex-direction: column-reverse;
	}
	.player-score ul {
		list-style: none;
		margin-bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: right;
	}
	.player-score ul li {
		margin-bottom: 0;
		font-size: 1.5rem;
		position: relative;
		padding-left: 1.5ch;
		width: auto;
		min-width: 5rem;
	}
	.player-score ul li:nth-child(2n - 1) {
		color: var(--color-text-muted);
		padding-left: 0;
	}
	.player-score ul li:nth-child(2n) {
		border-bottom: var(--border);
	}
	.player-score ul li:nth-child(2n)::before {
		content: attr(data-sign);
		color: var(--color-text-muted);
		position: absolute;
		/* for alignment */
		left: 4px;
		right: calc(100% - 1.5ch + 4px);
		top: -1px;

		text-align: center;
	}
	.player-score .current-score {
		font-size: 2.5rem;
		font-weight: bold;
		color: var(--color-text);
		text-align: center;
	}
	.player input {
		width: 100%;
		height: auto;
		border-radius: 0 0 var(--border-radius) var(--border-radius);
		font-size: 2rem;
		text-align: center;
	}

	.controls {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1rem;
	}

	.controls div {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.25rem;
	}

	.controls div span {
		text-align: center;
		color: var(--color-text-muted);
		max-width: 74px;
		line-height: 1.2;
	}

	@media (min-width: 400px) {
		h1 {
			font-size: 2.25rem;
		}
		.player-name {
			font-size: 3rem;
		}
		.player-name span {
			font-size: 1.5rem;
		}
	}
</style>
