/**
 * CodeCraft AI - Hackathon Project Showcase & Filterable Gallery
 * Interactive filters, search, and project detail modal.
 */

const ShowcaseProjects = [
  {
    id: 'neurovoice',
    title: 'NeuroVoice AI',
    category: 'agents',
    categoryLabel: 'AI Agents',
    summary: 'Real-time bidirectional speech synthesis and emotional tone recognition for accessibility with sub-100ms latency.',
    stars: 342,
    team: ['Elena Rostova', 'Kai Chen', 'Marcus Vance'],
    tech: ['Gemini Live API', 'WebAudio', 'WebRTC', 'Python'],
    architecture: 'Edge WebRTC Gateway -> Gemini Multimodal Live API -> Emotion Pitch Classifier -> Neural Vocoder',
    demoUrl: 'https://demo.codecraft.dev/neurovoice',
    githubUrl: 'https://github.com/codecraft-hackathon/neurovoice-ai',
    gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
    metrics: { 'Latency': '88 ms', 'Accuracy': '99.1%', 'Bandwidth': '24 kbps' }
  },
  {
    id: 'autocontract',
    title: 'AutoContract Validator',
    category: 'web3',
    categoryLabel: 'Web3',
    summary: 'Autonomous static analysis engine that checks Solidity smart contracts for reentrancy, flash-loan vulnerabilities, and gas waste.',
    stars: 289,
    team: ['Siddharth Patel', 'Amara Okafor'],
    tech: ['Solidity', 'Rust', 'Foundry', 'Z3 SMT Solver'],
    architecture: 'AST Parser -> Symbolic Execution Engine -> Z3 Theorem Prover -> Automated Exploit Generator',
    demoUrl: 'https://demo.codecraft.dev/autocontract',
    githubUrl: 'https://github.com/codecraft-hackathon/autocontract-validator',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    metrics: { 'Vulns Detected': '42 Zero-days', 'Scan Speed': '1.4s/contract', 'Coverage': '96%' }
  },
  {
    id: 'hyperprompt',
    title: 'HyperPrompt IDE',
    category: 'devtools',
    categoryLabel: 'DevTools',
    summary: 'Next-generation prompt engineering canvas with visual node branching, comparative model arena, and token cost visualizers.',
    stars: 512,
    team: ['Liam O\'Connor', 'Sophia Martinez', 'Devon Kim'],
    tech: ['TypeScript', 'Vite', 'Canvas API', 'Redis'],
    architecture: 'Infinite Canvas -> WebSocket State Sync -> Multi-LLM Benchmarking Engine -> Cost Optimizer',
    demoUrl: 'https://demo.codecraft.dev/hyperprompt',
    githubUrl: 'https://github.com/codecraft-hackathon/hyperprompt-ide',
    gradient: 'linear-gradient(135deg, #9d4edd 0%, #7928ca 100%)',
    metrics: { 'Models Supported': '28+', 'Live Users': '4,200', 'Latency Test': 'Concurrent' }
  },
  {
    id: 'biosynthetix',
    title: 'BioSynthetix',
    category: 'agents',
    categoryLabel: 'AI Agents',
    summary: 'Generative biomolecular protein folding pipeline predicting binding affinities for target therapeutics in minutes.',
    stars: 418,
    team: ['Dr. Ananya Roy', 'Tatsuki Sato'],
    tech: ['PyTorch', 'AlphaFold API', 'Next.js', 'FastAPI'],
    architecture: 'FASTA Ingestion -> MSA Alignment Worker -> Neural Folding Transformer -> 3D WebGL Renderer',
    demoUrl: 'https://demo.codecraft.dev/biosynthetix',
    githubUrl: 'https://github.com/codecraft-hackathon/biosynthetix',
    gradient: 'linear-gradient(135deg, #10b981 0%, #00f5a0 100%)',
    metrics: { 'Resolution': '1.8 Å', 'Screening Speed': '10x Faster', 'Confidence Score': '94.2 pLDDT' }
  },
  {
    id: 'cloudpulse',
    title: 'CloudPulse Telemetry',
    category: 'fullstack',
    categoryLabel: 'Full-Stack',
    summary: 'Kernel-level distributed tracing for Kubernetes clusters using eBPF probes with automated root-cause detection.',
    stars: 375,
    team: ['Carlos Mendes', 'Hannah Fischer'],
    tech: ['Go', 'eBPF', 'ClickHouse', 'Tailwind', 'Svelte'],
    architecture: 'Linux Kernel eBPF -> RingBuffer Ingest -> ClickHouse OLAP -> Real-time Topology Graph',
    demoUrl: 'https://demo.codecraft.dev/cloudpulse',
    githubUrl: 'https://github.com/codecraft-hackathon/cloudpulse-telemetry',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
    metrics: { 'Overhead': '< 0.5% CPU', 'Trace Rate': '2.5M ops/s', 'Resolution': 'Microsecond' }
  },
  {
    id: 'zerotrust',
    title: 'ZeroTrust Multi-Sig Vault',
    category: 'web3',
    categoryLabel: 'Web3',
    summary: 'Threshold signature cryptographic vault allowing distributed key-shares across enclave containers without exposure.',
    stars: 298,
    team: ['Alexandre Dupont', 'Mei-Ling Zhou', 'Zara Noor'],
    tech: ['Rust', 'Wasm', 'WebAuthn', 'Passkeys'],
    architecture: 'Client Secure Enclave -> Shamir 3-of-5 Splitter -> Distributed Quorum Node -> Instant Settlement',
    demoUrl: 'https://demo.codecraft.dev/zerotrust',
    githubUrl: 'https://github.com/codecraft-hackathon/zerotrust-vault',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    metrics: { 'Security': 'MPC 3-of-5', 'Passkey Auth': 'FIDO2 Level 3', 'Setup Time': '12 sec' }
  }
];

