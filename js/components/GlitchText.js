import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Reveals [data-glitch] headings with a per-character distortion/glitch effect
// as they scroll into view.
const GLYPHS = '!<>-_\\/[]{}—=+*^?#';

export default class GlitchText {
  constructor(selector = '[data-glitch]') {
    document.querySelectorAll(selector).forEach((el) => this._prepare(el));
  }

  _prepare(el) {
    const text = el.textContent;
    el.textContent = '';
    const spans = [...text].map((ch) => {
      const s = document.createElement('span');
      s.textContent = ch === ' ' ? ' ' : ch;
      s.dataset.final = ch;
      s.style.display = 'inline-block';
      el.appendChild(s);
      return s;
    });

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => this._scramble(spans),
    });
  }

  _scramble(spans) {
    spans.forEach((span, i) => {
      const final = span.dataset.final;
      if (final === ' ' || final === ' ') return;
      let frame = 0;
      const total = 8 + Math.floor(Math.random() * 8);
      gsap.delayedCall(i * 0.04, () => {
        const id = setInterval(() => {
          span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          frame++;
          if (frame >= total) {
            clearInterval(id);
            span.textContent = final;
          }
        }, 35);
      });
    });
  }
}
