import { render, fragmentShaderHeader } from './render.js';

export var program;

const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
	gl_Position = vec4(a_position, 0, 1);
}
`;

const initialUserFragment =
`void main() {
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	gl_FragColor = vec4(uv, 0.5 + 0.5 * sin(iTime), 1);
}
`;

function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
		return null;
	}

	return program;
}

const shaderEditor = document.getElementById('shader-editor');
const compileButton = document.getElementById('compile-button');
const errorbox = document.getElementById('error-box');
const errorline = document.getElementById('error-line');

shaderEditor.value = initialUserFragment;
compileButton.addEventListener('click', () => {
	try {
		let shader = shaderEditor.value;
		shader = shader.replace(/mainImage\(.*\)/, "main()");
		shader = shader.replace(/fragColor/g, "gl_FragColor");
		shader = shader.replace(/fragCoord/g, "gl_FragCoord.xy");
		init_render(fragmentShaderHeader + shader);
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

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader;
function init_render(frag) {
	fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, frag);
	program = createProgram(gl, vertexShader, fragmentShader);

	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	gl.clearColor(0, 0, 0, 0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.useProgram(program);
	gl.enableVertexAttribArray(positionAttributeLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

	const iResolutionUniformLocation = gl.getUniformLocation(program, "iResolution");
	gl.uniform2f(iResolutionUniformLocation, gl.canvas.width, gl.canvas.height);
	console.log("shader init");
}

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

	init_render(fragmentShaderHeader + initialUserFragment);
	requestAnimationFrame(render);
});
