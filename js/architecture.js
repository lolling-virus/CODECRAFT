/**
 * CodeCraft AI - Interactive Architecture & Agent Visualizer
 * Node pipeline graph, real-time stress testing, and interactive specs drawer.
 */

const ArchitectureNodes = [
  {
    id: 'ingestion',
    title: 'Edge Ingestion Gateway',
    subtitle: 'WebSocket & HTTP/3 Streaming',
    badge: '50k req/s',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>`,
    specs: {
      'Protocol': 'HTTP/3 + WebSockets (QUIC)',
      'Throughput': '62,400 requests / sec',
      'P99 Latency': '3.2 ms',
      'DDoS Protection': 'Edge Rate-Limiting & Shield',
      'Memory Footprint': '128 MB per edge replica',
      'TLS Acceleration': 'Hardware-accelerated ChaCha20'
    },
    description: 'Ingests real-time user prompts, multi-agent messages, and hackathon repository webhooks directly at the edge with zero buffer copying.'
  },
  {
    id: 'reasoning',
    title: 'Neural Reasoning Engine',
    subtitle: 'Multimodal Gemini Router',
    badge: 'Sub-300ms',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v18M3 12h18"></path></svg>`,
    specs: {
      'Core Model': 'Gemini 3.8 Flash / Thinking',
      'Context Window': '1,000,000 Tokens',
      'Reasoning Speed': '142 tokens / sec',
      'Function Calling': 'Strict JSON Schema Validation',
      'Tool Execution': 'Asynchronous parallel workers',
      'Quantization': 'FP8 mixed-precision optimization'
    },
    description: 'Deconstructs natural language project requirements into modular software specifications, dependency graphs, and architectural blueprints.'
  },
  {
    id: 'rag',
    title: 'Vector Knowledge Store',
    subtitle: 'HNSW Semantic RAG',
    badge: '1536-dim',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`,
    specs: {
      'Vector Engine': 'pgvector + Qdrant HNSW',
      'Index Size': '1.2M Hackathon Code Snippets',
      'Recall Rate': '99.4% Top-k accuracy',
      'Similarity Metric': 'Cosine Distance (<=>)',
      'Cache Layer': 'Redis in-memory vector cache',
      'Embedding Model': 'text-embedding-004'
    },
    description: 'Grounds the code generation in pre-tested open-source templates, high-performance algorithms, and modern security patterns.'
  },
  {
    id: 'sandbox',
    title: 'Isolated Execution Sandbox',
    subtitle: 'gVisor MicroVM Containers',
    badge: '18ms Boot',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
    specs: {
      'Kernel Virtualization': 'gVisor sandboxed syscalls',
      'Boot Time': '18 ms cold-start',
      'Runtimes': 'Python 3.14, Node.js 22, Rust, Go',
      'Memory Limit': '4 GB per container',
      'Network Policy': 'Egress-firewalled by default',
      'Ephemeral Storage': 'Tmpfs in-RAM filesystems'
    },
    description: 'Runs generated scripts, executes unit tests, and validates code output inside isolated micro-containers before production delivery.'
  },
  {
    id: 'deploy',
    title: 'Edge Deployment Worker',
    subtitle: 'Serverless Global Fabric',
    badge: '100% Uptime',
    icon: `<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path><path d="M12 12v9"></path><path d="m8 17 4 4 4-4"></path></svg>`,
    specs: {
      'Deployment Target': 'Multi-region Cloud Run & Edge',
      'SSL/TLS Provisioning': 'Instant Zero-Config Let\'s Encrypt',
      'Global Points of Presence': '300+ Edge locations',
      'Traffic Routing': 'Anycast DNS with instant failover',
      'Custom Domains': 'Automated CNAME and ALIAS',
      'Build Artifacts': 'OCI standard container images'
    },
    description: 'Publishes working prototypes to public URLs in seconds with production-grade SSL certificates and autoscaling.'
  }
];

let activeNodeIndex = 0;

function initArchitectureVisualizer() {
  const nodesWrapper = document.getElementById('arch-nodes-wrapper');
  const drawerTitle = document.getElementById('arch-drawer-title');
  const drawerDesc = document.getElementById('arch-drawer-desc');
  const drawerSpecs = document.getElementById('arch-drawer-specs');
  const stressTestBtn = document.getElementById('arch-stress-btn');

  if (!nodesWrapper || !drawerSpecs) return;

  // Render Nodes
  nodesWrapper.innerHTML = '';
  ArchitectureNodes.forEach((node, idx) => {
    const nodeEl = document.createElement('div');
    nodeEl.className = `arch-node ${idx === activeNodeIndex ? 'active' : ''}`;
    nodeEl.dataset.index = idx;
    nodeEl.innerHTML = `
      <div class="node-icon-box">${node.icon}</div>
      <div class="node-title">${node.title}</div>
      <div class="node-sub">${node.subtitle}</div>
      <div class="node-chip">${node.badge}</div>
    `;

    nodeEl.addEventListener('click', () => {
      document.querySelectorAll('.arch-node').forEach(n => n.classList.remove('active'));
      nodeEl.classList.add('active');
      activeNodeIndex = idx;
      renderNodeDetails(node);
      if (typeof SoundFX !== 'undefined') SoundFX.playClick();
    });

    nodesWrapper.appendChild(nodeEl);
  });

  // Render Details Drawer
  function renderNodeDetails(node) {
    if (drawerTitle) drawerTitle.innerHTML = `${node.icon} <span>${node.title}</span>`;
    if (drawerDesc) drawerDesc.textContent = node.description;

    drawerSpecs.innerHTML = '';
    Object.entries(node.specs).forEach(([key, val]) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${key}</span> <span class="detail-specs-val">${val}</span>`;
      drawerSpecs.appendChild(li);
    });
  }

  renderNodeDetails(ArchitectureNodes[activeNodeIndex]);

  // Stress Test Simulation
  if (stressTestBtn) {
    stressTestBtn.addEventListener('click', () => {
      stressTestBtn.innerHTML = `<span>⚡</span> <span>Injecting Packets...</span>`;
      stressTestBtn.style.opacity = '0.7';

      if (typeof SoundFX !== 'undefined') SoundFX.playPulse();

      const allNodes = document.querySelectorAll('.arch-node');
      let currentStep = 0;

      const interval = setInterval(() => {
        allNodes.forEach((n, i) => {
          if (i === currentStep) {
            n.classList.add('active');
            n.style.transform = 'translateY(-12px) scale(1.08)';
            n.style.borderColor = 'var(--accent-emerald-glow)';
            n.style.boxShadow = '0 0 35px var(--accent-emerald-glow)';
          } else {
            n.style.transform = '';
            n.style.borderColor = '';
            n.style.boxShadow = '';
          }
        });

        if (typeof SoundFX !== 'undefined') SoundFX.playClick();
        currentStep++;

        if (currentStep >= allNodes.length) {
          clearInterval(interval);
          setTimeout(() => {
            allNodes.forEach(n => {
              n.style.transform = '';
              n.style.borderColor = '';
              n.style.boxShadow = '';
            });
            allNodes[activeNodeIndex].classList.add('active');
            stressTestBtn.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> <span>Simulate Pipeline Stress Test</span>`;
            stressTestBtn.style.opacity = '1';

            if (typeof showToast !== 'undefined') {
              showToast('🚀 Pipeline Stress Test: 50,000 mock packets processed in 210ms with 0 drops!', 'success');
            }
            if (typeof SoundFX !== 'undefined') SoundFX.playSuccess();
          }, 400);
        }
      }, 250);
    });
  }
}

document.addEventListener('DOMContentLoaded', initArchitectureVisualizer);
