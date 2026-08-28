/* ============ Ayush Kumar Pandey — Portfolio JS ============ */

const phrases = [
  '200+ DSA Problems (LeetCode & GFG).',
  'AI / ML Solutions.',
  'Data Pipelines & PySpark.',
  'Snowflake & ETL.',
  'Backend REST APIs.',
  'Computer Vision & TensorFlow.'
];
const typedEl = document.getElementById('typed');
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 45 : 90);
}
type();

// ---------- Navbar: hide on scroll down, show on scroll up ----------
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 20);
  if (y > lastScroll && y > 120) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }
  lastScroll = y;
});

// ---------- Mobile menu ----------
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// ---------- Reveal sections on scroll ----------
const revealTargets = document.querySelectorAll(
  '.section-title, .about-grid, .skill-card, .project-card, .timeline-item, .cert-card, .contact-text, .leetcode-stats-card, .gfg-stats-card, .leetcode-embed-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        if (entry.target.classList.contains('leetcode-stats-card')) {
          animateLeetCodeCounters();
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach(el => observer.observe(el));

// ---------- Active nav link highlight ----------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l =>
          l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`)
        );
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach(s => sectionObserver.observe(s));

// ---------- Dynamic LeetCode API Integration ----------
let leetCodeData = null;

async function fetchLeetCodeStats() {
  const username = 'P5Dtti61ig';
  try {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
    if (!res.ok) return;
    const data = await res.json();
    leetCodeData = data;
    updateLeetCodeDOM(data);
  } catch (err) {
    console.log('Using fallback static LeetCode data:', err);
  }
}

function updateLeetCodeDOM(data) {
  const totalSolvedEl = document.getElementById('lc-total-solved');
  const easyCountEl = document.getElementById('lc-easy-count');
  const mediumCountEl = document.getElementById('lc-medium-count');
  const hardCountEl = document.getElementById('lc-hard-count');
  const easyBar = document.getElementById('lc-easy-bar');
  const mediumBar = document.getElementById('lc-medium-bar');
  const hardBar = document.getElementById('lc-hard-bar');
  const rankEl = document.getElementById('lc-rank');
  const recentSubContainer = document.getElementById('lc-recent-submissions');

  if (data.totalSolved !== undefined) {
    totalSolvedEl.setAttribute('data-target', data.totalSolved);
    totalSolvedEl.textContent = data.totalSolved;
  }

  if (data.easySolved !== undefined && data.totalEasy !== undefined) {
    easyCountEl.textContent = `${data.easySolved} / ${data.totalEasy}`;
    const pct = Math.round((data.easySolved / data.totalSolved) * 100);
    if (easyBar) easyBar.style.width = `${pct}%`;
  }

  if (data.mediumSolved !== undefined && data.totalMedium !== undefined) {
    mediumCountEl.textContent = `${data.mediumSolved} / ${data.totalMedium}`;
    const pct = Math.round((data.mediumSolved / data.totalSolved) * 100);
    if (mediumBar) mediumBar.style.width = `${pct}%`;
  }

  if (data.hardSolved !== undefined && data.totalHard !== undefined) {
    hardCountEl.textContent = `${data.hardSolved} / ${data.totalHard}`;
    const pct = Math.round((data.hardSolved / data.totalSolved) * 100);
    if (hardBar) hardBar.style.width = `${pct}%`;
  }

  if (data.ranking) {
    rankEl.textContent = `Rank: #${data.ranking.toLocaleString()}`;
  }

  if (data.recentSubmissions && data.recentSubmissions.length > 0) {
    const acceptedOnly = data.recentSubmissions
      .filter(s => s.statusDisplay === 'Accepted')
      .slice(0, 6);

    if (acceptedOnly.length > 0 && recentSubContainer) {
      recentSubContainer.innerHTML = acceptedOnly
        .map(
          s => `
          <span class="sub-tag">
            ${escapeHTML(s.title)}
            <small>${escapeHTML(s.lang.toUpperCase())}</small>
          </span>
        `
        )
        .join('');
    }
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

let animatedCounters = false;
function animateLeetCodeCounters() {
  if (animatedCounters) return;
  animatedCounters = true;

  const counterEl = document.getElementById('lc-total-solved');
  if (!counterEl) return;

  const target = parseInt(counterEl.getAttribute('data-target') || counterEl.textContent) || 150;
  let current = 0;
  const duration = 1200; // ms
  const stepTime = Math.abs(Math.floor(duration / target));

  const timer = setInterval(() => {
    current += 1;
    counterEl.textContent = current;
    if (current >= target) {
      counterEl.textContent = target;
      clearInterval(timer);
    }
  }, Math.max(stepTime, 12));
}

// Fetch stats on page load
fetchLeetCodeStats();

async function fetchGFGStats() {
  const username = 'ayushpan50qt';
  try {
    const res = await fetch(`https://gfg-stats-api.vercel.app/${username}`);
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.totalProblemsSolved !== undefined) {
      const gfgSolvedEl = document.getElementById('gfg-total-solved');
      const gfgDaysEl = document.getElementById('gfg-active-days');
      if (gfgSolvedEl) gfgSolvedEl.textContent = `${data.totalProblemsSolved}+`;
      if (gfgDaysEl && data.data && data.data.totalActiveDays) {
        gfgDaysEl.textContent = `${data.data.totalActiveDays} Days`;
      }
    }
  } catch (err) {
    console.log('Using fallback static GFG data:', err);
  }
}

fetchGFGStats();

