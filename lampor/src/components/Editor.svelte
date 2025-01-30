<script lang="ts">
	import Icon from "@iconify/svelte";

	let panel = $state("canvas");

	// Code
	import CodeMirror from "../lib/codemirror/Codemirror.svelte";
	import editor from "../lib/stores/editor";

	let view: any;
	let codemirrorContent = $state("Edit me!\nAnd here is the second line!!");

	function genCode() {
		codemirrorContent = editor.generator.generate();
	}

	function codemirror_select() {
		view.dispatch({
			selection: { anchor: 0, head: codemirrorContent.length },
		});
	}

	let copyButton: HTMLElement;

	function codemirror_copy(event: MouseEvent) {
		copyButton.classList.remove("success");

		codemirror_select();

		navigator.clipboard.writeText(codemirrorContent).then(
			function () {
				console.log("Copied text to clipboard");
				copyButton.classList.add("success");
			},
			function (err) {
				copyButton.classList.add("error");
				console.error(err);
			}
		);
	}
</script>

<main>
	<div class="bar">
		<button
			class:active={panel == "canvas"}
			onclick={() => {
				panel = "canvas";
				view = undefined;
			}}>Canvas</button
		>
		<button
			class:active={panel == "code"}
			onclick={() => {
				panel = "code";
				view = undefined;
				genCode();
			}}>Code</button
		>

		<div class="separator"></div>

		{#if panel == "canvas"}{:else if panel == "code"}
			<button onclick={genCode}><Icon icon="material-symbols:directory-sync-rounded" /> Regen </button>
			<button onclick={codemirror_select}
				><Icon icon="material-symbols:arrow-selector-tool-outline-rounded" /> Select
			</button>
			<button bind:this={copyButton} onclick={codemirror_copy}
				><Icon icon="material-symbols:content-copy-outline" /> Copy
			</button>
		{/if}
	</div>
	{#if panel == "canvas"}
		<div></div>
	{:else if panel == "code"}
		<div class="code">
			<CodeMirror bind:view bind:doc={codemirrorContent} />
		</div>
	{/if}
</main>

<style>
	main {
		grid-area: editor;

		background-color: #1e1e1e;
		border-radius: 8px;

		overflow: hidden;

		margin-bottom: 16px;
	}

	/* Bar */
	.bar {
		border-bottom: 1px solid black;
		display: flex;
		justify-content: start;
		align-items: center;
		height: 48px;

		position: sticky;
	}

	.bar > button {
		border: none;
		outline: none;
		border-radius: 0;
		background: none;

		cursor: pointer;
		font-size: 12px;

		text-transform: uppercase;
		color: white;

		height: 100%;

		padding-left: 16px;
		padding-right: 16px;
	}

	button:hover {
		background-color: #5c5c5c;
	}

	:global(.success) {
		animation: fade-out-success;
		animation-fill-mode: forwards;
		animation-duration: 1s;
	}

	:global(.error) {
		animation: fade-out-error;
		animation-fill-mode: forwards;
		animation-duration: 1s;
	}

	@keyframes fade-out-error {
		0% {
			background-color: red;
		}
		100% {
			background-color: transparent;
		}
	}

	@keyframes fade-out-success {
		0% {
			background-color: green;
		}
		100% {
			background-color: transparent;
		}
	}

	.active {
		background-color: #0b81f9 !important;
		cursor: default !important;
	}

	.bar > .separator {
		margin-left: 8px;
		margin-right: 8px;

		border-left: 1px solid black;
		height: 100%;
	}

	/* Code */
	.code {
		height: 100%;
		max-height: calc(100% - 50px);
	}
</style>
