<script>
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	export let value = 50;
	export let max = 100;
	export let color = 'blue';
	export let borderThickness = '8px';
	export let width = '100px';
	export let fontSize = '24px';
	export let emptyColor = '#ccc';
	export let flashing = false;

	$: {
		easedValue.set((value / max || 1) * 100);
	}

	$: easedValue = tweened(0, {
		duration: 300,
		easing: cubicOut
	});
</script>

<!-- based on: https://www.freecodecamp.org/news/css-only-pie-chart -->
<div
	class="ring"
	style="--progress: {$easedValue}; --color: {color}; --border-thickness: {borderThickness}; --width: {width}; --font-size: {fontSize}; --color-empty: {emptyColor};"
>
	<div
		class="pie"
		class:flashing
		style="--progress: {$easedValue}; --color: {color}; --border-thickness: {borderThickness}; --width: {width}; --font-size: {fontSize}; --color-empty: {emptyColor};"
	>
		<slot />
	</div>
</div>

<style>
	.pie {
		--progress: 0;
		--border-thickness: 8px;
		--color: black;
		--width: 100px;
		--font-size: 24px;

		width: var(--width);
		height: var(--width);
		position: relative;
		display: inline-grid;
		margin: 0;
		place-content: center;
		font-size: var(--font-size);
		font-weight: bold;
	}
	.pie:before,
	.pie:after {
		content: '';
		position: absolute;
		border-radius: 50%;
	}
	.pie:before {
		inset: 0;
		background: radial-gradient(farthest-side, var(--color) 100%, #0000) top/var(--border-thickness)
				var(--border-thickness) no-repeat,
			conic-gradient(var(--color) calc(var(--progress) * 1%), #0000 0);
		-webkit-mask: radial-gradient(
			farthest-side,
			#0000 calc(99.9% - var(--border-thickness)),
			#000 calc(100% - var(--border-thickness))
		);
		mask: radial-gradient(
			farthest-side,
			#0000 calc(99.9% - var(--border-thickness)),
			#000 calc(100% - var(--border-thickness))
		);
	}
	.pie:after {
		inset: calc(50% - var(--border-thickness) / 2);
		background: var(--color);
		transform: rotate(calc(var(--progress) * 3.6deg)) translateY(calc(50% - var(--width) / 2));
	}

	@keyframes flash {
		0% {
			opacity: 1;
		}
		25% {
			opacity: 0.7;
		}
		45% {
			opacity: 0;
		}
		55% {
			opacity: 0;
		}
		75% {
			opacity: 0.7;
		}
		100% {
			opacity: 1;
		}
	}

	.pie.flashing:after {
		opacity: 0;
	}
	.pie.flashing:before {
		animation: flash 1s infinite;
	}

	.ring {
		position: relative;
		width: var(--width);
		height: var(--width);
	}
	.ring:before {
		content: '';
		position: absolute;
		border-radius: 50%;
		inset: 0;
		background: conic-gradient(var(--color-empty) 100%, #0000 0);
		-webkit-mask: radial-gradient(
			farthest-side,
			#0000 calc(99.9% - var(--border-thickness)),
			#000 calc(100% - var(--border-thickness))
		);
		mask: radial-gradient(
			farthest-side,
			#0000 calc(99.9% - var(--border-thickness)),
			#000 calc(100% - var(--border-thickness))
		);
	}
</style>
