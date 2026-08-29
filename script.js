/* ============ Ayush Kumar Pandey — Portfolio JavaScript ============ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleCanvas();
  initTypedText();
  initNavbarScroll();
  initInteractiveTerminal();
  initImpactCounters();
  initCategoryFilters();
  initContactAndCopy();
  initBackToTop();
  fetchLeetCodeStats();
  fetchGFGStats();
});

/* ================= 1. Dark & Light Theme System ================= */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Load saved theme or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  htmlElement.setAttribute('data-theme', initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} theme 🌙☀️`, 'info');
    });
  }
}

/* ================= 2. Ambient Particle Canvas ================= */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 100 };

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 25), 45);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.radius = Math.random() * 1.8 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(100, 255, 218, 0.4)' : 'rgba(2, 132, 199, 0.35)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / 130) * 0.15;
          ctx.strokeStyle = isDark
            ? `rgba(100, 255, 218, ${opacity})`
            : `rgba(2, 132, 199, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ================= 3. Hero Typed Text Effect ================= */
function initTypedText() {
  const phrases = [
    '200+ DSA Problems (LeetCode & GFG).',
    'AI / ML Solutions & Models.',
    'Apache Spark & PySpark Pipelines.',
    'Snowflake & Data Warehousing.',
    'Backend Django & Flask REST APIs.',
    'Computer Vision & Signal Processing.'
  ];
  const typedEl = document.getElementById('typed');
  if (!typedEl) return;

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
    setTimeout(type, deleting ? 40 : 85);
  }
  type();
}

/* ================= 4. Navbar & Smooth Scroll ================= */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', y > 20);
      if (y > lastScroll && y > 120) {
        navbar.classList.add('hidden');
      } else {
        navbar.classList.remove('hidden');
      }
    }
    lastScroll = y;
  });

  if (hamburger && navMenu) {
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
  }

  // Active link scroll observer
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
    { rootMargin: '-35% 0px -60% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));

  // Reveal elements on scroll
  const revealTargets = document.querySelectorAll(
    '.section-title, .about-grid, .skill-card, .project-card, .timeline-item, .cert-card, .contact-text, .leetcode-stats-card, .gfg-stats-card, .leetcode-embed-card, .gfg-showcase-banner'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('leetcode-stats-card')) {
            animateLeetCodeCounters();
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  revealTargets.forEach(el => revealObserver.observe(el));
}

/* ================= 5. Interactive Mini Terminal ================= */
function initInteractiveTerminal() {
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalBody = document.getElementById('terminal-body');
  const chips = document.querySelectorAll('.chip-btn');

  if (!terminalForm || !terminalInput || !terminalBody) return;

  const commands = {
    help: 'Available commands: <span class="term-cmd">skills</span>, <span class="term-cmd">projects</span>, <span class="term-cmd">gfg</span>, <span class="term-cmd">leetcode</span>, <span class="term-cmd">contact</span>, <span class="term-cmd">about</span>, <span class="term-cmd">github</span>, <span class="term-cmd">linkedin</span>, <span class="term-cmd">clear</span>',
    skills: '⚡ Core Stack: Python, PySpark, Snowflake, TensorFlow, OpenCV, Django, Flask, MySQL, Docker',
    projects: '🚀 Featured Projects: VideoAuthenticator (AI Media Forensics), Krishi-Mitra (AI Crop Disease Detector), EcoPackAI, AI Internship Hunter',
    contact: '✉️ Email: ayushpandey1974@gmail.com | 📞 Phone: +91-9336338906 | 📍 Location: Lucknow, India',
    about: '🎓 B.Tech CSE Student @ BBDNIIT (2023-2027) | Infosys Springboard AI Domain Intern | 200+ Solved DSA Problems',
    github: 'Opening GitHub profile (<a href="https://github.com/ayushpandey3357" target="_blank" style="color:var(--accent)">github.com/ayushpandey3357</a>)...',
    linkedin: 'Opening LinkedIn profile (<a href="https://linkedin.com/in/ayushpandey3357" target="_blank" style="color:var(--accent)">linkedin.com/in/ayushpandey3357</a>)...',
    leetcode: '🟠 <b>LeetCode Profile:</b> @P5Dtti61ig | 150+ Problems Solved | Rank: Top 30% | <a href="https://leetcode.com/u/P5Dtti61ig/" target="_blank" style="color:#FFA116">View Profile ↗</a>',
    gfg: '🟢 <b>GeeksforGeeks Profile:</b> @ayushpan50qt | 21+ Problems Solved | Coding Score: 58 | Campus Rank: #143 (BBDNIIT) | <a href="https://www.geeksforgeeks.org/profile/ayushpan50qt?tab=activity" target="_blank" style="color:#00E676">View Profile ↗</a>'
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append user command line
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">ayush@portfolio:~$</span> ${escapeHTML(rawCmd)}`;
    terminalBody.appendChild(userLine);

    if (cmd === 'clear') {
      terminalBody.innerHTML = `
        <div class="term-line output-welcome">
          <span class="term-prompt">ayush@portfolio:~$</span> welcome --interactive
        </div>
        <div class="term-line output-text">
          👋 Terminal cleared. Type <span class="term-cmd">help</span> for available commands.
        </div>
      `;
    } else if (commands[cmd]) {
      const outputLine = document.createElement('div');
      outputLine.className = 'term-line output-text';
      outputLine.innerHTML = commands[cmd];
      terminalBody.appendChild(outputLine);

      if (cmd === 'github') window.open('https://github.com/ayushpandey3357', '_blank');
      if (cmd === 'linkedin') window.open('https://linkedin.com/in/ayushpandey3357', '_blank');
      if (cmd === 'leetcode') window.open('https://leetcode.com/u/P5Dtti61ig/', '_blank');
      if (cmd === 'gfg') window.open('https://www.geeksforgeeks.org/profile/ayushpan50qt?tab=activity', '_blank');
    } else {
      const errorLine = document.createElement('div');
      errorLine.className = 'term-line output-text';
      errorLine.innerHTML = `Command not found: "<span class="term-cmd">${escapeHTML(cmd)}</span>". Type <span class="term-cmd">help</span> to list commands.`;
      terminalBody.appendChild(errorLine);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  terminalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = terminalInput.value;
    executeCommand(cmd);
    terminalInput.value = '';
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });
}

/* ================= 6. Impact Metrics Counters ================= */
function initImpactCounters() {
  const statSection = document.querySelector('.stats-counter-bar');
  if (!statSection) return;

  let animated = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      const statNums = document.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const target = parseInt(el.getAttribute('data-target')) || 0;
        let current = 0;
        const duration = 1400; // ms
        const increment = target / (duration / 25);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 25);
      });
    }
  }, { threshold: 0.2 });

  observer.observe(statSection);
}

