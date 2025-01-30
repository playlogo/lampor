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
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div
		class="area"
		bind:this={area}
		onclick={(event) => {
			if (event.target !== area) {
				return;
			}
			$store.selected = undefined;
		}}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		{#each $store.document.elements as element}
			<div
				class:selected={element.id === $store.selected?.id}
				class="element"
				draggable="true"
				role="button"
				tabindex={element.elementCount}
				style={`top: calc(${(element.position.y / HIGHT) * 100}% - 22%); left: calc(${(element.position.x / WIDTH) * 100}% - 2%)`}
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
						console.log("Illegal dragging move");

						element.position.x = Math.max(Math.min(WIDTH + MAX_OVERFLOW, newPosX), -MAX_OVERFLOW);
						element.position.y = Math.max(Math.min(HIGHT + MAX_OVERFLOW, newPosY), -MAX_OVERFLOW);

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

					$store.selected = element;

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
				onkeypress={(event) => {
					if (event.key === "Delete") {
						store.actions.deleteElement(element.id);
						event.preventDefault();
						return;
					}

					console.log(event.key);
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

		padding-top: 64px;

		overflow-x: hidden;
		overflow-y: hidden;

		padding-bottom: 64px;
	}

	.area {
		width: 80%;

		aspect-ratio: 64/32;

		border: 2px solid #131417;
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
