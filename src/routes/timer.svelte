<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import type { TimerSettings } from '$lib/timer-settings';
	import { Buffer } from 'buffer';
	import PieProgressBar from '../components/pie-progress-bar.svelte';
	import { onMount } from 'svelte';

	function getTimerSettings() {
		let timerData = $page.url.searchParams.get('data');

		let parsedData: TimerSettings = JSON.parse(Buffer.from(timerData, 'base64').toString('ascii'));

		return parsedData;
	}

	let { turnLength, players } = getTimerSettings();

	let timer = {
		time: turnLength,
		ticking: false,
		timerReference: null,
		start(inputTime: number = 0) {
			if (inputTime > 0) {
				timer.time = inputTime;
			}
			if (timer.time <= 0) {
				timer.time = turnLength;
			}

			timer.ticking = true;

			timer.timerReference = setInterval(() => {
				timer.time -= 1;
				timer = timer;

				if (this.time <= 0) {
					this.stop();
				}
			}, 1000);
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
			timer.time = turnLength;
			this.stop();
		}
	};

	function nextPlayer() {
		timer.reset();

		// loop back to first player if we're at the end
		if (currentPlayer === players.length - 1) {
			currentPlayer = 0;
		} else {
			currentPlayer++;
		}

		console.log(timer.ticking);
	}

	let currentPlayer = 0;

	$: minutes = Math.floor(timer.time / 60);
	$: seconds =
		Math.floor(timer.time - minutes * 60) < 10
			? '0' + Math.floor(timer.time - minutes * 60)
			: Math.floor(timer.time - minutes * 60);
</script>

<header class="current-player">
	{#key currentPlayer}
		<h1 in:fade>
			{players[currentPlayer].name}'s Turn
		</h1>
	{/key}
</header>
<PieProgressBar
	bind:value={timer.time}
	bind:max={turnLength}
	width="400px"
	fontSize="100px"
	borderThickness="16px"
	color="var(--color-highlight)"
	emptyColor="var(--color-secondary)"
>
	{#key currentPlayer}
		<span in:fade>{minutes}:{seconds}</span>
	{/key}
</PieProgressBar>
<button on:click={nextPlayer} in:fade>Next Player</button>
<button
	on:click={() => {
		timer.toggle();
	}}
>
	{#if timer.ticking}
		Pause
	{:else}
		Play
	{/if}
</button>

<style>
	.timer {
		font-size: 4rem;
		font-weight: bold;
		text-align: center;
		margin: 0;
	}
	.current-player {
		max-height: 64px;
		overflow: hidden;
	}
	h1 {
		line-height: 1;
		margin: 16px 0;
		overflow: scroll;
	}
</style>
