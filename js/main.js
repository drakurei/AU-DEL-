import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initSmoothScroll } from './core/SmoothScroll.js';
import Engine from './core/Engine.js';
import CameraManager from './core/CameraManager.js';
import PageTransition from './core/PageTransition.js';
import { pinSection, bindVisionReveal } from './core/SectionPinner.js';

import Preloader from './components/Preloader.js';
import Background from './components/Background.js';
import ParticleField from './components/ParticleField.js';
import HorizontalScroll from './components/HorizontalScroll.js';
import MagneticButton from './components/MagneticButton.js';
import BentoStats from './components/BentoStats.js';
import GlitchText from './components/GlitchText.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initWebGL() {
  const canvas = document.getElementById('webgl');
  if (!canvas) return null;

  const engine = new Engine(canvas);
  const background = new Background(engine.scene);
  engine.add(background);

  let hero = null;
  if (document.querySelector('.hero')) {
    hero = new ParticleField(engine.scene, { word: 'DISCIPLINE' });
    const camera = new CameraManager(engine.camera);
    engine.add({ update: () => camera.update() });
    engine.add(hero);
  }

  engine.start();
  return { engine, background, hero };
}

// Scroll-dependent setup runs only after the preloader reveals the page, so
// ScrollTrigger measures the final layout. webgl/isHome are passed in because
// the 3D scene starts immediately (behind the curtain) for a seamless reveal.
function wireScroll(webgl, isHome) {
  initSmoothScroll();

  if (isHome) {
    new BentoStats();
    if (!reduceMotion) new GlitchText();

    // Background reacts to global scroll progress.
    ScrollTrigger.create({
      trigger: 'main',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => webgl?.background?.setScroll(self.progress),
    });

    // HERO — pinned while particles morph to DISCIPLINE and disperse.
    pinSection('#hero', {
      end: '+=200%',
      onProgress: (p) => {
        webgl?.hero?.setProgress(p);
        gsap.set('.hero__title', { autoAlpha: 1 - p * 1.3, y: -p * 120 });
      },
    });

    // VISION — pinned, words light up across the pin.
    const visionUpdate = bindVisionReveal();
    pinSection('#vision', { end: '+=200%', onProgress: visionUpdate || undefined });

    // EXPLORER — pinned horizontal card scroll.
    new HorizontalScroll();

    // Generic reveals for non-pinned sections.
    gsap.utils.toArray('[data-reveal]').forEach((el) => {
      gsap.fromTo(
        el,
        { y: 60, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        }
      );
    });
  }

  // Layout is final now; recompute all trigger positions.
  ScrollTrigger.refresh();
}

function init() {
  // The 3D scene and cheap UI start immediately so the scene is already
  // rendering behind the preloader curtain.
  new PageTransition();
  new MagneticButton();
  const webgl = initWebGL();
  const isHome = !!document.querySelector('.hero');

  // Preloader reveals the page, then we wire up everything scroll-related.
  new Preloader(() => wireScroll(webgl, isHome));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
