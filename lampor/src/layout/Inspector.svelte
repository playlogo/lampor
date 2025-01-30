<script lang="ts">
	import Icon from "@iconify/svelte";

	import editor from "../lib/stores/editor";
</script>

<div class="container">
	<div class="header">
		<h3>
			<span>Inspector</span>
			{#if $editor.selected}
				- {$editor.selected.name}
			{/if}
		</h3>
	</div>
	{#if $editor.selected}
		<div class="entry">
			<p>Position</p>
			<div>
				<div class="group">
					<span>X</span>
					<input type="number" bind:value={$editor.selected.position.x} />
				</div>

				<div class="group">
					<span>Y</span>
					<input type="number" bind:value={$editor.selected.position.y} />
				</div>
			</div>
		</div>
		{#if $editor.selected.type === "text"}
			<div class="entry">
				<p>Text</p>
				<div>
					<div class="group">
						<textarea bind:value={$editor.selected.text.content}></textarea>
					</div>
				</div>
				<div>
					<div class="group">
						<span>Font</span>
						<select bind:value={$editor.selected.text.font}>
							<optgroup label="Default">
								<option value="Default">Default</option>
								<option value="Google">Google</option>
							</optgroup>
							<optgroup label="Custom">
								<option value="Facebook">Facebook</option>
							</optgroup>
						</select>
					</div>
					<div class="group">
						<span>Size</span>
						<input type="number" bind:value={$editor.selected.text.size} />
					</div>
				</div>
				<div>
					<div class="group">
						<span>Color</span>
						<input type="color" bind:value={$editor.selected.text.color} />
					</div>
				</div>

				<div>
					<!--
					<div class="group">
						<span>Alignment</span>
						<button onclick={() => cb_text_alignment("left")}
							><Icon icon="material-symbols:format-align-left-rounded" /></button
						>
						<button onclick={() => cb_text_alignment("center")}
							><Icon icon="material-symbols:format-align-justify-rounded" /></button
						>
						<button onclick={() => cb_text_alignment("right")}
							><Icon icon="material-symbols:format-align-right-rounded" /></button
						>
					</div>-->
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.container {
		grid-area: inspector;

		margin-left: 16px;
		margin-right: 16px;

		border-radius: 8px;
		background-color: var(--container);

		height: fit-content;
		min-height: 240px;
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

		margin-bottom: 12px;
	}

	.header > h3 > span {
		text-transform: uppercase;
	}

	.entry {
		display: flex;
		align-items: start;
		flex-direction: column;

		margin-bottom: 16px;

		padding-bottom: 16px;

		border-bottom: 1px solid #131317;

		padding-left: 16px;
		padding-right: 16px;
	}

	.entry:last-of-type {
		border-bottom: none;
	}

	.entry > p {
		margin: 0;

		color: white;
	}

	.entry > div {
		display: flex;
		flex-direction: row;
		padding-top: 8px;

		align-items: center;

		width: 100%;
	}

	.group {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 8px;

		width: 100%;
	}

	.group > span {
		color: white;
	}

	.group > input[type="number"] {
		width: 30%;
	}

	input,
	textarea,
	select {
		background: none;
		outline: none;
		border: none;

		border-radius: 8px;
		color: white;
		padding: 8px;
		padding-left: 16px;
		background-color: #1e1e1e;
	}

	textarea {
		width: 100%;
		height: 64px;
	}

	.group span {
		font-size: 12px;
	}

	input[type="color"] {
		padding: 1px;
		padding-left: 4px;
		padding-right: 4px;
	}
</style>
