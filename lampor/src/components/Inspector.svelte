<script lang="ts">
	import Icon from "@iconify/svelte";

	import editor from "../lib/stores/editor";
</script>

<div class="container">
	<div class="main">
		<div class="header">
			<h2>
				Inspector {#if $editor.selected}
					- {$editor.selected.type}
				{/if}
			</h2>
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
						<span>X</span>
						<input type="number" bind:value={$editor.selected.position.x} />
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
					</div>
					<div>
						<div class="group">
							<span>Size</span>
							<input type="number" bind:value={$editor.selected.text.size} />
						</div>
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
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.container {
		grid-area: inspector;
		background-color: yellow;
	}
</style>
