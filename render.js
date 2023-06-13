import { program } from './runner.js';

export const fragmentShaderHeader =
`precision mediump float;
uniform vec2 iResolution;
uniform float iTime;
`;
export { render };

const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

function render(time) {
    const iTime = time * 0.001; // Convert to seconds

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform1f(gl.getUniformLocation(program, "iTime"), iTime);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}
