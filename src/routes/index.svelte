<script lang="ts">
	import { fly } from 'svelte/transition';
	import PieProgressBar from '../components/pie-progress-bar.svelte';
	import { PauseIcon, PlayIcon, SettingsIcon, SkipForwardIcon } from 'svelte-feather-icons';
	import TimerOptions from '../components/timer-options.svelte';
	import { turnLength, players } from '../lib/stores';

	let timer = {
		time: $turnLength,
		ticking: false,
		timerReference: null,
		start(inputTime: number = 0) {
			if (timer.time <= 0) {
				timer.time = $turnLength;

				return;
			}
			if (inputTime > 0) {
				timer.time = inputTime;
			}

			timer.ticking = true;

			let prev = Date.now();
			timer.timerReference = setInterval(function () {
				let delta = Date.now() - prev; // milliseconds elapsed since start
				timer.time -= delta;

				prev = Date.now();

				if (timer.time <= 0) {
					timer.time = 0;
					timer.stop();
				}
			}, 1000); // update about every second
		},
		stop() {
			timer.ticking = false;
			clearInterval(this.timerReference);
		},
		toggle() {
			if (this.ticking) {
				this.stop();
			} else {
				this.start();
			}
		},
		reset() {
			timer.time = $turnLength;
			this.stop();
		}
	};

	function nextPlayer() {
		timer.reset();

		// loop back to first player if we're at the end
		if (currentPlayer === $players.length - 1) {
			currentPlayer = 0;
		} else {
			currentPlayer++;
		}
	}

	function updateSettings(e) {
		$turnLength = e.detail.turnLength;
		$players = e.detail.players;
		timer.reset();
	}

	let currentPlayer = 0;
	let optionsVisible = false;

	$: minutes = Math.floor(timer.time / 1000 / 60);
	$: seconds =
		Math.round(timer.time / 1000 - minutes * 60) < 10
			? '0' + Math.round(timer.time / 1000 - minutes * 60)
			: Math.round(timer.time / 1000 - minutes * 60);
</script>

<main>
	<TimerOptions
		bind:visible={optionsVisible}
		on:update-options={updateSettings}
		turnLength={$turnLength / 60e3}
		players={$players}
	/>

	{#key currentPlayer}
		<header in:fly={{ y: -25 }}>
			<h1>
				{$players[currentPlayer].name}'s Turn
			</h1>
			<h2>
				Next up: {$players[currentPlayer == $players.length - 1 ? 0 : currentPlayer + 1].name}
			</h2>
		</header>
	{/key}

	<PieProgressBar
		bind:value={timer.time}
		bind:max={$turnLength}
		width="400px"
		fontSize="100px"
		borderThickness="16px"
		color="var(--color-highlight)"
		emptyColor="var(--color-secondary)"
	>
		<span>{minutes}:{seconds}</span>
	</PieProgressBar>

	<menu>
		<button
			on:click={() => {
				optionsVisible = !optionsVisible;
			}}
		>
			<SettingsIcon size="60" />
		</button>

		<button
			on:click={() => {
				timer.toggle();
			}}
			style="padding-left: 0.75rem;"
		>
			{#if timer.ticking}
				<PauseIcon size="64" />
			{:else}
				<PlayIcon size="64" />
			{/if}
		</button>

		<button on:click={nextPlayer}><SkipForwardIcon size="64" /> </button>
	</menu>
</main>

<style>
	main {
		max-width: 700px;
		margin: 0 auto;
		position: relative;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	header {
		text-align: center;
		line-height: 1;
		margin: 2rem 0 1rem;
	}
	header h1 {
		font-size: 3rem;
		margin: 0;
	}
	header h2 {
		font-size: 1.5rem;
		margin: 0;

		color: var(--color-text-muted);
	}

	menu {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		list-style-type: none;
		margin: 1rem 0 0;
		padding: 0.25rem 0.5rem;

		border: var(--border);
		border-radius: var(--border-radius);
	}
	menu button {
		display: flex;
		align-items: center;
		justify-content: center;
		aspect-ratio: 1;

		padding: 0.25rem;
		line-height: 1;
		border: none;
	}
</style>
