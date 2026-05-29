import { gsap } from 'gsap';

// Fade-to-black page transitions with a "Senior" animated loader.
// Intercepts internal links and animates out before navigating.
export default class PageTransition {
  constructor() {
    this.overlay = this._build();
    this._enter();
    this._bindLinks();
  }

  _build() {
    const overlay = document.createElement('div');
    overlay.className = 'page-fade';
    overlay.innerHTML = `
      <div class="page-fade__loader">AU-DELÀ</div>
      <div class="page-fade__bar"><span></span></div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  _enter() {
    const bar = this.overlay.querySelector('.page-fade__bar span');
    const tl = gsap.timeline();
    tl.set(this.overlay, { autoAlpha: 1 })
      .fromTo(bar, { width: '0%' }, { width: '100%', duration: 0.7, ease: 'power2.inOut' })
      .to(this.overlay, {
        autoAlpha: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => { this.overlay.style.pointerEvents = 'none'; },
      });
  }

  _bindLinks() {
    document.querySelectorAll('a[href$=".html"], a[data-link]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http')) return;
        e.preventDefault();
        this._leave(href);
      });
    });
  }

  _leave(href) {
    const bar = this.overlay.querySelector('.page-fade__bar span');
    this.overlay.style.pointerEvents = 'auto';
    const tl = gsap.timeline({ onComplete: () => { window.location.href = href; } });
    tl.set(this.overlay, { autoAlpha: 1 })
      .fromTo(bar, { width: '0%' }, { width: '100%', duration: 0.5, ease: 'power2.in' });
  }
}
