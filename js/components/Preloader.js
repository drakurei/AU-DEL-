import { gsap } from 'gsap';

// Six concentric thin rings draw themselves out of sync via stroke-dashoffset,
// a count ticks to 100, the brand fades in last, then the whole black panel
// slides up (expo.inOut) while the page content rises slightly for parallax.
export default class Preloader {
  constructor(onComplete) {
    this.el = document.getElementById('preloader');
    this.onComplete = onComplete || (() => {});
    if (!this.el) return this.onComplete();

    this.rings = this.el.querySelectorAll('.ring');
    this.brand = document.getElementById('preloader-brand');
    this.count = document.getElementById('preloader-count');
    this._run();
  }

  _run() {
    // Prime each ring as an "undrawn" stroke with a randomised offset so they
    // draw in a desynchronised way.
    this.rings.forEach((ring) => {
      const len = ring.getTotalLength();
      ring.style.strokeDasharray = len;
      ring.style.strokeDashoffset = len * (0.6 + Math.random() * 0.6);
    });

    const counter = { v: 0 };
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    tl.to(this.rings, {
      strokeDashoffset: 0,
      duration: 1.8,
      stagger: { each: 0.12, from: 'random' },
      ease: 'power2.inOut',
    })
      .to(
        counter,
        {
          v: 100,
          duration: 2.0,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (this.count) this.count.textContent = Math.round(counter.v);
          },
        },
        0
      )
      // Brand appears only at the very end of loading.
      .to(this.brand, { opacity: 1, duration: 0.6 }, '-=0.3')
      .to([this.count, this.brand], { opacity: 0, duration: 0.4 }, '+=0.15')
      // Reveal: black panel slides up, content rises for parallax — no flash.
      // Parallax targets exclude <main> so pinned-section measurement is clean.
      .add(() => this.onComplete())
      .to(this.el, { yPercent: -100, duration: 1.2, ease: 'expo.inOut' }, '<')
      .from(
        ['.nav', '.hero__title', '.hero__scroll'],
        { yPercent: 12, autoAlpha: 0, duration: 1.2, ease: 'expo.out' },
        '<0.15'
      )
      .set(this.el, { display: 'none' });
  }
}
