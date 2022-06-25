<script>
	export let name = 'undefined';
	export let disabled = false;
	export let value = false;
</script>

<input type="hidden" name="muteAlarm" value={false} />
<label class="{$$props.class} toggle" for={name}>
	<input
		type="checkbox"
		class="toggle-input"
		id={name}
		{name}
		{disabled}
		checked={!value ? null : true}
		value={true}
	/>
	<span class="toggle-track">
		<span class="toggle-indicator" />
	</span>
</label>

<style>
	.toggle {
		align-items: center;
		display: flex;
		font-weight: 700;
		margin: 0;

		--track-height: calc(var(--size) + 4px);
		--track-width: calc(var(--size) * 2.5);
	}
	:where(.toggle) {
		--size: 24px;
		--color-background: #fafafa;
		--border-color: #1c1c1c;
		--color-main: #2e2e2e;
		--color-unchecked: #7c7c7c;
		--color-disabled: #aeaeae;
	}
	.toggle-input {
		clip: rect(0 0 0 0);
		clip-path: inset(50%);
		height: 1px;
		overflow: hidden;
		position: absolute;
		white-space: nowrap;
		width: 1px;
	}
	.toggle-input:not([disabled]):active + .toggle-track,
	.toggle-input:not([disabled]):focus + .toggle-track {
		border: 1px solid transparent;
		outline: 2px solid var(--color-main);
	}
	.toggle-input:disabled + .toggle-track {
		cursor: not-allowed;
	}
	.toggle-input:disabled + .toggle-track .toggle-indicator {
		background: var(--color-diabled);
	}
	.toggle-track {
		background: var(--color-background);
		border: 1px solid var(--border-color);
		border-radius: 100vmax;
		cursor: pointer;
		display: flex;
		height: var(--track-height);
		position: relative;
		width: var(--track-width);
	}
	.toggle-indicator {
		align-items: center;
		background: var(--color-unchecked);
		border-radius: var(--size);
		bottom: 2px;
		display: flex;
		height: var(--size);
		justify-content: center;
		left: 2px;
		outline: solid 2px transparent;
		position: absolute;
		transition: transform 0.2s, background 0.2s;
		width: var(--size);
	}

	.toggle-input:checked + .toggle-track .toggle-indicator {
		background: var(--color-main);
		transform: translateX(calc(var(--track-width) - var(--track-height)));
	}
</style>
