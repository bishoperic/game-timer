<script>
	import { browser } from '$app/env';
	import { fly } from 'svelte/transition';
	import PieProgressBar from '../components/pie-progress-bar.svelte';
	import {
		PauseIcon,
		SquareIcon,
		PlayIcon,
		SettingsIcon,
		SkipForwardIcon
	} from 'svelte-feather-icons';
	import PlayerSelection from '../components/player-selection.svelte';
	import Modal from '../components/modal.svelte';
	import Form from '../components/form.svelte';
	import { settings } from '../lib/stores';
	import ToggleSwitch from '../components/toggle-switch.svelte';
	import TimeSelection from '../components/time-selection.svelte';

	let timer = {
		time: $settings.turnLength,
		ticking: false,
		timerReference: null,
		ended: false,
		beepSound: browser ? new Audio('/audio/timer-beep.mp3') : null,
		start(inputTime = 0) {
			if (timer.time <= 0) {
				timer.time = $settings.turnLength;

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
					timer.ended = true;
					timer.startBeeping();

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
			if (timer.ticking) {
				this.stop();
			} else if (timer.ended) {
				timer.ended = false;
				timer.stopBeeping();

				this.start();
			} else {
				this.start();
			}
		},
		reset() {
			timer.ended = false;
			timer.stopBeeping();

			timer.time = $settings.turnLength;
			this.stop();
		},
		startBeeping() {
			if ($settings.muteAlarm) {
				return;
			}

			timer.beepSound.loop = true;
			timer.beepSound.play();
		},
		stopBeeping() {
			timer.beepSound.pause();
			timer.beepSound.currentTime = 0;
		}
	};

	function nextPlayer() {
		timer.reset();

		// loop back to first player if we're at the end
		if (currentPlayer === $settings.players.length - 1) {
			currentPlayer = 0;
		} else {
			currentPlayer++;
		}
	}

	function updateSettings(e) {
		$settings.turnLength = e.detail.turnLength ?? $settings.turnLength;
		$settings.players = JSON.parse(e.detail.players) ?? $settings.players;
		let muteAlarm = (e.detail.muteAlarm ?? $settings.muteAlarm) === 'true' ? true : false;
		$settings.muteAlarm = muteAlarm;

		if ($settings.players.length - 1 < currentPlayer) {
			currentPlayer = 0;
		}

		timer.reset();
	}

	let currentPlayer = 0;

	let settingsModal;
	let settingsForm;
	let timeSelectionModal;

	$: minutes = Math.floor(timer.time / 1000 / 60);
	$: seconds =
		Math.round(timer.time / 1000 - minutes * 60) < 10
			? '0' + Math.round(timer.time / 1000 - minutes * 60)
			: Math.round(timer.time / 1000 - minutes * 60);
</script>

<main>
	<Modal
		title="Timer Settings"
		bind:modal={settingsModal}
		on:hide={(e) => {
			settingsForm.save();
		}}
	>
		<Form on:save={updateSettings} bind:form={settingsForm}>
			<div class="list">
				<div class="input">
					<label for="turnLength">Turn length (minutes)</label>
					<TimeSelection name="turnLength" value={$settings.turnLength} class="spacing" />
				</div>

				<div class="checkbox">
					<label for="muteAlarm">Mute Alarm?</label>
					<ToggleSwitch class="switch" name="muteAlarm" value={$settings.muteAlarm} />
				</div>
			</div>

			<PlayerSelection players={$settings.players} />
		</Form>
	</Modal>

	{#key currentPlayer}
		<header in:fly={{ y: -25 }}>
			<h1>
				{$settings.players[currentPlayer].name}'s Turn
			</h1>
			<h2>
				Next up: {$settings.players[
					currentPlayer == $settings.players.length - 1 ? 0 : currentPlayer + 1
				].name}
			</h2>
		</header>
	{/key}

	<PieProgressBar
		bind:value={timer.time}
		bind:max={$settings.turnLength}
		width="400px"
		fontSize="100px"
		borderThickness="16px"
		color={!timer.ended ? 'var(--color-highlight)' : 'red'}
		emptyColor="var(--color-secondary)"
		flashing={timer.ended}
	>
		<span>{minutes}:{seconds}</span>
	</PieProgressBar>

	<menu>
		<button
			on:click={() => {
				settingsModal.show();
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
			{:else if timer.ended}
				<SquareIcon size="64" />
			{:else}
				<PlayIcon size="64" />
			{/if}
		</button>

		<button on:click={nextPlayer}><SkipForwardIcon size="64" /> </button>
	</menu>
</main>

<style>
	main {
		max-width: 500px;
		margin: 0 auto;
		padding: 2rem 0;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	header {
		text-align: center;
		line-height: 1;
		margin: 0 0 1rem;
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

	.list {
		display: flex;
		flex-direction: column;
		border-radius: calc(var(--border-radius) / 2);
		border: var(--border);
		margin-bottom: 1rem;
		overflow: auto;
	}
	.list > *:not(:last-child) {
		border-bottom: var(--border);
	}

	.input,
	.checkbox {
		display: flex;
		flex-direction: row;
		align-items: center;
		position: relative;
		padding-left: 1rem;
		min-height: 3rem;
	}
	.input input,
	.checkbox :global(.switch) {
		margin-left: auto;
	}
	.input input {
		height: calc(3rem - 1px);
		width: 6rem;
		font-size: 1.2rem;
		border: none;
		background-color: var(--color-secondary);
		text-align: center;

		position: relative;
	}
	.checkbox :global(.switch) {
		margin-right: 0.5rem;

		--size: 28px;
		--color-background: var(--color-secondary);
		--color-main: var(--color-highlight);
		--color-unchecked: #92959f;
		--border-color: var(--color-border);
	}

	.input label,
	.checkbox label {
		margin: 0.5rem 0;
	}

	:global(.spacing) {
		margin-left: auto;
	}
</style>