let activeFilter = 'all';
let searchQuery = '';

function initShowcaseGallery() {
  const gridContainer = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('gallery-search');
  const modal = document.getElementById('project-detail-modal');
  const closeModalBtn = document.getElementById('project-modal-close');

  if (!gridContainer) return;

  function renderProjects() {
    gridContainer.innerHTML = '';

    const filtered = ShowcaseProjects.filter(project => {
      const matchesCat = activeFilter === 'all' || project.category === activeFilter;
      const matchesSearch = project.title.toLowerCase().includes(searchQuery) ||
                            project.summary.toLowerCase().includes(searchQuery) ||
                            project.tech.some(t => t.toLowerCase().includes(searchQuery));
      return matchesCat && matchesSearch;
    });

    if (filtered.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <p style="font-size: 1.25rem; margin-bottom: 0.5rem;">No hackathon projects found matching criteria.</p>
          <button class="btn btn-secondary btn-sm" id="reset-filters-btn">Clear Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          activeFilter = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          filterBtns.forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
          renderProjects();
        });
      }
      return;
    }

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `
        <div class="project-card-header" style="background: ${project.gradient};">
          <svg viewBox="0 0 400 200" preserveAspectRatio="none" style="opacity: 0.25; mix-blend-mode: overlay;">
            <polygon points="0,0 400,200 400,0" fill="#ffffff"></polygon>
            <polygon points="0,150 200,200 0,200" fill="#000000"></polygon>
          </svg>
          <span class="project-cat-badge">${project.categoryLabel}</span>
          <span class="project-stars-badge">★ ${project.stars}</span>
        </div>
        <div class="project-card-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-summary">${project.summary}</p>
          <div class="project-tags">
            ${project.tech.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-card-footer">
            <div class="team-members">
              ${project.team.map(m => `<div class="avatar-bubble" title="${m}">${m[0]}</div>`).join('')}
            </div>
            <span>${project.team.length} Builders</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        openProjectModal(project);
        if (typeof SoundFX !== 'undefined') SoundFX.playClick();
      });

      gridContainer.appendChild(card);
    });
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.category || 'all';
      renderProjects();
      if (typeof SoundFX !== 'undefined') SoundFX.playClick();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProjects();
    });
  }

  // Project Modal
  function openProjectModal(project) {
    if (!modal) return;
    const titleEl = document.getElementById('modal-project-title');
    const badgeEl = document.getElementById('modal-project-badge');
    const descEl = document.getElementById('modal-project-desc');
    const archEl = document.getElementById('modal-project-arch');
    const techEl = document.getElementById('modal-project-tech');
    const teamEl = document.getElementById('modal-project-team');
    const metricsEl = document.getElementById('modal-project-metrics');

    if (titleEl) titleEl.textContent = project.title;
    if (badgeEl) badgeEl.textContent = project.categoryLabel;
    if (descEl) descEl.textContent = project.summary;
    if (archEl) archEl.textContent = project.architecture;

    if (techEl) {
      techEl.innerHTML = project.tech.map(t => `<span class="bp-tag">${t}</span>`).join(' ');
    }

    if (teamEl) {
      teamEl.innerHTML = project.team.map(t => `<span style="background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem;">👤 ${t}</span>`).join(' ');
    }

    if (metricsEl) {
      metricsEl.innerHTML = Object.entries(project.metrics).map(([k, v]) => `
        <div class="bp-card">
          <div class="bp-label">${k}</div>
          <div class="bp-val" style="color: var(--primary-accent);">${v}</div>
        </div>
      `).join('');
    }

    modal.classList.add('open');
  }

  function closeModal() {
    if (modal) modal.classList.remove('open');
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Initial render
  renderProjects();
}

document.addEventListener('DOMContentLoaded', initShowcaseGallery);
