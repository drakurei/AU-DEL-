import { gsap } from 'gsap';

// Adds magnetic pull to elements with [data-magnetic]: the element and its
// inner <span> ease toward the cursor when hovered.
export default class MagneticButton {
  constructor(selector = '[data-magnetic]') {
    document.querySelectorAll(selector).forEach((el) => this._bind(el));
  }

  _bind(el) {
    const inner = el.querySelector('span') || el;
    const strength = Number(el.dataset.strength || 0.4);

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: 'power3.out' });
      gsap.to(inner, { x: x * strength * 0.4, y: y * strength * 0.4, duration: 0.6, ease: 'power3.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to([el, inner], { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
    });
  }
}
