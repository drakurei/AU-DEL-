import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

// Decodes [data-glitch] headings with GSAP's ScrambleText as they scroll into
// view: characters churn through random glyphs, then resolve to the real text.
export default class GlitchText {
  constructor(selector = '[data-glitch]') {
    document.querySelectorAll(selector).forEach((el) => this._bind(el));
  }

  _bind(el) {
    const finalText = el.textContent;
    // Hold the layout but start hidden so the decode reads as an arrival.
    el.style.visibility = 'hidden';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        el.style.visibility = 'visible';
        gsap.fromTo(
          el,
          { opacity: 0.4 },
          {
            opacity: 1,
            duration: 1.6,
            ease: 'power2.out',
            scrambleText: {
              text: finalText,
              chars: 'upperAndLowerCase',
              speed: 0.6,
              tweenLength: false,
            },
          }
        );
      },
    });
  }
}
