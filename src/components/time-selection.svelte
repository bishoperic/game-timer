<script lang="ts">
	import { selectOnFocus } from '$lib/node';
	import { onMount } from 'svelte';

	export let value;
	export let name;

	let inputs = [];
	let inputValues = ['0', '00'];

	inputValues[0] = Math.floor(value / 60_000).toString();
	inputValues[1] = ((value % 60_000) / 1000).toString().padStart(2, '0');

	$: value = (+inputValues[0] * 60 + +inputValues[1]) * 1000;
</script>

<input type="hidden" {name} {value} />

<div class="{$$props.class} wrapper">
	<label class="input">
		<input
			type="number"
			id="minutes"
			bind:this={inputs[0]}
			bind:value={inputValues[0]}
			use:selectOnFocus
			on:input={(e) => {
				// @ts-ignore
				if (e.target.value.toString().length >= 2) {
					inputs[1].focus();
				}
			}}
			on:blur={(e) => {
				// @ts-ignore
				e.target.value = e.target.value.padStart(1, '0');
			}}
		/>
		m
	</label>
	<label class="input">
		<input
			type="number"
			id="seconds"
			bind:this={inputs[1]}
			bind:value={inputValues[1]}
			use:selectOnFocus
			on:input={(e) => {
				// @ts-ignore
				if (e.target.value.toString().length >= 2) {
					inputs[1].blur();
				}
			}}
			on:blur={(e) => {
				// @ts-ignore
				e.target.value = e.target.value.padStart(2, '0');
			}}
		/>
		s
	</label>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: row;
		justify-content: center;
		border: none;
		background-color: var(--color-secondary);
		font-size: 1.2rem;
		height: calc(3rem - 1px);
		width: 6.5rem;
	}
	.input:nth-child(n) {
		padding-right: 5px;
	}
	.input:first-child {
		padding-left: 10px;
	}
	.input:last-child {
		padding-right: 10px;
	}
	.input {
		display: flex;
		align-items: center;
		justify-content: right;
		cursor: text;
		margin: 0;
		border-radius: calc(var(--border-radius) / 2);
	}
	.input input[type='number'],
	.input input[type='text'] {
		margin: 0;
		padding: 0;
		width: 100%;
		max-width: 2ch;
		height: 24px;
		border: none;
		background-color: transparent;
		text-align: right;
	}
</style>
