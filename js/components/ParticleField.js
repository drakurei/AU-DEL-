import * as THREE from 'three';
import { particleVertex, particleFragment } from '../shaders/particle.glsl.js';

// Samples points on a faceted icosahedron (the "core form") and computes
// target positions spelling a word, then animates between them via uniforms.
export default class ParticleField {
  constructor(scene, { count = 40000, word = 'DISCIPLINE' } = {}) {
    this.scene = scene;

    const corePositions = this._sampleCore(count);
    const targetPositions = this._sampleText(word, count);
    const randoms = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) randoms[i] = (Math.random() - 0.5) * 2;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(corePositions, 3));
    geometry.setAttribute('aTarget', new THREE.BufferAttribute(targetPositions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    this.material = new THREE.ShaderMaterial({
      vertexShader: particleVertex,
      fragmentShader: particleFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uMorph: { value: 0 },
        uSize: { value: 26 },
        uColor: { value: new THREE.Color(0xe5e5e5) },
        uAccent: { value: new THREE.Color(0x0047ff) },
      },
    });

    this.points = new THREE.Points(geometry, this.material);
    scene.add(this.points);
  }

  _sampleCore(count) {
    const positions = new Float32Array(count * 3);
    const geo = new THREE.IcosahedronGeometry(2.2, 6);
    const verts = geo.attributes.position.array;
    const vCount = verts.length / 3;
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * vCount) * 3;
      positions[i * 3] = verts[idx];
      positions[i * 3 + 1] = verts[idx + 1];
      positions[i * 3 + 2] = verts[idx + 2];
    }
    geo.dispose();
    return positions;
  }

  // Render the word to an offscreen canvas, sample opaque pixels as 3D points.
  _sampleText(word, count) {
    const positions = new Float32Array(count * 3);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 96px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(word, canvas.width / 2, canvas.height / 2);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const pts = [];
    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        if (data[(y * canvas.width + x) * 4 + 3] > 128) {
          pts.push([(x / canvas.width - 0.5) * 9, -(y / canvas.height - 0.5) * 2.4, 0]);
        }
      }
    }

    for (let i = 0; i < count; i++) {
      const p = pts.length ? pts[i % pts.length] : [0, 0, 0];
      positions[i * 3] = p[0] + (Math.random() - 0.5) * 0.04;
      positions[i * 3 + 1] = p[1] + (Math.random() - 0.5) * 0.04;
      positions[i * 3 + 2] = p[2] + (Math.random() - 0.5) * 0.3;
    }
    return positions;
  }

  // progress: hero scroll 0..1. Morph to word early, then disperse.
  setProgress(progress) {
    this.material.uniforms.uMorph.value = THREE.MathUtils.clamp(progress * 2.0, 0, 1);
    this.material.uniforms.uProgress.value = THREE.MathUtils.clamp((progress - 0.55) * 2.2, 0, 1);
  }

  update(elapsed) {
    this.material.uniforms.uTime.value = elapsed;
    this.points.rotation.y = elapsed * 0.05;
  }
}
