import * as THREE from 'three';

// Owns the renderer, scene, clock and render loop.
// Components register an update(elapsed, delta) callback via add().
export default class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.updaters = [];

    this.sizes = { width: window.innerWidth, height: window.innerHeight };

    this.camera = new THREE.PerspectiveCamera(
      45,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 8);
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x050505, 1);
    this._applySize();

    window.addEventListener('resize', () => this._onResize());
  }

  _applySize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    // Cap pixel ratio at 2 for 4K performance.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  _onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this._applySize();
    this.updaters.forEach((u) => u.onResize && u.onResize(this.sizes));
  }

  add(updater) {
    this.updaters.push(updater);
  }

  start() {
    const tick = () => {
      const elapsed = this.clock.getElapsedTime();
      const delta = this.clock.getDelta();
      this.updaters.forEach((u) => u.update && u.update(elapsed, delta));
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(tick);
    };
    tick();
  }
}
