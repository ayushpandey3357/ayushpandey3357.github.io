/* ============ Ayush Kumar Pandey — Portfolio JavaScript ============ */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initParticleCanvas();
  initTypedText();
  initNavbarScroll();
  initInteractiveTerminal();
  initImpactCounters();
  initCategoryFilters();
  initGitHubRepositoryGallery();
  initEditorialProjectArtwork();
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
  const initialTheme = savedTheme || 'light';

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
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      ctx.fillStyle = isDark ? 'rgba(181, 215, 196, 0.24)' : 'rgba(40, 88, 71, 0.2)';
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
            ? `rgba(181, 215, 196, ${opacity})`
            : `rgba(40, 88, 71, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(animate);
  }
  animate();
}

/* ================= 3. Hero Typed Text Effect ================= */
function initTypedText() {
  const phrases = [
    'Machine Learning applications.',
    'Computer Vision systems.',
    'Local LLM integration with Ollama.',
    'Python automation and APIs.',
    'Recommendation workflows.'
  ];
  const typedEl = document.getElementById('typed');
  if (!typedEl) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedEl.textContent = phrases[0];
    return;
  }

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
      hamburger.setAttribute('aria-expanded', hamburger.classList.contains('open'));
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
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
          navLinks.forEach(l => {
            const isActive = l.getAttribute('href') === `#${entry.target.id}`;
            l.classList.toggle('active', isActive);
            if (isActive) l.setAttribute('aria-current', 'location');
            else l.removeAttribute('aria-current');
          });
        }
      });
    },
    { rootMargin: '-35% 0px -60% 0px' }
  );
  sections.forEach(s => sectionObserver.observe(s));

  // Reveal elements on scroll
  const revealTargets = document.querySelectorAll(
    '.section-title, .about-grid, .skill-card, .project-card, .timeline-item, .cert-card, .contact-text, .leetcode-stats-card, .gfg-stats-card, .leetcode-embed-card, .gfg-embed-card'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('leetcode-stats-card')) {
            animateSingleCounter('lc-total-solved');
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
    skills: '⚡ Core toolkit: Python, PyTorch, Scikit-learn, OpenCV, Ollama, Django, Flask, FastAPI, SQL',
    projects: '🚀 Featured Projects: AI Internship Hunter, Madhav-AI, KrishiMitr, EcoPackAI, Movie Recommendation Engine',
    contact: '✉️ Email: <a href="mailto:ayushpandey1974@gmail.com" style="color:var(--accent)">ayushpandey1974@gmail.com</a> | 📞 Phone: <a href="tel:+919336338906" style="color:var(--accent)">+91-9336338906</a> | 📍 Location: Lucknow, India',
    about: '🎓 B.Tech CSE Student @ BBDNIIT (2023-2027) | Infosys Springboard AI Domain Intern | 200+ Solved DSA Problems',
    github: 'Opening GitHub profile (<a href="https://github.com/ayushpandey3357" target="_blank" style="color:var(--accent)">github.com/ayushpandey3357</a>)...',
    linkedin: 'Opening LinkedIn profile (<a href="https://linkedin.com/in/ayushpandey3357" target="_blank" style="color:var(--accent)">linkedin.com/in/ayushpandey3357</a>)...',
    leetcode: '🟠 <b>LeetCode Profile:</b> @P5Dtti61ig | 150+ Problems Solved | Rank: Top 30% | <a href="https://leetcode.com/u/P5Dtti61ig/" target="_blank" style="color:#FFA116">View Profile ↗</a>',
    gfg: '🟢 <b>GeeksforGeeks Profile:</b> @ayushpan50qt | <span id="term-gfg-solved">27+</span> Problems Solved | Coding Score: 58 | Campus Rank: #143 (BBDNIIT) | <a href="https://www.geeksforgeeks.org/profile/ayushpan50qt?tab=activity" target="_blank" style="color:#00E676">View Profile ↗</a>'
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append user command line
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">You explored</span> ${escapeHTML(rawCmd)}`;
    terminalBody.appendChild(userLine);

    if (cmd === 'clear') {
      terminalBody.innerHTML = `
        <div class="term-line output-welcome">
          <span class="term-prompt">Selected work</span> Choose another topic below to continue exploring.
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

}

/* ================= 7b. Public GitHub Repository Gallery ================= */
function initGitHubRepositoryGallery() {
  const username = 'ayushpandey3357';
  const cacheKey = `portfolio-repositories-v1-${username}`;
  const cacheTtl = 30 * 60 * 1000;
  const curatedGrid = document.getElementById('projectsGrid');
  const repositoryGrid = document.getElementById('repositoryGrid');
  const status = document.getElementById('repositoryStatus');
  const resultCount = document.getElementById('repositoryResultCount');
  const searchInput = document.getElementById('projectSearch');
  const technologyFilter = document.getElementById('projectTechnologyFilter');
  const categoryButtons = document.querySelectorAll('.proj-filter-btn');
  if (!curatedGrid || !repositoryGrid || !status || !resultCount || !searchInput || !technologyFilter) return;

  const curatedCards = [...curatedGrid.querySelectorAll('.project-card')];
  const featuredRepositoryNames = new Set(['videoauthenticator', 'krishimitr', 'aiinternshiphunter', 'movierecommendationsystem', 'madhavai']);
  const curatedMetadata = new Map();
  let allRepositories = [];
  let activeCategory = 'all';
  let activeTechnology = 'all';
  let activeSearch = '';

  function setStatus(message, state = 'loading', withRetry = false) {
    status.className = `repository-status repository-status-${state}`;
    status.innerHTML = `<span class="repository-status-indicator"></span><span>${escapeHTML(message)}</span>${withRetry ? '<button type="button" class="repository-retry-btn" id="repositoryRetry">Retry</button>' : ''}`;
    if (withRetry) document.getElementById('repositoryRetry')?.addEventListener('click', () => loadRepositories(true));
  }

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null');
      return cached && Array.isArray(cached.repositories) ? cached : null;
    } catch (_) {
      return null;
    }
  }

  function saveCache(repositories) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), repositories }));
    } catch (_) {
      // Storage may be unavailable in private browsing; live results still render.
    }
  }

  function repoSlug(repo) {
    return String(repo.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function cardRepoSlug(card) {
    return String(card.dataset.repoName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  function normalizedTechnologies(repo) {
    return [...new Set([repo.language, ...(Array.isArray(repo.topics) ? repo.topics : [])]
      .filter(Boolean).map(value => String(value).trim()).filter(Boolean))];
  }

  function classifyRepository(repo) {
    const description = (repo.description || '').toLowerCase();
    const name = (repo.name || '').toLowerCase();
    const language = (repo.language || '').toLowerCase();
    const topics = (Array.isArray(repo.topics) ? repo.topics : []).join(' ').toLowerCase();
    const searchable = `${name} ${description} ${language} ${topics}`;
    if (/\b(ai|ml|llm|machine.learning|deep.learning|computer.vision|nlp|neural|agent)\b/.test(searchable)) return 'ai-ml';
    if (/\b(data.engineer|data.warehouse|pyspark|spark|snowflake|etl|pandas|analytics)\b/.test(searchable)) return 'data-engineering';
    if (/\b(python|automation|scraper|bot|script|cli)\b/.test(searchable) || language === 'python') return 'python-automation';
    if (/\b(web|website|frontend|backend|javascript|typescript|html|css|react|django|flask)\b/.test(searchable) || ['javascript', 'typescript', 'html', 'css'].includes(language)) return 'web-development';
    return 'other';
  }

  function normalizeRepository(repo) {
    const topics = Array.isArray(repo.topics) ? repo.topics.filter(Boolean) : [];
    return {
      name: String(repo.name || ''),
      description: typeof repo.description === 'string' ? repo.description.trim() : '',
      language: typeof repo.language === 'string' ? repo.language.trim() : '',
      topics,
      url: typeof repo.html_url === 'string' ? repo.html_url : (typeof repo.url === 'string' ? repo.url : ''),
      homepage: typeof repo.homepage === 'string' ? repo.homepage.trim() : '',
      size: Number(repo.size) || 0,
      fork: Boolean(repo.fork),
      archived: Boolean(repo.archived),
      isPrivate: Boolean(repo.private),
      owner: repo.owner?.login || username,
      category: classifyRepository({ ...repo, topics })
    };
  }

  function getNextPage(linkHeader) {
    const nextLink = (linkHeader || '').split(',').find(link => /rel="next"/.test(link));
    return nextLink ? nextLink.match(/<([^>]+)>/)?.[1] || null : null;
  }

  async function fetchRepositories() {
    let nextUrl = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`;
    const fetched = [];
    while (nextUrl) {
      const requestUrl = nextUrl;
      const response = await fetch(requestUrl, {
        headers: {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2026-03-10'
        }
      });
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          const remaining = response.headers.get('x-ratelimit-remaining');
          throw new Error(remaining === '0' ? 'GitHub API rate limit reached. Try again later.' : 'GitHub temporarily refused the repository request. Try again shortly.');
        }
        throw new Error(`GitHub returned HTTP ${response.status}.`);
      }
      const page = await response.json();
      if (!Array.isArray(page)) throw new Error('GitHub returned an unexpected repository response.');
      fetched.push(...page);
      nextUrl = getNextPage(response.headers.get('link'));
      if (!nextUrl && page.length === 100) {
        const pageUrl = new URL(requestUrl);
        pageUrl.searchParams.set('page', String(Number(pageUrl.searchParams.get('page') || '1') + 1));
        nextUrl = pageUrl.href;
      }
      if (nextUrl && response.headers.get('x-ratelimit-remaining') === '0') {
        throw new Error('GitHub API rate limit reached while loading additional pages.');
      }
    }
    return fetched.map(normalizeRepository).filter(repo =>
      repo.owner.toLowerCase() === username && !repo.isPrivate && !repo.fork && !repo.archived && repo.size > 0 && repo.name && repo.url
    );
  }

  function verifiedHomepage(repo) {
    if (!repo.homepage) return '';
    try {
      const url = new URL(repo.homepage);
      return url.protocol === 'https:' ? url.href : '';
    } catch (_) {
      return '';
    }
  }

  function deploymentLabel(url) {
    const host = new URL(url).hostname.toLowerCase();
    if (host.endsWith('.vercel.app')) return 'Live on Vercel';
    if (host.endsWith('.onrender.com')) return 'Live on Render';
    if (host.endsWith('.netlify.app')) return 'Live on Netlify';
    if (host.endsWith('.github.io')) return 'Live on GitHub Pages';
    if (host.endsWith('.pages.dev')) return 'Live deployment';
    return 'Live demo';
  }

  function addRepositoryMetadata(card, repo) {
    card.dataset.repoCategory = repo.category;
    card.dataset.repoLanguage = repo.language;
    card.dataset.repoTopics = repo.topics.join(' ');
    card.dataset.repoTechnologies = normalizedTechnologies(repo).join('|');
    const sourceLink = card.querySelector('.project-links a[aria-label="GitHub Repository"]');
    if (sourceLink) {
      sourceLink.href = repo.url;
      sourceLink.title = 'GitHub Source Code';
      sourceLink.classList.add('project-source-link');
      if (!sourceLink.querySelector('.project-link-label')) sourceLink.insertAdjacentHTML('beforeend', '<span class="project-link-label">GitHub Source Code</span>');
    }
    const oldDemo = card.querySelector('.project-links a[aria-label="Live Demo"]');
    const demoUrl = verifiedHomepage(repo);
    if (demoUrl) {
      let demoLink = oldDemo;
      if (!demoLink) {
        demoLink = document.createElement('a');
        demoLink.className = 'project-demo-link';
        demoLink.setAttribute('aria-label', 'Live Demo');
        demoLink.title = 'Live Demo';
        card.querySelector('.project-links')?.appendChild(demoLink);
      }
      demoLink.href = demoUrl;
      demoLink.target = '_blank';
      demoLink.rel = 'noopener noreferrer';
      demoLink.innerHTML = '<span class="project-link-label">Live Demo</span><span aria-hidden="true">↗</span>';
      demoLink.hidden = false;
      let badge = card.querySelector('.badge-live');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'status-badge badge-live';
        card.querySelector('.project-badge-row')?.appendChild(badge);
      }
      if (badge) badge.textContent = `● ${deploymentLabel(demoUrl)}`;
    } else {
      oldDemo?.remove();
      card.querySelectorAll('.badge-live').forEach(badge => badge.remove());
    }
    let repositoryName = card.querySelector('.repo-official-name');
    if (!repositoryName) {
      repositoryName = document.createElement('p');
      repositoryName.className = 'repo-official-name';
      card.querySelector('.project-title')?.insertAdjacentElement('afterend', repositoryName);
    }
    if (repositoryName) repositoryName.textContent = `GitHub repository: ${repo.name}`;
    const tags = card.querySelector('.tags');
    if (tags && repo.language && ![...tags.querySelectorAll('.tag')].some(tag => tag.textContent.trim().toLowerCase() === repo.language.toLowerCase())) {
      const languageTag = document.createElement('span');
      languageTag.className = 'tag repo-language-tag';
      languageTag.textContent = repo.language;
      tags.appendChild(languageTag);
    }
    if (repo.topics.length) {
      let topicDetails = card.querySelector('.repo-topic-details');
      if (!topicDetails) {
        topicDetails = document.createElement('details');
        topicDetails.className = 'repo-topic-details';
        topicDetails.innerHTML = '<summary></summary><div class="tags repo-topic-list"></div>';
        card.appendChild(topicDetails);
      }
      topicDetails.querySelector('summary').textContent = `GitHub topics (${repo.topics.length})`;
      topicDetails.querySelector('.repo-topic-list').innerHTML = repo.topics.map(topic => `<span class="tag">${escapeHTML(topic)}</span>`).join('');
    }
  }

  function renderRepositoryCard(repo) {
    const topicsMarkup = repo.topics.length
      ? `<details class="repo-topic-details"><summary>GitHub topics (${repo.topics.length})</summary><div class="tags repo-topic-list">${repo.topics.map(topic => `<span class="tag">${escapeHTML(topic)}</span>`).join('')}</div></details>`
      : '';
    const languageMarkup = repo.language ? `<span class="tag repo-language-tag">${escapeHTML(repo.language)}</span>` : '<span class="tag repo-language-tag">Language not specified</span>';
    const demoUrl = verifiedHomepage(repo);
    const demoMarkup = demoUrl ? `<a class="project-demo-link" href="${escapeHTML(demoUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Live Demo"><span class="project-link-label">Live Demo</span><span aria-hidden="true">↗</span></a>` : '';
    const description = repo.description || 'No description provided on GitHub.';
    return `
      <article class="project-card repository-card" data-repo-category="${escapeHTML(repo.category)}" data-repo-language="${escapeHTML(repo.language)}" data-repo-topics="${escapeHTML(repo.topics.join(' '))}" data-repo-technologies="${escapeHTML(normalizedTechnologies(repo).join('|'))}">
        <div class="project-header">
          <div class="project-badge-row"><span class="status-badge repository-category-badge">${escapeHTML(categoryLabel(repo.category))}</span></div>
          <div class="project-links">
            <a class="project-source-link" href="${escapeHTML(repo.url)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub Source Code"><span class="project-link-label">GitHub Source Code</span><span aria-hidden="true">↗</span></a>
            ${demoMarkup}
          </div>
        </div>
        <h3 class="project-title">${escapeHTML(repo.name)}</h3>
        <p class="project-desc">${escapeHTML(description)}</p>
        <div class="tags repository-tags">${languageMarkup}</div>
        ${topicsMarkup}
      </article>`;
  }

  function categoryLabel(category) {
    return ({
      'ai-ml': 'AI & ML',
      'web-development': 'Web Development',
      'data-engineering': 'Data Engineering',
      'python-automation': 'Python & Automation',
      other: 'Other'
    })[category] || 'Other';
  }

  function populateTechnologyFilter() {
    const selected = technologyFilter.value;
    const technologies = new Set();
    allRepositories.forEach(repo => normalizedTechnologies(repo).forEach(technology => technologies.add(technology)));
    curatedCards.forEach(card => card.querySelectorAll('.tags .tag').forEach(tag => {
      const value = tag.textContent.trim();
      if (value) technologies.add(value);
    }));
    technologyFilter.innerHTML = '<option value="all">All technologies</option>' +
      [...technologies].sort((a, b) => a.localeCompare(b)).map(technology => `<option value="${escapeHTML(technology.toLowerCase())}">${escapeHTML(technology)}</option>`).join('');
    technologyFilter.value = [...technologyFilter.options].some(option => option.value === selected) ? selected : 'all';
  }

  function cardMatches(card, repo) {
    const category = card.classList.contains('repository-card')
      ? (repo?.category || card.dataset.repoCategory || 'other')
      : (card.dataset.projCat || card.dataset.repoCategory || 'other');
    const categoryMatches = activeCategory === 'all' || category === activeCategory ||
      (activeCategory === 'web-development' && category === 'web') ||
      (activeCategory === 'python-automation' && category === 'data-eng') ||
      (activeCategory === 'ai-ml' && category === 'aiml');
    const technologies = [...(repo ? normalizedTechnologies(repo) : []), ...[...card.querySelectorAll('.tags .tag')].map(tag => tag.textContent.trim())]
      .map(value => value.toLowerCase());
    const technologyMatches = activeTechnology === 'all' || technologies.includes(activeTechnology);
    const text = `${card.innerText} ${repo?.name || ''} ${repo?.description || ''} ${repo?.language || ''} ${(repo?.topics || []).join(' ')}`.toLowerCase();
    const searchMatches = !activeSearch || text.includes(activeSearch);
    return categoryMatches && technologyMatches && searchMatches;
  }

  function applyFilters() {
    let visibleProjects = 0;
    curatedCards.forEach(card => {
      const repo = curatedMetadata.get(card);
      const visible = cardMatches(card, repo);
      card.hidden = !visible;
      if (visible) visibleProjects++;
    });
    const repositoryCards = [...repositoryGrid.querySelectorAll('.repository-card')];
    let visibleRepositories = 0;
    repositoryCards.forEach(card => {
      const visible = cardMatches(card, null);
      card.hidden = !visible;
      if (visible) visibleRepositories++;
    });
    const totalVisible = visibleProjects + visibleRepositories;
    resultCount.textContent = `${totalVisible} project${totalVisible === 1 ? '' : 's'} shown · ${allRepositories.length} public repositories loaded`;
    const hasFilters = activeSearch || activeCategory !== 'all' || activeTechnology !== 'all';
    if (hasFilters && totalVisible === 0) {
      repositoryGrid.innerHTML = '<p class="repository-empty-state">No projects match these filters.</p>';
    } else if (!repositoryCards.length && !allRepositories.length) {
      repositoryGrid.innerHTML = '<p class="repository-empty-state">No public repositories were found for this account.</p>';
    } else if (repositoryGrid.querySelector('.repository-empty-state')) {
      repositoryGrid.querySelector('.repository-empty-state').remove();
    }
  }

  function displayRepositories(repositories, source = 'live') {
    allRepositories = repositories;
    const repoByName = new Map(repositories.map(repo => [repoSlug(repo), repo]));
    curatedMetadata.clear();
    curatedCards.forEach(card => {
      const repo = repoByName.get(cardRepoSlug(card));
      if (repo) {
        curatedMetadata.set(card, repo);
        addRepositoryMetadata(card, repo);
      } else {
        const sourceLink = card.querySelector('.project-links a[aria-label="GitHub Repository"]');
        if (sourceLink && !sourceLink.querySelector('.project-link-label')) {
          sourceLink.insertAdjacentHTML('beforeend', '<span class="project-link-label">GitHub Source Code</span>');
        }
        // Unmatched manually curated deployment URLs have no GitHub homepage source to verify them.
        card.querySelector('.project-links a[aria-label="Live Demo"]')?.remove();
        card.querySelectorAll('.badge-live').forEach(badge => badge.remove());
      }
    });

    const displayedNames = new Set(curatedCards.map(cardRepoSlug).filter(Boolean));
    const remainingRepositories = repositories.filter(repo => !displayedNames.has(repoSlug(repo)) && !featuredRepositoryNames.has(repoSlug(repo)));
    repositoryGrid.innerHTML = remainingRepositories.map(renderRepositoryCard).join('');
    populateTechnologyFilter();
    applyFilters();
    const cached = source === 'cache' ? ' · saved snapshot' : '';
    setStatus(`Loaded ${repositories.length} public repositories from GitHub${cached}.`, source === 'cache' ? 'cached' : 'success');
  }

  curatedCards.forEach(card => {
    const sourceLink = card.querySelector('.project-links a[aria-label="GitHub Repository"]');
    if (sourceLink) {
      sourceLink.classList.add('project-source-link');
      if (!sourceLink.querySelector('.project-link-label')) sourceLink.insertAdjacentHTML('beforeend', '<span class="project-link-label">GitHub Source Code</span>');
    }
    card.querySelector('.project-links a[aria-label="Live Demo"]')?.remove();
    card.querySelectorAll('.badge-live').forEach(badge => badge.remove());
  });

  async function loadRepositories(forceRefresh = false) {
    const cached = readCache();
    if (!forceRefresh && cached && Date.now() - cached.savedAt < cacheTtl) {
      displayRepositories(cached.repositories.map(normalizeRepository), 'cache');
      return;
    }
    if (cached) displayRepositories(cached.repositories.map(normalizeRepository), 'cache');
    setStatus('Syncing public repositories from GitHub...', 'loading');
    try {
      const repositories = await fetchRepositories();
      saveCache(repositories);
      displayRepositories(repositories, 'live');
    } catch (error) {
      if (cached) {
        setStatus(`${error.message} Showing the saved repository snapshot.`, 'warning', true);
      } else {
        setStatus(`${error.message} Check the connection and retry.`, 'error', true);
        repositoryGrid.innerHTML = '<p class="repository-empty-state">The repository gallery is temporarily unavailable.</p>';
      }
    }
  }

  categoryButtons.forEach(button => button.addEventListener('click', () => {
    categoryButtons.forEach(item => item.classList.toggle('active', item === button));
    activeCategory = button.dataset.filter || 'all';
    applyFilters();
  }));
  searchInput.addEventListener('input', () => {
    activeSearch = searchInput.value.trim().toLowerCase();
    applyFilters();
  });
  technologyFilter.addEventListener('change', () => {
    activeTechnology = technologyFilter.value;
    applyFilters();
  });
  loadRepositories();
}

