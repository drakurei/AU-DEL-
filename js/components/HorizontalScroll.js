import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pins the .explorer section and converts vertical scroll into a horizontal
// translation of the card track. scrub:1 gives a smooth, slightly inertial feel
// and a velocity-based skew adds depth as the track moves.
export default class HorizontalScroll {
  constructor(sectionSel = '#explorer', trackSel = '#explorer-track') {
    this.section = document.querySelector(sectionSel);
    this.track = document.querySelector(trackSel);
    if (!this.section || !this.track) return;

    const cards = this.track.querySelectorAll('.explorer__card');
    if (cards.length < 2) return;

    const setSkew = gsap.quickTo(cards, 'skewX', { duration: 0.4, ease: 'power3' });

    gsap.to(this.track, {
      x: () => -(this.track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: this.section,
        start: 'top top',
        end: () => '+=' + (this.track.scrollWidth - window.innerWidth),
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-12, 12, self.getVelocity() / -180);
          setSkew(v);
        },
      },
    });
  }
}
