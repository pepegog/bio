(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  const dots = [];
  // Меньше точек на мобилках для экономии CPU/GPU
  const DOT_COUNT = window.innerWidth < 768 ? 35 : 70;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initDots() {
    dots.length = 0;
    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.4,
        vx: (Math.random() - 0.5) * (isReducedMotion ? 0.05 : 0.25),
        vy: (Math.random() - 0.5) * (isReducedMotion ? 0.05 : 0.25),
        alpha: Math.random() * 0.4 + 0.15
      });
    }
  }

  let animFrame;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';

    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      d.x += d.vx;
      d.y += d.vy;

      // Мягкий wrap-around без рывков
      if (d.x < -5) d.x = width + 5;
      if (d.x > width + 5) d.x = -5;
      if (d.y < -5) d.y = height + 5;
      if (d.y > height + 5) d.y = -5;

      ctx.globalAlpha = d.alpha;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    }

    animFrame = requestAnimationFrame(animate);
  }

  // Останавливаем анимацию при сворачивании вкладки (экономия батареи)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else if (!isReducedMotion) {
      animate();
    }
  });

  window.addEventListener('resize', () => {
    resize();
    initDots();
  });

  resize();
  initDots();
  if (!isReducedMotion) animate();
})();