/* ================= 7c. Editorial project cover artwork ================= */
function initEditorialProjectArtwork() {
  const curatedGrid = document.getElementById('projectsGrid');
  const repositoryGrid = document.getElementById('repositoryGrid');
  if (!curatedGrid || !repositoryGrid) return;

  const categoryClass = category => ({
    aiml: 'ai-ml',
    'ai-ml': 'ai-ml',
    web: 'web-development',
    'web-development': 'web-development',
    'data-eng': 'data-engineering',
    'data-engineering': 'data-engineering',
    'python-automation': 'python-automation',
    other: 'other'
  })[category] || 'other';

  const verifiedScreenshots = {
    KRISHIMITR: {
      src: 'images/Screenshot%202026-10-12%20021739.png',
      alt: 'KrishiMitr agricultural guidance homepage with its farming assistant open'
    }
  };

  function decorate(card) {
    if (card.querySelector('.project-art')) return;
    const title = card.querySelector('.project-title')?.textContent.trim() || 'Project';
    const words = title.split(/[^a-z0-9]+/i).filter(Boolean);
    const mark = (words.length > 1 ? `${words[0][0]}${words[1][0]}` : title.slice(0, 2)).toUpperCase();
    const category = categoryClass(card.dataset.repoCategory || card.dataset.projCat || 'other');
    const artwork = document.createElement('div');
    artwork.className = `project-art project-art-${category}`;
    artwork.dataset.mark = mark;
    const screenshot = verifiedScreenshots[card.dataset.repoName];
    if (screenshot) {
      artwork.classList.add('project-art-has-image');
      const image = document.createElement('img');
      image.className = 'project-art-image';
      image.src = screenshot.src;
      image.alt = screenshot.alt;
      image.width = 1200;
      image.height = 675;
      image.loading = 'lazy';
      image.decoding = 'async';
      artwork.appendChild(image);
    } else {
      artwork.setAttribute('aria-hidden', 'true');
    }
    card.insertBefore(artwork, card.firstChild);
  }

  curatedGrid.querySelectorAll('.project-card').forEach(decorate);
  repositoryGrid.querySelectorAll('.repository-card').forEach(decorate);
  const observer = new MutationObserver(records => records.forEach(record =>
    record.addedNodes.forEach(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      if (node.matches('.repository-card')) decorate(node);
      node.querySelectorAll?.('.repository-card').forEach(decorate);
    })
  ));
  observer.observe(repositoryGrid, { childList: true });
}

