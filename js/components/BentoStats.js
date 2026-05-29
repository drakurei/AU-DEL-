import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 3D tilt + cursor glow for bento cards, and count-up for [data-count] stats.
export default class BentoStats {
  constructor() {
    this._tiltCards();
    this._countStats();
  }

  _tiltCards() {
    document.querySelectorAll('.bento__card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        gsap.to(card, {
          rotateY: (px - 0.5) * 10,
          rotateX: -(py - 0.5) * 10,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 800,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1,0.5)' });
      });
    });
  }

  _countStats() {
    document.querySelectorAll('[data-count]').forEach((el) => {
      const end = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            v: end,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => { el.textContent = Math.round(obj.v) + suffix; },
          });
        },
      });
    });
  }
}
