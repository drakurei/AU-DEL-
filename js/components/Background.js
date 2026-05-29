import * as THREE from 'three';
import { gradientVertex, gradientFragment } from '../shaders/gradient.glsl.js';

// Fullscreen shader quad rendered behind the particle field.
export default class Background {
  constructor(scene) {
    this.uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: gradientVertex,
      fragmentShader: gradientFragment,
      uniforms: this.uniforms,
      depthTest: false,
      depthWrite: false,
    });

    // Vertex shader writes clip-space directly, so this quad always fills
    // the screen regardless of camera. renderOrder/depthTest keep it behind.
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = -1;
    scene.add(this.mesh);
  }

  setScroll(v) {
    this.uniforms.uScroll.value = v;
  }

  onResize(sizes) {
    this.uniforms.uResolution.value.set(sizes.width, sizes.height);
  }

  update(elapsed) {
    this.uniforms.uTime.value = elapsed;
  }
}
