<script lang="ts">
	import Icon from "@iconify/svelte";
	import editor from "../lib/stores/editor";
</script>

<div class="main">
	<div class="header">
		<h3>Hierarchy</h3>

		{#if $editor.document}
			<div class="actions">
				<button
					onclick={() => {
						editor.actions.createElement("text");
					}}><Icon icon="material-symbols:add-box-outline" width="16" /> Text</button
				>
				<!--<button><Icon icon="material-symbols:add-box-outline" /> Group</button>-->
				<!--
				<button
					onclick={() => {
						editor.actions.createElement("image");
					}}><Icon icon="material-symbols:add-box-outline" width="16" /> Image</button
				>-->
			</div>
		{/if}
	</div>
	{#if $editor.document}
		<div class="hierachy">
			{#each $editor.document?.elements as element}
				<div
					class="element"
					class:active={$editor.selected?.id === element.id}
					role="button"
					tabindex="0"
					onclick={() => editor.actions.selectElement(element.id)}
					onkeydown={(e) => {
						if (e.key === "Enter" || e.key === " ") editor.actions.selectElement(element.id);
					}}
				>
					{#if element.type === "text"}
						<Icon icon="material-symbols:text-fields-rounded" width="20" />
					{:else}
						<Icon icon="material-symbols:photo-camera-back-outline-rounded" width="20" />
					{/if}
					<input
						data-value={$state.snapshot(element.name)}
						bind:value={element.name}
						onfocusout={(event: FocusEvent) => {
							if ((event.target as HTMLInputElement).value.length === 0) {
								element.name = (event.target as HTMLInputElement).getAttribute("data-value")!;
								(event.target as HTMLInputElement).value = (
									event.target as HTMLInputElement
								).getAttribute("data-value")!;
							} else {
								event.target!.submit();
							}
						}}
						onsubmit={(event: SubmitEvent) => {
							if ((event.target as HTMLInputElement).value.length === 0) {
								event.preventDefault();
								element.name = (event.target as HTMLInputElement).getAttribute("data-value")!;
								(event.target as HTMLInputElement).value = (
									event.target as HTMLInputElement
								).getAttribute("data-value")!;
							}
						}}
						type="text"
					/>
					<button type="button" onclick={() => editor.actions.deleteElement(element.id)}>
						<Icon icon="material-symbols:delete-outline-rounded" width="20" />
					</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.main {
		grid-area: hierarchy;
		margin-top: 10px;

		border-radius: 8px;
		background-color: var(--container);
	}

	.header {
		border-bottom: 1px solid #131317;
		align-items: center;
		display: flex;
		justify-content: start;
		height: 48px;

		color: white;
		padding-left: 24px;
		font-size: 12px;
		text-transform: uppercase;
	}

	/* Actions */
	.actions {
		margin-left: auto;
		margin-right: 16px;

		display: flex;
		align-items: center;
		gap: 10px;
	}

	.actions > button {
		border: none;
		border: 1px solid white;
		outline: none;
		background: none;
		border-radius: 4px;

		color: white;
		height: 28px;

		display: flex;
		align-items: center;
		justify-content: center;

		font-size: 12px;
		text-transform: uppercase;

		gap: 4px;

		cursor: pointer;

		transition: 0.2s background;
	}

	.actions > button:hover {
		background-color: rgba(255, 255, 255, 0.178);
	}

	/* Element */
	.element {
		height: 48px;

		display: flex;
		align-items: center;
		padding-left: 12px;
		gap: 16px;

		color: white;

		cursor: pointer;

		transition: 0.2s background;
	}

	.element:hover {
		background-color: rgba(126, 126, 126, 0.178);
	}

	:global(.active) {
		background-color: var(--color-accent-blue) !important;
	}

	.element:hover > button,
	:global(.active) > button {
		display: flex !important;
	}

	.element > button {
		margin-left: auto;
		margin-right: 16px;

		background: none;
		border: none;
		outline: none;

		color: white;

		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px;

		cursor: pointer;

		display: none;

		transition: 0.2s background;
	}

	.element > button:hover {
		background-color: #888888;

		border: none;
		outline: none;
	}

	.element > input {
		margin: 0;
		background: none;
		outline: none;
		border: none;

		color: white;
		font-size: 14px;

		max-width: 70%;

		field-sizing: content;

		padding: 8px;
		padding-left: 12px;
		padding-right: 12px;
		border-radius: 4px;

		transition: 0.2s background;
	}

	.element > input:focus,
	.element > input:hover {
		background-color: #13141788;
	}

	.element > input:focus {
		outline: white;
	}
</style>
