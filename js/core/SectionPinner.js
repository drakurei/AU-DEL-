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

// Splits .vision text into per-letter spans and reveals each with a bottom-up
// clip-path mask as the pinned section progresses. Returns an onProgress fn.
export function bindVisionReveal(selector = '[data-vision]') {
  const el = document.querySelector(selector);
  if (!el) return null;

  // Wrap words so they never break mid-word; each letter is its own span.
  const words = el.textContent.trim().split(/\s+/);
  el.innerHTML = words
    .map((word) => {
      const letters = [...word]
        .map((ch) => `<span class="vision__char">${ch}</span>`)
        .join('');
      return `<span class="vision__word">${letters}</span>`;
    })
    .join(' ');

  const chars = el.querySelectorAll('.vision__char');

  return (progress) => {
    // Sweep a little past the end so the last letters fully resolve.
    const head = progress * chars.length * 1.15;
    chars.forEach((c, i) => {
      const local = Math.min(Math.max(head - i, 0), 1); // 0..1 per letter
      c.style.clipPath = `inset(0 0 ${(1 - local) * 100}% 0)`;
      c.style.opacity = String(0.08 + local * 0.92);
    });
  };
}
