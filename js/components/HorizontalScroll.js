import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pins the .explorer section and converts vertical scroll into a horizontal
// translation of the card track. A single scrubbed timeline also drives the
// border-beam (conic-gradient angle) around each card and a velocity skew, so
// everything stays in sync with the scroll.
export default class HorizontalScroll {
  constructor(sectionSel = '#explorer', trackSel = '#explorer-track') {
    this.section = document.querySelector(sectionSel);
    this.track = document.querySelector(trackSel);
    if (!this.section || !this.track) return;

    const cards = this.track.querySelectorAll('.explorer__card');
    if (cards.length < 2) return;

    const setSkew = gsap.quickTo(cards, 'skewX', { duration: 0.4, ease: 'power3' });

    const tl = gsap.timeline({
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

    tl.to(this.track, { x: () => -(this.track.scrollWidth - window.innerWidth), ease: 'none' }, 0);
    // Light beam sweeps ~1.5 turns around each card across the section.
    tl.fromTo(cards, { '--beam': '0deg' }, { '--beam': '540deg', ease: 'none' }, 0);
  }
}
