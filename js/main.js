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

  // Graceful degradation: if WebGL is unavailable (old GPU, disabled, blocked),
  // hide the canvas and keep the rest of the site fully functional.
  try {
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
  } catch (err) {
    console.warn('WebGL unavailable, continuing without 3D background.', err);
    canvas.style.display = 'none';
    return null;
  }
}

// Scroll setup runs up front (the preloader is a fixed overlay that doesn't
// affect layout), so the experience is wired even if the preloader is slow.
function wireScroll(webgl, isHome) {
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
  new PageTransition();
  new MagneticButton();

  const webgl = initWebGL();
  const isHome = !!document.querySelector('.hero');

  // Smooth scroll + all triggers are wired immediately; Lenis is paused while
  // the preloader covers the screen, then resumed on reveal.
  const lenis = initSmoothScroll();
  lenis.stop();
  wireScroll(webgl, isHome);

  new Preloader(() => {
    lenis.start();
    ScrollTrigger.refresh();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
