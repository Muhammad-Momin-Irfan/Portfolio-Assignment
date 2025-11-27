
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

window.addEventListener('load', () => {
  document.getElementById('pageLoader').classList.add('opacity-100');
  setTimeout(() => document.getElementById('pageLoader').remove(), 600);
});


document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href');

    document.body.classList.add('page-exit-active');
    setTimeout(() => {
      window.location = href;
    }, 400); 
  });
});



const y = $('#year');
if (y) y.textContent = new Date().getFullYear();

/* ---------- THEME: persist in localStorage ---------- */
const root = document.documentElement;
const storedTheme = localStorage.getItem('site-theme');
if (storedTheme === 'light') {
  root.classList.add('light');
}
const themeBtn = $('#themeBtn');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const light = root.classList.toggle('light');
    localStorage.setItem('site-theme', light ? 'light' : 'dark');
    // icon flip
    const i = themeBtn.querySelector('i');
    if (i) {
      i.classList.toggle('fa-moon');
      i.classList.toggle('fa-sun');
    }
  });
}


const menuBtn = $('#menuBtn');
const mobileMenu = $('#mobileMenu');
if (menuBtn && mobileMenu) {
  menuBtn.addEventListener('click', (e) => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
  });


  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}


let lastScroll = 0;
const header = $('#siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    const scroll = window.pageYOffset || document.documentElement.scrollTop;
    if (scroll > lastScroll && scroll > 80) {
      header.style.transform = 'translateY(-110%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScroll = scroll;

  
    if (scroll > 20) {
      header.style.background = getComputedStyle(document.documentElement).getPropertyValue('--panel');
    } else {
      header.style.background = 'transparent';
    }
  }, { passive: true });
}


$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;
      const headerOffset = header ? header.offsetHeight + 8 : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


function startTypingFor(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const phrases = [
    'Front-end Developer',
    'Motion & UI Designer',
    'Accessibility Advocate',
    'Performance Lover'
  ];
  let p = 0;
  let c = 0;
  let del = false;
  function tick() {
    const cur = phrases[p];
    if (!del) {
      c++;
      if (c > cur.length) {
        del = true;
        setTimeout(tick, 900);
        return;
      }
    } else {
      c--;
      if (c < 0) {
        del = false;
        p = (p + 1) % phrases.length;
      }
    }
    el.textContent = cur.slice(0, c);
    setTimeout(tick, del ? 80 : 140);
  }
  tick();
}

startTypingFor('typedHome');
startTypingFor('typed');
startTypingFor('typeTarget');


const reveals = $$('.reveal');
if (reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => io.observe(r));
}


$$('.tilt').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * 8;
    const ry = (x - 0.5) * -8;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


const form = $('#contactForm');
const status = $('#formStatus') || $('#formStatus') || $('#status');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get('name') || '').toString().trim();
    const email = (fd.get('email') || '').toString().trim();
    const msg = (fd.get('message') || '').toString().trim();
    if (!name || !email || !msg) {
      if (status) status.textContent = 'Please fill all fields.';
      setTimeout(() => { if (status) status.textContent = ''; }, 2400);
      return;
    }
    if (status) status.textContent = 'Sending…';
    setTimeout(() => {
      if (status) status.textContent = 'Message simulated as sent!';
      form.reset();
      setTimeout(() => { if (status) status.textContent = ''; }, 3000);
    }, 900);
  });
}


const navLinks = $$('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    // set link hover color to accent-solid
    link.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent-solid').trim() || '#6c63ff';
  });
  link.addEventListener('mouseleave', () => {
    link.style.color = '';
  });
});



(function particles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'bgCanvas';
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const COUNT = Math.max(24, Math.floor((w * h) / 120000));

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function make() {
    particles.length = 0;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: rand(0, w),
        y: rand(0, h),
        r: rand(0.6, 3),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.12, 0.12),
        hue: rand(180, 300)
      });
    }
  }

  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    make();
  }
  window.addEventListener('resize', resize, { passive: true });

  make();
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 8);
      g.addColorStop(0, `hsla(${p.hue},80%,70%,0.12)`);
      g.addColorStop(1, `hsla(${p.hue},80%,70%,0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


if (mobileMenu) {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
}
