<script lang="ts">
	import Inspector from "./layout/Inspector.svelte";
	import Hierarchy from "./layout/Hierarchy.svelte";
	import Icon from "@iconify/svelte";
	import editor from "./lib/stores/editor";
	import Main from "./layout/Main.svelte";
</script>

<div class="sidebar">
	<div class="logo">
		<h1>Lampor ✨</h1>
		<p>Layout your LED Panel</p>
	</div>

	<Hierarchy />
</div>

<div class="bar">
	<button onclick={editor.document.export}>
		<Icon icon="material-symbols:download-rounded" width="22" /> Download
	</button>
	<!--
	<button onclick={editor.document.import}>
		<Icon icon="material-symbols:upload-rounded" width="22" /> Import
	</button>-->
	<button onclick={editor.document.reset}>
		<Icon icon="material-symbols:sync-outline" width="22" /> Reset
	</button>
</div>

<Main />
<Inspector />

<!--
<Preview />
-->
<style>
	/* Grid */
	:global(#app) {
		display: grid;
		grid-template-areas:
			"sidebar bar bar"
			"sidebar main inspector"
			"sidebar main preview";
		grid-template-columns: 380px auto 440px;
		grid-template-rows: 84px auto 260px;

		height: 100vh;
	}

	.sidebar {
		grid-area: sidebar;

		display: grid;
		grid-template-areas:
			"logo"
			"hierarchy";
		grid-template-rows: 100px auto;

		padding: 16px;
	}

	/* Logo */
	.logo {
		grid-area: logo;

		background-color: var(--container);
		border-radius: 8px;

		display: flex;
		align-items: start;
		padding-left: 24px;
		justify-content: center;
		flex-direction: column;

		margin-bottom: 8px;

		width: fit-content;
		padding-right: 24px;
	}

	.logo > h1,
	p {
		margin: 0;
		color: white;
	}

	.logo > p {
		color: #9b9b9b;

		color: white;
		font-size: 12px;
		text-transform: uppercase;
	}

	/* Top bar */
	.bar {
		grid-area: bar;

		background-color: var(--container);
		border-radius: 8px;

		margin-top: 16px;
		margin-bottom: 16px;
		margin-right: 16px;

		display: flex;
		align-items: center;

		overflow: hidden;

		width: fit-content;
	}

	.bar > button {
		background: none;

		outline: none;
		font-size: 12px;

		border: none;
		color: white;

		cursor: pointer;
		height: 100%;

		border-radius: 0;
		padding-left: 16px;
		padding-right: 16px;

		text-transform: uppercase;

		display: flex;
		align-items: center;
		gap: 8px;
	}

	.bar > button:hover {
		background-color: #5c5c5c;
	}
</style>
