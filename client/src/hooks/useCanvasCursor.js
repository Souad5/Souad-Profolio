import { useEffect } from "react";

// Physics-based, colorful line-trail cursor effect (adapted from "Cursify").
// A set of physics "spring" lines follow the mouse and are stroked onto an
// overlay <canvas> each frame with additive ('lighter') blending and a
// hue-cycling stroke, producing a fluid rainbow trail.
//
// Adapted for this Vite + React project:
//   - removed the Next.js 'use client' directive
//   - stored the focus/blur handler references so cleanup truly removes them
//     (the original used inline arrows that could never be removed)
//   - explicit cancelAnimationFrame on unmount
//   - renamed single-letter identifiers; replaced `var` with const/let
//   - disabled under prefers-reduced-motion
export default function useCanvasCursor() {
  useEffect(() => {
    // Respect the OS-level motion-sensitivity preference (public-facing,
    // independent of the admin-only Preferences toggle).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      debug: true,
      friction: 0.5,
      trails: 20,
      size: 50,
      dampening: 0.25,
      tension: 0.98,
    };

    // A self-contained sine oscillators that cycles the stroke hue.
    function SineWave(options) {
      this.phase = options?.phase || 0;
      this.offset = options?.offset || 0;
      this.frequency = options?.frequency || 0.001;
      this.amplitude = options?.amplitude || 1;
    }
    SineWave.prototype.update = function update() {
      this.phase += this.frequency;
      return this.offset + Math.sin(this.phase) * this.amplitude;
    };

    const Nodes = {
      x: 0,
      y: 0,
    };

    // One physical line of nodes that springs behind the cursor.
    function Line(options) {
      this.spring = options?.spring + 0.1 * Math.random() - 0.02;
      this.friction = config.friction + 0.01 * Math.random() - 0.002;
      this.nodes = [];

      for (let i = 0; i < config.size; i++) {
        const node = new Node();
        node.x = Nodes.x;
        node.y = Nodes.y;
        this.nodes.push(node);
      }
    }
    Line.prototype.update = function update() {
      let spring = this.spring;
      let node = this.nodes[0];

      node.vx += (Nodes.x - node.x) * spring;
      node.vy += (Nodes.y - node.y) * spring;

      for (let i = 0; i < this.nodes.length; i++) {
        node = this.nodes[i];
        if (i > 0) {
          const prev = this.nodes[i - 1];
          node.vx += (prev.x - node.x) * spring;
          node.vy += (prev.y - node.y) * spring;
          node.vx += prev.vx * config.dampening;
          node.vy += prev.vy * config.dampening;
        }
        node.vx *= this.friction;
        node.vy *= this.friction;
        node.x += node.vx;
        node.y += node.vy;
        spring *= config.tension;
      }
    };
    Line.prototype.draw = function draw() {
      let a;
      let b;
      let x = this.nodes[0].x;
      let y = this.nodes[0].y;

      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let i = 1, last = this.nodes.length - 2; i < last; i++) {
        a = this.nodes[i];
        b = this.nodes[i + 1];
        x = 0.5 * (a.x + b.x);
        y = 0.5 * (a.y + b.y);
        ctx.quadraticCurveTo(a.x, a.y, x, y);
      }
      a = this.nodes[this.nodes.length - 2];
      b = this.nodes[this.nodes.length - 1];
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
      ctx.stroke();
      ctx.closePath();
    };

    function Node() {
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
    }

    let lines = [];
    const pos = { ...Nodes };

    function rebuildLines() {
      lines = [];
      for (let i = 0; i < config.trails; i++) {
        lines.push(new Line({ spring: 0.4 + (i / config.trails) * 0.025 }));
      }
    }

    function onFirstMove(event) {
      document.removeEventListener("mousemove", onFirstMove);
      document.removeEventListener("touchstart", onFirstMove);
      document.addEventListener("mousemove", onMove);
      document.addEventListener("touchmove", onMove);
      document.addEventListener("touchstart", onTouchStart);

      onMove(event);
      rebuildLines();
      render();
    }

    function onMove(event) {
      if (event.touches) {
        pos.x = event.touches[0].pageX;
        pos.y = event.touches[0].pageY;
      } else {
        pos.x = event.clientX;
        pos.y = event.clientY;
      }
      if (event.cancelable) event.preventDefault();
    }

    function onTouchStart(event) {
      if (event.touches.length === 1) {
        pos.x = event.touches[0].pageX;
        pos.y = event.touches[0].pageY;
      }
    }

    let rafId = 0;

    function render() {
      if (!ctx.running) return;
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "hsla(" + Math.round(wave.update()) + ",50%,50%,0.2)";
      ctx.lineWidth = 1;
      for (let i = 0; i < config.trails; i++) {
        lines[i].update();
        lines[i].draw();
      }
      ctx.frame++;
      rafId = window.requestAnimationFrame(render);
    }

    // Use the full viewport width — the '-20' in the original was only to
    // dodge a scrollbar and could misalign the fixed overlay.
    function resizeCanvas() {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
    }

    // Focus/blur handlers stored as references so cleanup can remove them.
    function onFocus() {
      if (!ctx.running) {
        ctx.running = true;
        render();
      }
    }
    function onBlur() {
      ctx.running = true;
    }

    function setup() {
      ctx.running = true;
      ctx.frame = 1;
      wave = new SineWave({
        phase: Math.random() * 2 * Math.PI,
        amplitude: 85,
        frequency: 0.0015,
        offset: 285,
      });

      document.addEventListener("mousemove", onFirstMove);
      document.addEventListener("touchstart", onFirstMove);
      document.body.addEventListener("orientationchange", resizeCanvas);
      window.addEventListener("resize", resizeCanvas);
      window.addEventListener("focus", onFocus);
      window.addEventListener("blur", onBlur);

      resizeCanvas();
    }

    let wave;
    setup();

    return () => {
      ctx.running = false;
      window.cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onFirstMove);
      document.removeEventListener("touchstart", onFirstMove);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchstart", onTouchStart);
      document.body.removeEventListener("orientationchange", resizeCanvas);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, []);
}
