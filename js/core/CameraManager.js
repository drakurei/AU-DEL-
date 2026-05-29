import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Moves the camera along a Bézier-like spline driven by scroll progress.
export default class CameraManager {
  constructor(camera) {
    this.camera = camera;
    this.lookTarget = new THREE.Vector3(0, 0, 0);

    // Control points for the journey (a Catmull-Rom curve through space).
    this.path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 8),
      new THREE.Vector3(2.5, 0.6, 6),
      new THREE.Vector3(-2.0, -0.4, 4.5),
      new THREE.Vector3(1.2, 1.0, 3.2),
      new THREE.Vector3(0, 0, 6.5),
    ]);

    this.progress = { t: 0 };

    ScrollTrigger.create({
      trigger: 'main',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.1,
      onUpdate: (self) => {
        this.progress.t = self.progress;
      },
    });
  }

  update() {
    const t = this.progress.t;
    const point = this.path.getPointAt(THREE.MathUtils.clamp(t, 0, 1));
    this.camera.position.lerp(point, 0.06);
    this.camera.lookAt(this.lookTarget);
  }
}