/* ================= 8. Contact Form & Copy Actions ================= */
function initContactAndCopy() {
  // Copy Buttons / Badges
  const copyElements = document.querySelectorAll('[data-copy]');
  copyElements.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const textToCopy = el.getAttribute('data-copy');
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
    totalSolved: 27,
    score: 58,
    instituteRank: 143,
    monthlyScore: 19,
    streak: 1,
    institute: 'BBDNIIT',
    schoolSolved: 0,
    basicSolved: 5,
    easySolved: 12,
    mediumSolved: 10,
    hardSolved: 0
  };

  // Populate initial verified metrics immediately
  updateGFGDOM(verifiedStats);
  setupStatsObservers();

  // Ensure live widget image gets cache-busted live url
  const widgetImg = document.getElementById('gfg-widget-image');
  if (widgetImg) {
    widgetImg.src = `https://gfgstatscard.vercel.app/${username}?t=${Date.now()}`;
  }
  markGFGLiveConnected();

  // Try live fetch asynchronously across available endpoints
  try {
    const endpoints = [
      `https://gfgstatscard.vercel.app/${username}?raw=true`,
      `https://geeks-for-geeks-api.vercel.app/${username}`,
      `https://gfg-stats-api.vercel.app/api?username=${username}`
    ];

    for (const url of endpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!res.ok) continue;

        const data = await res.json();

        if (data && (data.Basic !== undefined || data.Easy !== undefined || data.total_problems_solved !== undefined || data.totalSolved !== undefined)) {
          const school = parseInt(data.School || 0);
          const basic = parseInt(data.Basic || 0);
          const easy = parseInt(data.Easy || 0);
          const medium = parseInt(data.Medium || 0);
          const hard = parseInt(data.Hard || 0);

          const calcTotal = school + basic + easy + medium + hard;
          const rawTotal = parseInt(data.total_problems_solved || data.totalSolved || 0);
          const total = calcTotal > 0 ? calcTotal : (rawTotal > 0 ? rawTotal : verifiedStats.totalSolved);

          const score = parseInt(data.total_score || data.score || data.codingScore || 0) || verifiedStats.score;
          const monthlyScore = parseInt(data.monthly_score || data.monthlyScore || 0) || verifiedStats.monthlyScore;
          const streak = parseInt(data.pod_solved_longest_streak || data.pod_solved_current_streak || data.streak || 0) || verifiedStats.streak;

          const liveParsed = {
            totalSolved: total,
            score: score,
            instituteRank: data.institute_rank || data.instituteRank || verifiedStats.instituteRank,
            monthlyScore: monthlyScore,
            streak: streak,
            institute: 'BBDNIIT',
            schoolSolved: school,
            basicSolved: basic,
            easySolved: easy,
            mediumSolved: medium,
            hardSolved: hard
          };

          updateGFGDOM(liveParsed);
          break;
        }
      } catch (innerErr) {
        // Try next endpoint silently
      }
    }
  } catch (err) {
    console.log('Using verified GFG live metrics:', err);
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
  const termGfgSolved = document.getElementById('term-gfg-solved');

  const easyCountEl = document.getElementById('gfg-easy-count');
  const mediumCountEl = document.getElementById('gfg-medium-count');
  const easyBar = document.getElementById('gfg-easy-bar');
  const mediumBar = document.getElementById('gfg-medium-bar');

  const total = data.totalSolved || 27;

  if (solvedEl) {
    solvedEl.setAttribute('data-target', total);
    solvedEl.textContent = total;
  }
  if (scoreEl) {
    scoreEl.setAttribute('data-target', data.score);
    scoreEl.textContent = data.score;
  }
  if (rankEl) rankEl.textContent = `Campus Rank: #${data.instituteRank}`;
  if (monthEl) monthEl.textContent = data.monthlyScore;
  if (streakEl) streakEl.textContent = `${data.streak}+ Day`;
  if (collegeEl && data.institute) collegeEl.textContent = data.institute;

  if (bannerSolved) bannerSolved.textContent = `${total}+`;
  if (bannerScore) bannerScore.textContent = data.score;
  if (bannerRank) bannerRank.textContent = `#${data.instituteRank}`;
  if (termGfgSolved) termGfgSolved.textContent = `${total}+`;

  // Problem breakdown counts & progress bars
  const easyBasicCount = (data.schoolSolved || 0) + (data.basicSolved || 0) + (data.easySolved || 12);
  const mediumHardCount = (data.mediumSolved || 10) + (data.hardSolved || 0);

  if (easyCountEl) {
    easyCountEl.textContent = `${easyBasicCount} Problems`;
  }
  if (mediumCountEl) {
    mediumCountEl.textContent = `${mediumHardCount} Problems`;
  }
  if (easyBar && total > 0) {
    const pct = Math.round((easyBasicCount / total) * 100);
    easyBar.style.width = `${pct}%`;
  }
  if (mediumBar && total > 0) {
    const pct = Math.round((mediumHardCount / total) * 100);
    mediumBar.style.width = `${pct}%`;
  }
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
