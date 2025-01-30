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
						<span>Content</span>
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

		margin-bottom: 12px;
	}

	.header > h3 > span {
		text-transform: uppercase;
	}

	.entry {
		display: flex;
		align-items: start;
		flex-direction: column;

		margin-left: 16px;
		margin-right: 16px;

		margin-bottom: 16px;
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
		padding-left: 24px;

		justify-content: center;
	}

	.group {
		display: flex;
		flex-direction: row;
		gap: 8px;

		width: auto;
	}

	.group > span {
		color: white;
	}

	.group > input[type="number"] {
		width: 20%;
	}
</style>
