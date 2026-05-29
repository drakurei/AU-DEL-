// Shader for the hero particle field: morphs between a core form and target
// positions (the word DISCIPLINE) and disperses based on uProgress.
export const particleVertex = /* glsl */ `
  precision highp float;
  attribute vec3 aTarget;
  attribute vec3 aRandom;
  uniform float uTime;
  uniform float uProgress;   // 0 = core form, 1 = dispersed
  uniform float uMorph;      // 0 = core, 1 = word
  uniform float uSize;
  varying float vAlpha;

  void main() {
    // Blend core position -> word position.
    vec3 pos = mix(position, aTarget, smoothstep(0.0, 1.0, uMorph));

    // Idle turbulence.
    float t = uTime * 0.6;
    pos += 0.06 * vec3(
      sin(t + aRandom.x * 6.28),
      cos(t + aRandom.y * 6.28),
      sin(t + aRandom.z * 6.28)
    );

    // Dispersion outward along random vectors.
    pos += aRandom * uProgress * 6.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    gl_PointSize = uSize * (1.0 + aRandom.x * 0.5) * (300.0 / -mvPosition.z);
    vAlpha = (1.0 - uProgress) * (0.6 + aRandom.y * 0.4);
  }
`;

export const particleFragment = /* glsl */ `
  precision highp float;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vAlpha;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    // Soft core + brighter halo for a luminous, cinematic look.
    float glow = smoothstep(0.5, 0.0, d);
    float core = smoothstep(0.18, 0.0, d);
    vec3 col = mix(uColor, uAccent, smoothstep(0.1, 0.5, d));
    col += core * 0.6;
    gl_FragColor = vec4(col, (glow * 0.9 + core) * vAlpha);
  }
`;
