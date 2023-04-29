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

const fragmentShaderSource =
`precision mediump float;
uniform vec2 iResolution;
uniform float iTime;

void main() {
	vec2 uv = gl_FragCoord.xy / iResolution.xy;
	gl_FragColor = vec4(uv, 0.5 + 0.5 * sin(iTime), 1);
}
`;

function createShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(gl.getShaderInfoLog(shader));
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
const submitButton = document.getElementById('submit-button');

shaderEditor.value = fragmentShaderSource;
submitButton.addEventListener('click', () => {
	init_render(shaderEditor.value);
});

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
var fragmentShader;
var program;
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
init_render(fragmentShaderSource);

function render(time) {
	const iTime = time * 0.001; // Convert to seconds

	gl.clear(gl.COLOR_BUFFER_BIT);

	gl.uniform1f(gl.getUniformLocation(program, "iTime"), iTime);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

	requestAnimationFrame(render);
}

requestAnimationFrame(render);

