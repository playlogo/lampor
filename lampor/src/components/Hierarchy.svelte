<script lang="ts">
	import Icon from "@iconify/svelte";
	import editor from "../lib/stores/editor";
</script>

<div class="main">
	<div class="header">
		<h3>Hierarchy</h3>

		{#if $editor.document}
			<div class="actions">
				<button><Icon icon="material-symbols:add-box-outline" width="16" /> Text</button>
				<!--<button><Icon icon="material-symbols:add-box-outline" /> Group</button>-->
				<button><Icon icon="material-symbols:add-box-outline" width="16" /> Image</button>
			</div>
		{/if}
	</div>
	{#if $editor.document}
		<div class="hierachy">
			{#each $editor.document?.elements as element}
				<div class="element">
					{#if element.type === "text"}
						<Icon icon="material-symbols:photo-camera-back-outline-rounded" />
					{:else}
						<Icon icon="material-symbols:text-fields-rounded" />
					{/if}
					<input bind:value={element.name} type="text" />
					<button on:click={() => editor.actions.deleteElement(element)}>
						<Icon icon="material-symbols:delete-outline-rounded" />
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
		border-bottom: 1px solid black;
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
</style>
