import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pins a section in place (scrub) for an extra scroll distance so its inner
// animations can finish before the next section arrives. onProgress(p) is
// called every frame with 0..1 pin progress.
export function pinSection(selector, { end = '+=200%', onProgress } = {}) {
  const el = document.querySelector(selector);
  if (!el) return;

  ScrollTrigger.create({
    trigger: el,
    start: 'top top',
    end,
    pin: true,
    scrub: true,
    anticipatePin: 1,
    onUpdate: (self) => onProgress && onProgress(self.progress),
  });
}

// Reveals .vision words one by one as the pinned section progresses.
export function bindVisionReveal(selector = '[data-vision]') {
  const el = document.querySelector(selector);
  if (!el) return null;

  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((w) => `<span class="vision__word">${w}</span>`)
    .join(' ');
  const spans = el.querySelectorAll('.vision__word');

  return (progress) => {
    const lit = Math.floor(progress * spans.length * 1.1);
    spans.forEach((s, i) => {
      s.style.opacity = i <= lit ? '1' : '0.12';
    });
  };
}
