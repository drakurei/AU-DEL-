// Magnetic buttons: each element with [data-magnetic] eases toward the cursor
// using a per-frame LERP, so it follows the mouse smoothly on hover and springs
// back on leave. One shared rAF loop drives all instances.
const LERP = 0.18;

class Magnet {
  constructor(el) {
    this.el = el;
    this.inner = el.querySelector('span') || el;
    this.strength = Number(el.dataset.strength || 0.4);
    this.target = { x: 0, y: 0 };
    this.current = { x: 0, y: 0 };
    this.active = false;

    el.addEventListener('mouseenter', () => (this.active = true));
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      this.target.x = (e.clientX - r.left - r.width / 2) * this.strength;
      this.target.y = (e.clientY - r.top - r.height / 2) * this.strength;
    });
    el.addEventListener('mouseleave', () => {
      this.active = false;
      this.target.x = 0;
      this.target.y = 0;
    });
  }

  tick() {
    this.current.x += (this.target.x - this.current.x) * LERP;
    this.current.y += (this.target.y - this.current.y) * LERP;
    const { x, y } = this.current;
    this.el.style.transform = `translate(${x}px, ${y}px)`;
    this.inner.style.transform = `translate(${x * 0.35}px, ${y * 0.35}px)`;
  }
}

export default class MagneticButton {
  constructor(selector = '[data-magnetic]') {
    this.magnets = [...document.querySelectorAll(selector)].map((el) => new Magnet(el));
    if (this.magnets.length) this._loop();
  }

  _loop() {
    const frame = () => {
      this.magnets.forEach((m) => m.tick());
      requestAnimationFrame(frame);
    };
    frame();
  }
}
