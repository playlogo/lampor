<script lang="ts">
	import { onMount } from "svelte";
	import store from "../lib/stores/editor";

	const WIDTH = 64;
	const HIGHT = 32;

	const MAX_OVERFLOW = 8;

	let area: HTMLElement;

	let dragging_position = { start_pageX: 0, start_pageY: 0, start_elementX: 0, start_elementY: 0 };

	/* Handle font size */
	const FONT_MULTIPLIER = 10;
	let fontSize = $state(FONT_MULTIPLIER);

	function dispatchResize(_event: any) {
		fontSize = (area.getBoundingClientRect().width / 640) * FONT_MULTIPLIER;
	}

	onMount(() => {
		dispatchResize(undefined);
	});
</script>

<svelte:window onresize={dispatchResize} />

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
				style={`top: calc(${(element.position.y / HIGHT) * 100}% - 96px); left: calc(${(element.position.x / WIDTH) * 100}% - 28px)`}
				ondragend={(event) => {
					const deltaX = event.pageX - dragging_position.start_pageX;
					const deltaY = event.pageY - dragging_position.start_pageY;

					const newPosX = Math.floor(
						dragging_position.start_elementX + (deltaX / area.clientWidth) * 64
					);
					const newPosY = Math.floor(
						dragging_position.start_elementY + (deltaY / area.clientHeight) * 32
					);

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
				ondragstart={(event: DragEvent) => {
					dragging_position = {
						start_pageX: event.pageX,
						start_pageY: event.pageY,
						start_elementX: $state.snapshot(element.position.x),
						start_elementY: $state.snapshot(element.position.y),
					};

					// Hide image
					const img = new Image();
					img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=";
					event.dataTransfer!.setDragImage(img, 0, 0);
				}}
				ondrag={(event) => {
					const deltaX = event.pageX - dragging_position.start_pageX;
					const deltaY = event.pageY - dragging_position.start_pageY;

					const newPosX = Math.floor(
						dragging_position.start_elementX + (deltaX / area.clientWidth) * 64
					);
					const newPosY = Math.floor(
						dragging_position.start_elementY + (deltaY / area.clientHeight) * 32
					);

					element.position.x = newPosX;
					element.position.y = newPosY;
				}}
				onclick={() => {
					$store.selected = element;
				}}
			>
				{#if element.type === "text"}
					<input
						bind:value={element.text.content}
						type="text"
						style={`font-size: ${element.text.size * fontSize}px; color: ${element.text.color}`}
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
		contain: layout;
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

		font-family: "Terminus";
	}

	.element:has(input:focus) {
		border: 2px solid var(--color-accent-blue);
		border-style: dashed;
	}
</style>
