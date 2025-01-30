<!-- From: https://svelte.dev/playground/91649ba3e0ce4122b3b34f3a95a00104?version=3.49.0-->

<!-- The code below is released under public domain. -->

<script context="module">
	import { EditorView, minimalSetup, basicSetup } from "codemirror";
	import { ViewPlugin, lineNumbers } from "@codemirror/view";
	import { StateEffect } from "@codemirror/state";
	export { minimalSetup, basicSetup };
	import { python } from "@codemirror/lang-python";

	import { vscodeDark } from "./vscode";
</script>

<script lang="ts">
	import { onMount, onDestroy, createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	let dom: HTMLElement;

	let _mounted = false;
	onMount(() => {
		_mounted = true;
		return () => {
			_mounted = false;
		};
	});

	export let view: any = null;

	/* `doc` is deliberately made non-reactive for not storing a reduntant string
       besides the editor. Also, setting doc to undefined will not trigger an
       update, so that you can clear it after setting one. */
	export let doc;

	/* Set this if you would like to listen to all transactions via `update` event. */
	export let verbose = false;

	/* Cached doc string so that we don't extract strings in bulk over and over. */
	let _docCached: any = null;

	/* Overwrite the bulk of the text with the one specified. */
	function _setText(text: any) {
		view.dispatch({
			changes: { from: 0, to: view.state.doc.length, insert: text },
		});
	}

	const subscribers = new Set();

	/* And here comes the reactivity, implemented as a r/w store. */
	export const docStore = {
		ready: () => view !== null,
		subscribe(cb: any) {
			subscribers.add(cb);

			if (!this.ready()) {
				cb(null);
			} else {
				if (_docCached == null) {
					_docCached = view.state.doc.toString();
				}
				cb(_docCached);
			}

			return () => void subscribers.delete(cb);
		},
		set(newValue: any) {
			if (!_mounted) {
				throw new Error("Cannot set docStore when the component is not mounted.");
			}

			const inited = _initEditorView(newValue);
			if (!inited) _setText(newValue);
		},
	};

	function _editorTxHandler(trs: any, view: any) {
		view.update(trs);

		if (verbose) {
			dispatch("update", trs);
		}

		let lastChangingTr;
		if ((lastChangingTr = trs.findLast((tr) => tr.docChanged))) {
			_docCached = null;
			if (subscribers.size) {
				dispatchDocStore((_docCached = lastChangingTr.newDoc.toString()));
			}
			dispatch("change", { view, trs });
		}
	}

	function dispatchDocStore(s: any) {
		for (const cb of subscribers) {
			cb(s);
		}
	}

	// the view will be inited with the either doc (as long as that it is not `undefined`)
	// or the value in docStore once set
	function _initEditorView(initialDoc: any) {
		if (view !== null) {
			return false;
		}

		view = new EditorView({
			doc: initialDoc,
			extensions: [vscodeDark, minimalSetup, python(), lineNumbers()],
			parent: dom,
			dispatchTransactions: _editorTxHandler,
		});
		return true;
	}

	$: if (_mounted && doc !== undefined) {
		const inited = _initEditorView(doc);
		dispatchDocStore(doc);
	}

	onDestroy(() => {
		if (view !== null) {
			view.destroy();
		}
	});
</script>

<div class="codemirror" bind:this={dom}></div>

<style>
	.codemirror {
		display: contents;
		height: 100%;
	}

	:global(.cm-editor) {
		height: 100%;
	}
</style>
