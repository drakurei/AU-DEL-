import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initSmoothScroll } from './core/SmoothScroll.js';
import PageTransition from './core/PageTransition.js';
import { pinSection, bindVisionReveal } from './core/SectionPinner.js';

import Preloader from './components/Preloader.js';
import HorizontalScroll from './components/HorizontalScroll.js';
import MagneticButton from './components/MagneticButton.js';
import BentoStats from './components/BentoStats.js';
import GlitchText from './components/GlitchText.js';

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The cinematic background drifts slower than the page for a parallax/depth feel.
function bindBackgroundParallax() {
  const bg = document.getElementById('cinematic-bg');
  if (!bg || reduceMotion) return;
  const setY = gsap.quickSetter(bg, 'y', 'px');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => setY(self.scroll() * 0.18),
  });
}

function wireScroll(isHome) {
  bindBackgroundParallax();

  if (isHome) {
    new BentoStats();
    if (!reduceMotion) new GlitchText();

    // HERO — pinned; title rises and fades out as you scroll past.
    pinSection('#hero', {
      end: '+=200%',
      onProgress: (p) => gsap.set('.hero__title', { autoAlpha: 1 - p * 1.3, y: -p * 120 }),
    });

    // VISION — pinned; text emerges from shadow letter by letter.
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

  ScrollTrigger.refresh();
}

function init() {
  new PageTransition();
  new MagneticButton();

  const isHome = !!document.querySelector('.hero');

  const lenis = initSmoothScroll();
  lenis.stop();
  wireScroll(isHome);

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
