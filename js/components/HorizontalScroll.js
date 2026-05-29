import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pins the .explorer section and translates its card track horizontally
// (right -> left) as the user scrolls down.
export default class HorizontalScroll {
  constructor(sectionSel = '#explorer', trackSel = '#explorer-track') {
    this.section = document.querySelector(sectionSel);
    this.track = document.querySelector(trackSel);
    if (!this.section || !this.track) return;

    const cards = this.track.querySelectorAll('.explorer__card');
    if (cards.length < 2) return;

    gsap.to(this.track, {
      xPercent: -100 * (cards.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: () => '+=' + this.track.scrollWidth,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  }
}
