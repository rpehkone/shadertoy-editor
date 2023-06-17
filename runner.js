import { render, init_render, fragmentShaderHeader } from './render.js';


const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const initialUserFragment =
`void main() {
	vec2 uv = fragCoord.xy / iResolution.xy;
	fragColor = vec4(uv, 0.5 + 0.5 * sin(iTime), 1);
}
`;

const shaderEditor = document.getElementById('shader-editor');
const compileButton = document.getElementById('compile-button');
const errorbox = document.getElementById('error-box');
const errorline = document.getElementById('error-line');

shaderEditor.value = initialUserFragment;
compileButton.addEventListener('click', () => {
	try {
		init_render(shaderEditor.value);

		errorbox.textContent = "";
		errorline.textContent = "";
	} catch (error) {
		let errorstr = error.message.substring(6)
		const match = errorstr.match(/(\d:\d:)(.*)/);
		if (!match) {
			errorline.textContent = error.message;
			return;
		}
		const numbers = match[1];
		error = match[2].trim();
		errorbox.textContent = error;

		let [number1, line_num] = numbers.split(':');
		const headerNewLines = (fragmentShaderHeader.match(/\n/g) || []).length + 1;
		errorline.textContent = "Error on line: " + String(line_num - headerNewLines);
	};
});

document.addEventListener("DOMContentLoaded", function () {
	const vimTextbox = document.getElementById("shader-editor");
	const editor = CodeMirror.fromTextArea(vimTextbox, {
		mode: "text/x-csrc",
		theme: "monokai",
		lineNumbers: true,
		keyMap: "vim",
	});

	var container = editor.getWrapperElement().parentNode;
	container.style.height = '80%';
	editor.setSize(null, container.clientHeight);
	editor.on('change', () => editor.save())

	init_render(initialUserFragment);
	requestAnimationFrame(render);
});
