import type { EditorElement } from "./stores/editor";

export function codeGenerator(elements: EditorElement[]): string {
	let code = `import adafruit_display_text.label
import board
import displayio
import framebufferio
import rgbmatrix
import terminalio

# Release old displays
displayio.release_displays()

# Crete led matrix
matrix = rgbmatrix.RGBMatrix(
    width=64, height=32, bit_depth=1,
    rgb_pins=[board.D6, board.D5, board.D9, board.D11, board.D10, board.D12],
    addr_pins=[board.A5, board.A4, board.A3, board.A2],
    clock_pin=board.D13, latch_pin=board.D0, output_enable_pin=board.D1)

display = framebufferio.FramebufferDisplay(matrix, auto_refresh=False)

# Groups
group_root = displayio.Group()
group_text = displayio.Group()
`;

	for (const element of elements) {
		if (element.type === "text") {
			const elementId = `text_${element.elementCount}`;

			code += `
# Text element ${element.name}
${elementId} = adafruit_display_text.label.Label(
     ${element.text.font === "default" ? "terminalio.FONT" : "terminalio.FONT"},
    color=${convertColor(element.text.color)},
    text="${element.text.content}")
${elementId}.x = ${element.position.x}
${elementId}.y = ${element.position.y}
group_text.append(${elementId})
`;
		}
	}

	code += `
# Add groups
group_root.append(group_text)
display.root_group = group_root

# Draw!
display.refresh(minimum_frames_per_second=0)
`;

	return code;
}

function convertColor(color: string) {
	return "0x" + color.slice(1);
}
