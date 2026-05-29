import { gsap } from 'gsap';

// Concentric thin rings draw themselves via stroke-dashoffset, a count ticks to
// 100, the brand name fades in last, then two curtains part to reveal the page.
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
    // Prime each ring as a fully "undrawn" stroke.
    this.rings.forEach((ring) => {
      const len = ring.getTotalLength();
      ring.style.strokeDasharray = len;
      ring.style.strokeDashoffset = len;
    });

    const counter = { v: 0 };
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

    tl.to(this.rings, {
      strokeDashoffset: 0,
      duration: 1.6,
      stagger: 0.18,
      ease: 'power2.inOut',
    })
      .to(
        counter,
        {
          v: 100,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (this.count) this.count.textContent = Math.round(counter.v);
          },
        },
        0
      )
      // Brand appears only at the very end of loading.
      .to(this.brand, { opacity: 1, duration: 0.6 }, '-=0.2')
      .to(this.count, { opacity: 0, duration: 0.4 }, '-=0.1')
      .to(this.el.querySelector('.preloader__core'), { opacity: 0, duration: 0.5 })
      // Curtain reveal — no white flash.
      .to('.preloader__curtain--top', { yPercent: -100, duration: 1.0, ease: 'power4.inOut' }, '<')
      .to('.preloader__curtain--bottom', { yPercent: 100, duration: 1.0, ease: 'power4.inOut' }, '<')
      .set(this.el, { display: 'none' })
      .add(() => this.onComplete());
  }
}
