import { writable, get } from "svelte/store";
import { downloadZip, plainTextCodeGenerator } from "../generator";

class Document {
	elements: EditorElement[] = [];

	json() {
		const res = [];

		for (const element of this.elements) {
			res.push(element.json());
		}

		return res;
	}
}

class TextElement implements EditorElement {
	type = "text";
	id: string;
	name: string;
	elementCount: number;

	position = {
		x: 0,
		y: 0,
	};

	text = {
		font: "terminalio",
		size: 12,
		content: "Enter Text",
		color: "#ffffff",
	};

	constructor(elementCount: number) {
		this.id = crypto.randomUUID();
		this.elementCount = elementCount;
		this.name = `Text-${elementCount}`;
	}

	json() {
		return JSON.stringify(this);
	}
}

export interface EditorElement {
	type: string;
	id: string;
	name: string;
	elementCount: number;

	position: {
		x: number;
		y: number;
	};
	text: {
		font: string;
		size: number;
		content: string;
		color: string;
	};

	json: () => string;
}

/* State */
interface EditorState {
	document: Document;
	selected: undefined | EditorElement;
}

function useEditor() {
	const initial_state: EditorState = {
		document: new Document(),
		selected: undefined,
	};

	const { subscribe, set, update } = writable<EditorState>(initial_state);

	// Top bar
	async function export_document() {
		await downloadZip(store);
	}

	async function import_document() {}

	async function reset_document() {
		await new Promise<void>((resolve, reject) => {
			if (!window.confirm("This will RESET everything! Continue ?")) {
				reject();
			} else {
				resolve();
			}
		});

		set({
			document: new Document(),
			selected: undefined,
		});

		window.location.reload();
	}

	// Editor actions
	let textElementCount = 0;
	const lookup_id_element: { [key: string]: EditorElement } = {};

	const actions = {
		deleteElement: (id: string) => {
			const element = lookup_id_element[id];
			delete lookup_id_element[id];

			// Delete
			update((state) => {
				state.document.elements.splice(state.document.elements.indexOf(element), 1);
				state.document.elements = state.document.elements;

				if (state.selected && state.selected.id === id) {
					// Try to select last element
					if (state.document.elements.length !== 0) {
						state.selected = state.document.elements.slice(-1)[0];
					} else {
						state.selected = undefined;
					}
				}

				return state;
			});
		},
		selectElement: (id: string) => {
			const element = lookup_id_element[id];

			// Select element
			update((state) => {
				state.selected = element;

				return state;
			});
		},
		createElement: (type: string) => {
			if (type === "text") {
				const element = new TextElement(textElementCount++);
				lookup_id_element[element.id] = element;

				update((state) => {
					state.document.elements.push(element);
					state.selected = element;

					return state;
				});
			}
		},
	};

	// Serialization
	function stringify() {
		const content = get(store).document!.json();

		return JSON.stringify({ elements: content });
	}

	function parse(state: any | undefined = undefined) {
		if (!state) {
			throw new Error("Invalid state");
		}

		let elements;

		if (typeof state === "string") {
			elements = JSON.parse(state).elements;
		} else {
			elements = state.elements;
		}

		update((state) => {
			state.selected = undefined;
			state.document.elements = [];

			// Create elements
			for (let rawElement of elements) {
				rawElement = JSON.parse(rawElement);

				if (rawElement.type === "text") {
					const textElement = new TextElement(rawElement.elementCount);
					lookup_id_element[rawElement.id] = textElement;

					textElement.id = rawElement.id;
					textElement.name = rawElement.name;
					textElement.position = rawElement.position;
					textElement.text = rawElement.text;

					state.document.elements.push(textElement);

					if (textElementCount <= rawElement.elementCount) {
						textElementCount = rawElement.elementCount + 1;
					}

					state.selected = textElement;
				}
			}

			state.document.elements = state.document.elements;

			return state;
		});
	}

	// Serialize before page unload
	window.addEventListener("beforeunload", () => {
		localStorage.setItem("serialized", stringify());
	});

	// Deserialize on page load
	if (localStorage.getItem("serialized") !== null) {
		parse(localStorage.getItem("serialized")!);
	} else {
		parse({
			elements: [
				'{"type":"text","id":"9e0f3cc9-7935-4536-a88d-1dccebfc88bf","name":"Text-0","elementCount":0,"position":{"x":2,"y":6},"text":{"font":"terminalio","size":12,"content":"L21 H44","color":"#ff0000"}}',
				'{"type":"text","id":"7c7f3546-79c9-4a6b-a925-3808a741b2bb","name":"Text-1","elementCount":1,"position":{"x":2,"y":16},"text":{"font":"terminalio","size":12,"content":"01/30 0310","color":"#2bff00"}}',
				'{"type":"text","id":"5b5bd105-1e95-4eb1-a53f-9c42f22d7ef2","name":"Text-2","elementCount":2,"position":{"x":2,"y":26},"text":{"font":"terminalio","size":12,"content":"Trending To","color":"#ffffff"}}',
			],
		});
	}

	// Store store
	const store = {
		subscribe,
		set,
		update,
		document: {
			export: export_document,
			import: import_document,
			reset: reset_document,
		},
		actions,
		generator: {
			generate: () => {
				return plainTextCodeGenerator(get(store).document.elements);
			},
		},
		json: {
			stringify,
			parse,
		},
	};

	return store;
}

export default useEditor();
