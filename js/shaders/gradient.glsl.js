// Fullscreen dark gradient background with animated film grain.
export const gradientVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export const gradientFragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uResolution;

  // Cheap hash-based noise for the grain.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;
    centered.x *= uResolution.x / uResolution.y;

    // Base palette: deep black -> night blue -> faint silver glow.
    vec3 black = vec3(0.02, 0.02, 0.02);
    vec3 night = vec3(0.04, 0.055, 0.10);
    vec3 accent = vec3(0.0, 0.28, 1.0);

    float radial = length(centered);
    float glow = smoothstep(0.9, 0.0, radial);

    // Slow drifting accent bloom that responds to scroll progress.
    vec2 driftPos = centered + vec2(sin(uTime * 0.15) * 0.25, cos(uTime * 0.12 + uScroll * 3.0) * 0.25);
    float bloom = smoothstep(0.85, 0.0, length(driftPos)) * (0.35 + uScroll * 0.35);

    vec3 col = mix(black, night, glow);
    col += accent * bloom;
    // Subtle secondary glow for depth.
    col += accent * smoothstep(1.1, 0.0, radial) * 0.06;

    // Vignette.
    col *= smoothstep(1.25, 0.2, radial);

    // Animated film grain.
    float grain = hash(uv * uResolution.xy * 0.5 + uTime * 60.0);
    col += (grain - 0.5) * 0.06;

    gl_FragColor = vec4(col, 1.0);
  }
`;
