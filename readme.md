shadertoy clone with vim editor  

python3 -m http.server  

Get-Content index.html, style.css | Set-Clipboard  

TODO:
implement missing:
float iTimeDelta - The time in seconds since the last frame was rendered.
float iFrame - The number of frames that have been rendered since the shader started running.
vec4 iMouse - The current mouse position and button state, in screen space.
vec4 iDate - The current date and time (year, month, day, seconds).
float iSampleRate

float iChannelTime[4] - An array of time values (in seconds) for each of the four input channels.
vec3 iChannelResolution[4] - An array of resolutions (in pixels) for each of the four input channels.
sampler2D iChannel0 - A 2D texture sampler for the first input channel.
sampler2D iChannel1 - A 2D texture sampler for the second input channel.
sampler2D iChannel2 - A 2D texture sampler for the third input channel.
sampler2D iChannel3 - A 2D texture sampler for the fourth input channel.
samplerCube iChannel4 - A cube texture sampler for the fifth input channel.
