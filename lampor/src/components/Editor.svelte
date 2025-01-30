<script lang="ts">
	import store from "../lib/stores/editor";

	const WIDTH = 64;
	const HIGHT = 32;

	const MAX_OVERFLOW = 8;

	let area: HTMLElement;

	let dragging_position = { x: 0, y: 0 };
</script>

<div class="main">
	<div class="area" bind:this={area}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		{#each $store.document.elements as element}
			<div
				class:selected={element.id === $store.selected?.id}
				class="element"
				draggable="true"
				role="button"
				tabindex="0"
				style={`top: calc(${(element.position.y / HIGHT) * 100}% - 16px); left: calc(${(element.position.x / WIDTH) * 100}% - 16px)`}
				ondragend={(event) => {
					const deltaX = event.pageX - dragging_position.x;
					const deltaY = event.pageY - dragging_position.y;

					const newPosX = element.position.x + (deltaX / area.clientWidth) * 64;
					const newPosY = element.position.y + (deltaY / area.clientHeight) * 32;

					if (
						newPosX < -MAX_OVERFLOW ||
						newPosX > WIDTH + MAX_OVERFLOW ||
						newPosY < -MAX_OVERFLOW ||
						newPosY > HIGHT + MAX_OVERFLOW
					) {
						console.log("Illigal move");
						return;
					}

					element.position.x = newPosX;
					element.position.y = newPosY;
				}}
				ondragstart={(event) => {
					dragging_position = {
						x: event.pageX,
						y: event.pageY,
					};
				}}
				onclick={() => {
					$store.selected = element;
				}}
			>
				{#if element.type === "text"}
					<input
						bind:value={element.text.content}
						type="text"
						style={`font-size: ${element.text.size * 20}%; color: ${element.text.color}`}
					/>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.main {
		display: flex;
		align-items: center;
		justify-content: center;

		margin-top: 64px;
	}

	.area {
		width: 80%;

		aspect-ratio: 64/32;

		border: 2px solid black;
		position: relative;
	}

	.element {
		cursor: pointer;

		border: 2px solid transparent;
		position: absolute;

		padding: 16px;
	}

	.element:hover {
		border: 2px solid var(--color-accent-blue);
		border-style: dashed !important;
	}

	.selected {
		border: 2px solid var(--color-accent-blue);
		border-style: solid;
	}

	input {
		width: 100%;
		height: 100%;

		background: none;
		outline: none;
		border: none;

		field-sizing: content;
	}

	.element:has(input:focus) {
		border: 2px solid var(--color-accent-blue);
		border-style: dashed;
	}
</style>
