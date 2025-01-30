import { writable, get } from "svelte/store";

interface EditorState {
	document: undefined | Document;
	selected: undefined | Element;
}

interface Document {
	elements: Element[];
}

interface Element {
	type: "text";
	position: {
		x: number;
		y: number;
	};
	text: {
		font: string;
		size: number;
		content: string;
	};
}

function useEditor() {
	const initial_state: EditorState = {
		document: undefined,
		selected: undefined,
	};

	const { subscribe, set, update } = writable<EditorState>(initial_state, function start(set) {
		// TODO: Maybe listen to websocket events ?
	});

	// Top bar
	function export_document() {}

	function import_document() {}

	function reset_document() {
		if (!window.confirm("This will RESET everything! Continue ?")) {
			return;
		}

		set(initial_state);
	}

	// Store store
	const store = {
		subscribe,
		set,
		update,
		export_document,
		import_document,
		reset_document,
	};

	return store;
}

export default useEditor();
