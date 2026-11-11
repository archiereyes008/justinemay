// Animated particle background
// Drifting particles with faint connecting lines, colored to match the brand gradient.
 
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
 
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const motionScale = reduceMotion ? 0.35 : 1;
  const ctx = canvas.getContext("2d");
 
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", () => {
    resizeCanvas();
  });
  resizeCanvas();
 
  const PARTICLE_COUNT = 45;
  const CONNECT_DISTANCE = 130;
  const BRAND_BLUE = "96, 165, 255";
  const BRAND_PINK = "255, 105, 220";
 
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? BRAND_BLUE : BRAND_PINK,
    });
  }
 
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
 
    particles.forEach((p, index) => {
      p.x += p.vx * motionScale;
      p.y += p.vy * motionScale;
 
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
 
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, 0.85)`;
      ctx.fill();
 
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < CONNECT_DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${BRAND_PINK}, ${(1 - dist / CONNECT_DISTANCE) * 0.3})`;
          ctx.stroke();
        }
      }
    });
 
    requestAnimationFrame(animate);
  }
 
  animate();
})();
 