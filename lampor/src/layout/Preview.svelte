<script lang="ts">
	import editor from "../lib/stores/editor";

	const contentStore = $derived.by(() => {
		if ($editor.document !== undefined) return $editor.document;
	});

	let canvas: HTMLCanvasElement;

	// Canvas
	const CELLS_X = 64;
	const CELLS_Y = 32;

	const CELL_BORDER_WIDTH = 2;
	const CELL_SIZE = 4;

	const SIZE_X = CELLS_X * CELL_SIZE + (CELLS_X + 1) * CELL_BORDER_WIDTH;
	const SIZE_Y = CELLS_Y * CELL_SIZE + (CELLS_Y + 1) * CELL_BORDER_WIDTH;

	$effect(() => {
		const context = canvas.getContext("2d")!;
		context.clearRect(0, 0, canvas.width, canvas.height);

		const COLOR_BACKGROUND = window.getComputedStyle(canvas).getPropertyValue("--color-panel-background");
		const COLOR_BORDER = window.getComputedStyle(canvas).getPropertyValue("--color-panel-border");

		// Draw background
		context.fillStyle = COLOR_BACKGROUND;
		context.fillRect(0, 0, SIZE_X, SIZE_Y);

		// Draw grid
		context.fillStyle = COLOR_BORDER;

		for (let x = 0; x < CELLS_X + 1; x++) {
			context.fillRect(x * (CELL_SIZE + CELL_BORDER_WIDTH), 0, CELL_BORDER_WIDTH, SIZE_Y);
		}

		for (let y = 0; y < CELLS_Y + 1; y++) {
			context.fillRect(0, y * (CELL_SIZE + CELL_BORDER_WIDTH), SIZE_X, CELL_BORDER_WIDTH);
		}
	});
</script>

<div class="main">
	<canvas class="preview" bind:this={canvas} width={SIZE_X} height={SIZE_Y}> </canvas>
</div>

<style>
	.main {
		grid-area: preview;

		padding: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.preview {
		background-color: var(--color-panel-background);

		border: 1px solid var(--color-panel-border);
	}
</style>
