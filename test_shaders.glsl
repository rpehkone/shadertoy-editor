//rolling colors
precision mediump float;
uniform vec2 iResolution;
uniform float iTime;

void main() {
    vec4 firstColor = vec4(1.0,0.0,0.0,1.0); //red
    vec4 middleColor = vec4(0.0,1.0,0.0,1.0); // green
    vec4 endColor = vec4(0.0,0.0,1.0,1.0); // blue
    float h = mod(iTime, 1.0);
    vec2 xy = gl_FragCoord.xy / iResolution.xy;
    gl_FragColor = mix(mix(firstColor, middleColor, xy.x/h), mix(middleColor,
                    endColor, (xy.x - h)/(1.0 - h)), step(h, xy.x));

}

//=============================================================================