/* ================= 7. Category Filters (Skills & Projects) ================= */
function initCategoryFilters() {
  // Skill Filters
  const skillBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-skill-cat');
      skillCards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'block';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 250);
        }
      });
    });
  });

  // Project Filters
  const projBtns = document.querySelectorAll('.proj-filter-btn');
  const projCards = document.querySelectorAll('.project-card');

  projBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-proj-cat') === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 250);
        }
      });
    });
  });
}

/* ================= 8. Contact Form & Copy Actions ================= */
function initContactAndCopy() {
  // Copy Pills
  const copyPills = document.querySelectorAll('.copy-pill');
  copyPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const textToCopy = pill.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard! 📋`, 'success');
        }).catch(() => {
          showToast('Failed to copy. Please copy manually.', 'error');
        });
      }
    });
  });

  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value;

      const mailtoUrl = `mailto:ayushpandey1974@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
      
      window.location.href = mailtoUrl;
      showToast('Opening default email client... 🚀', 'success');
      contactForm.reset();
    });
  }
}

/* ================= 9. Toast Notification System ================= */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ================= 10. Back to Top Button ================= */
function initBackToTop() {
  const backBtn = document.getElementById('back-to-top');
  const circle = document.querySelector('.progress-ring-circle');
  if (!backBtn || !circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;

    const offset = circumference - (scrollPercent * circumference);
    circle.style.strokeDashoffset = offset;

    if (scrollTop > 300) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', updateProgress);
  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================= 11. LeetCode & GFG Live Stats API ================= */
async function fetchLeetCodeStats() {
  const username = 'P5Dtti61ig';
  try {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
    if (!res.ok) return;
    const data = await res.json();
    updateLeetCodeDOM(data);
  } catch (err) {
    console.log('Using verified fallback LeetCode data:', err);
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
      .slice(0, 5);

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
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

/* ================= 12. GeeksforGeeks Live Stats Fetcher ================= */
async function fetchGFGStats() {
  const username = 'ayushpan50qt';
  
  // Baseline verified live profile stats for ayushpan50qt
  const verifiedStats = {
    totalSolved: 21,
    score: 58,
    instituteRank: 143,
    monthlyScore: 19,
    streak: 1,
    institute: 'BBDNIIT',
    easySolved: 14,
    mediumSolved: 7
  };

  // Populate initial verified metrics immediately
  updateGFGDOM(verifiedStats);
  setupStatsObservers();

  // Try live fetch asynchronously across available endpoints
  try {
    const endpoints = [
      `https://geeks-for-geeks-api.vercel.app/${username}`,
      `https://geeks-for-geeks-stats-api.vercel.app/?userName=${username}&raw=y`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.geeksforgeeks.org/user/${username}/`)}`
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;

        if (url.includes('allorigins')) {
          const proxyData = await res.json();
          if (proxyData && proxyData.contents) {
            const html = proxyData.contents;
            const solvedMatch = html.match(/"total_problems_solved":\s*(\d+)/);
            const scoreMatch = html.match(/"score":\s*(\d+)/);
            const rankMatch = html.match(/"institute_rank":\s*(\d+)/);
            const monthMatch = html.match(/"monthly_score":\s*(\d+)/);
            const streakMatch = html.match(/"pod_solved_longest_streak":\s*(\d+)/);

            if (solvedMatch || scoreMatch) {
              const liveParsed = {
                totalSolved: solvedMatch ? parseInt(solvedMatch[1]) : verifiedStats.totalSolved,
                score: scoreMatch ? parseInt(scoreMatch[1]) : verifiedStats.score,
                instituteRank: rankMatch ? parseInt(rankMatch[1]) : verifiedStats.instituteRank,
                monthlyScore: monthMatch ? parseInt(monthMatch[1]) : verifiedStats.monthlyScore,
                streak: streakMatch ? parseInt(streakMatch[1]) : verifiedStats.streak,
                institute: 'BBDNIIT',
                easySolved: 14,
                mediumSolved: 7
              };
              updateGFGDOM(liveParsed);
              markGFGLiveConnected();
              break;
            }
          }
        } else {
          const apiData = await res.json();
          if (apiData && (apiData.totalProblemsSolved !== undefined || apiData.total_problems_solved !== undefined || apiData.score !== undefined)) {
            const total = apiData.totalProblemsSolved || apiData.total_problems_solved || verifiedStats.totalSolved;
            const score = apiData.score || apiData.codingScore || verifiedStats.score;
            const rank = apiData.instituteRank || apiData.rank || verifiedStats.instituteRank;
            
            updateGFGDOM({
              ...verifiedStats,
              totalSolved: total,
              score: score,
              instituteRank: rank
            });
            markGFGLiveConnected();
            break;
          }
        }
      } catch (innerErr) {
        // Continue to next endpoint if any
      }
    }
  } catch (err) {
    console.log('Using baseline GFG metrics:', err);
  }
}

function updateGFGDOM(data) {
  const solvedEl = document.getElementById('gfg-total-solved');
  const scoreEl = document.getElementById('gfg-coding-score');
  const rankEl = document.getElementById('gfg-institute-rank');
  const monthEl = document.getElementById('gfg-monthly-score');
  const streakEl = document.getElementById('gfg-streak');
  const collegeEl = document.getElementById('gfg-college');
  const bannerSolved = document.getElementById('gfg-banner-solved');
  const bannerScore = document.getElementById('gfg-banner-score');
  const bannerRank = document.getElementById('gfg-banner-rank');

  if (solvedEl) {
    solvedEl.setAttribute('data-target', data.totalSolved);
    solvedEl.textContent = data.totalSolved;
  }
  if (scoreEl) {
    scoreEl.setAttribute('data-target', data.score);
    scoreEl.textContent = data.score;
  }
  if (rankEl) rankEl.textContent = `Campus Rank: #${data.instituteRank}`;
  if (monthEl) monthEl.textContent = data.monthlyScore;
  if (streakEl) streakEl.textContent = `${data.streak}+ Day`;
  if (collegeEl && data.institute) collegeEl.textContent = data.institute;

  if (bannerSolved) bannerSolved.textContent = `${data.totalSolved}+`;
  if (bannerScore) bannerScore.textContent = data.score;
  if (bannerRank) bannerRank.textContent = `#${data.instituteRank}`;
}

function markGFGLiveConnected() {
  const badge = document.getElementById('gfg-status-badge');
  if (badge) {
    badge.innerHTML = '<span class="pulse-dot gfg-dot"></span> Live Sync';
    badge.classList.add('connected');
  }
}

/* ================= 13. Interactive Stats Counter Animations ================= */
function setupStatsObservers() {
  const leetCodeCard = document.querySelector('.leetcode-stats-card');
  const gfgCard = document.querySelector('.gfg-stats-card');

  if (leetCodeCard) {
    let lcAnimated = false;
    const lcObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !lcAnimated) {
        lcAnimated = true;
        animateSingleCounter('lc-total-solved');
      }
    }, { threshold: 0.2 });
    lcObserver.observe(leetCodeCard);
  }

  if (gfgCard) {
    let gfgAnimated = false;
    const gfgObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !gfgAnimated) {
        gfgAnimated = true;
        animateSingleCounter('gfg-total-solved');
        animateSingleCounter('gfg-coding-score');
      }
    }, { threshold: 0.2 });
    gfgObserver.observe(gfgCard);
  }
}

function animateSingleCounter(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const target = parseInt(el.getAttribute('data-target')) || parseInt(el.textContent) || 0;
  if (target <= 0) return;

  let current = 0;
  const duration = 1200;
  const stepTime = Math.max(15, Math.floor(duration / target));

  const timer = setInterval(() => {
    current += 1;
    el.textContent = current;
    if (current >= target) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, stepTime);
}
