<script lang="ts">
	import { page } from '$app/stores';
	import type { TimerSettings } from '$lib/timer-settings';
	import { Buffer } from 'buffer';

	function getTimerSettings() {
		let timerData = $page.url.searchParams.get('data');

		let parsedData: TimerSettings = JSON.parse(Buffer.from(timerData, 'base64').toString('ascii'));

		return parsedData;
	}

	let { turnLength, players } = getTimerSettings();

	let timer = {
		time: turnLength * 60,
		ticking: false,
		timerReference: null,
		start(inputTime: number = 0) {
			if (inputTime > 0) {
				this.time = inputTime;
			}

			this.ticking = true;

			this.timerReference = setInterval(() => {
				this.time--;
				timer = timer;

				if (this.time <= 0) {
					this.stop();
				}
			}, 1000);
		},
		stop() {
			clearInterval(this.timerReference);
			this.ticking = false;
		},
		toggle() {
			if (this.ticking) {
				this.stop();
			} else {
				this.start();
			}
		},

		reset() {
			this.time = turnLength * 60;
		}
	};

	let currentPlayer = 0;

	$: minutes = Math.floor(timer.time / 60);
	$: seconds =
		Math.floor(timer.time - minutes * 60) < 10
			? '0' + Math.floor(timer.time - minutes * 60)
			: Math.floor(timer.time - minutes * 60);

	function nextPlayer() {
		timer.reset();
		timer.start();

		// loop back to first player if we're at the end
		if (currentPlayer === players.length - 1) {
			currentPlayer = 0;
		} else {
			currentPlayer++;
		}
	}
</script>

<h1>{players[currentPlayer].name}'s Turn</h1>
<h2 class="timer">{minutes}:{seconds}</h2>
<button on:click={nextPlayer}>Next Player</button>
<button
	on:click={() => {
		timer.toggle();
	}}
>
	{#if true}
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
</style>
