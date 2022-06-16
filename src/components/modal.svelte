<script>
	import { createEventDispatcher } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { XIcon } from 'svelte-feather-icons';

	const dispatch = createEventDispatcher();

	let previousState = false;
	export let open = false;
	export let title = '';

	export const modal = {
		show() {
			open = true;
		},
		hide() {
			open = false;
		}
	};

	$: {
		if (open && !previousState) {
			dispatch('show', null);
		} else if (!open && previousState) {
			dispatch('hide', null);
		}
		previousState = open;
	}
</script>

{#if open}
	<div class="background" transition:fade={{ duration: 200 }} on:click={modal.hide} />
	<div class="modal-container">
		<div class="modal" transition:fly={{ y: 75 }}>
			<div class="modal-header">
				<h2>{title}</h2>
				<button
					on:click={() => {
						open = false;
					}}
				>
					<XIcon size="28" />
				</button>
			</div>
			<div class="modal-body">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.background {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 1;

		background-color: rgba(1, 4, 9, 0.8);
	}
	.modal-container {
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		left: 0;
		z-index: 1;

		pointer-events: none;

		display: flex;
		align-items: center;
		justify-content: center;
	}
	.modal {
		background-color: var(--color-secondary);
		border-radius: var(--border-radius);
		border: var(--border);
		min-width: 200px;
		pointer-events: auto;
	}
	.modal-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		padding: 0.5rem 0.5rem 0.5rem 1rem;
		border-bottom: var(--border);
		background-color: var(--color-secondary);
		border-radius: var(--border-radius) var(--border-radius) 0 0;
	}
	.modal-header h2 {
		margin: 0;
		margin-left: auto;
		align-self: center;
		line-height: 1.2;
	}
	.modal-header button {
		color: var(--color-text-muted);
		border-color: transparent;
		border-radius: calc(var(--border-radius) / 2);
		padding: 0.125rem;
		margin-left: auto;
	}
	.modal-header button:hover,
	.modal-header button:focus {
		border-color: var(--color-highlight);
	}

	.modal-body {
		padding: 1rem;
		background-color: var(--color-primary);
		border-radius: 0 0 var(--border-radius) var(--border-radius);
	}
</style>
