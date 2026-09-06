/**
 * CodeCraft AI - Interactive Studio Playground
 * Multi-file code editor, AI refactoring engine, compilation simulation, and live preview.
 */

const StudioFiles = {
  'agent_pipeline.py': {
    lang: 'python',
    code: `import asyncio
from codecraft.agents import AutonomousAgent, ToolRegistry
from codecraft.memory import VectorMemoryStore

# Initialize Hackathon Multimodal Agent
tools = ToolRegistry()
memory = VectorMemoryStore(collection="hackathon_kb", dimensions=1536)

agent = AutonomousAgent(
    name="CodeCraft-Architect-v4",
    system_instruction="You are an elite software architect for Hackathon CodeCraft.",
    tools=tools,
    memory=memory,
    temperature=0.2
)

@agent.task(trigger="on_user_spec")
async def orchestrate_solution(spec: dict) -> dict:
    """Analyze prompt, generate architecture nodes, and synthesize code."""
    context = await memory.similarity_search(spec["query"], top_k=5)
    plan = await agent.reason_and_plan(spec, grounding=context)
    
    # Execute sandboxed code synthesis
    result = await agent.tools.execute_sandbox(
        runtime="python3.14",
        source=plan.generated_code
    )
    return {"status": "deployed", "latency_ms": 18, "build_id": result.id}`
  },

  'stream_router.ts': {
    lang: 'typescript',
    code: `import { createEdgeServer, WebSocketGateway } from '@codecraft/edge';

export interface RoutePacket {
  sessionId: string;
  payload: string;
  timestamp: number;
}

const gateway = new WebSocketGateway({
  port: 8080,
  maxConnections: 50000,
  enableHeartbeat: true
});

gateway.onConnection((socket) => {
  socket.on('telemetry', async (packet: RoutePacket) => {
    // Zero-copy stream ingestion to AI pipeline
    const latency = Date.now() - packet.timestamp;
    await socket.emit('ack', { received: true, latency });
  });
});

console.log('🚀 Edge Stream Router operational on :8080');`
  },

  'schema_rag.sql': {
    lang: 'sql',
    code: `-- Vector RAG Database Schema for Hackathon CodeCraft
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS project_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fast Approximate Nearest Neighbor Index (HNSW)
CREATE INDEX IF NOT EXISTS idx_project_embeddings_hnsw 
ON project_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Query top-5 most relevant architectural references
SELECT id, project_name, 1 - (embedding <=> $1) AS similarity
FROM project_embeddings
ORDER BY embedding <=> $1 ASC
LIMIT 5;`
  },

  'deploy_config.yaml': {
    lang: 'yaml',
    code: `apiVersion: codecraft.io/v1alpha1
kind: HackathonCluster
metadata:
  name: codecraft-prod-cluster
  region: us-central1
spec:
  replicas: 4
  autoscaling:
    minReplicas: 2
    maxReplicas: 16
    targetCPUUtilization: 75%
  sandbox:
    isolation: gVisor
    memoryLimit: "4Gi"
    cpuLimit: "2.0"
  integrations:
    - gemini-flash-thinking
    - edge-websocket-gateway
    - pgvector-cluster`
  }
};

let currentActiveFile = 'agent_pipeline.py';
let isRunningCode = false;

function initStudioPlayground() {
  const tabsContainer = document.getElementById('studio-tabs-container');
  const codeContainer = document.getElementById('studio-code-display');
  const lineNumbers = document.getElementById('studio-line-numbers');
  const runBtn = document.getElementById('studio-run-btn');
  const refactorInput = document.getElementById('studio-refactor-input');
  const refactorBtn = document.getElementById('studio-refactor-btn');
  const previewTabBtns = document.querySelectorAll('.preview-tab-btn');
  const previewSections = document.querySelectorAll('.preview-tab-content');

  if (!tabsContainer || !codeContainer) return;

  // Render Tabs
  tabsContainer.innerHTML = '';
  Object.keys(StudioFiles).forEach((filename) => {
    const tab = document.createElement('button');
    tab.className = `studio-tab ${filename === currentActiveFile ? 'active' : ''}`;
    tab.dataset.filename = filename;
    tab.innerHTML = `
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      <span>${filename}</span>
    `;
    tab.addEventListener('click', () => {
      document.querySelectorAll('.studio-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentActiveFile = filename;
      loadFileContent(filename);
      if (typeof SoundFX !== 'undefined') SoundFX.playClick();
    });
    tabsContainer.appendChild(tab);
  });

  function loadFileContent(filename) {
    const file = StudioFiles[filename];
    if (!file) return;

    // Highlight code syntax
    codeContainer.innerHTML = formatSyntax(file.code, file.lang);
    
    // Update line numbers
    const lines = file.code.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
  }

  // Syntax Formatter
  function formatSyntax(code, lang) {
    let escaped = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    if (lang === 'python') {
      escaped = escaped
        .replace(/\b(import|from|def|async|await|return|if|else|class)\b/g, '<span class="syn-kw">$1</span>')
        .replace(/#.*$/gm, '<span class="syn-comm">$&</span>')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="syn-str">$&</span>')
        .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="syn-fn">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="syn-num">$1</span>');
    } else if (lang === 'typescript') {
      escaped = escaped
        .replace(/\b(import|from|export|interface|const|let|async|await|return|new)\b/g, '<span class="syn-kw">$1</span>')
        .replace(/\/\/.+$/gm, '<span class="syn-comm">$&</span>')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="syn-str">$&</span>')
        .replace(/\b(string|number|boolean|void|any)\b/g, '<span class="syn-type">$1</span>')
        .replace(/\b([a-zA-Z_]\w*)(?=\()/g, '<span class="syn-fn">$1</span>');
    } else if (lang === 'sql') {
      escaped = escaped
        .replace(/\b(CREATE|EXTENSION|TABLE|IF|NOT|EXISTS|PRIMARY|KEY|DEFAULT|INDEX|ON|USING|WITH|SELECT|FROM|ORDER|BY|ASC|LIMIT)\b/g, '<span class="syn-kw">$1</span>')
        .replace(/--.*$/gm, '<span class="syn-comm">$&</span>')
        .replace(/\b(UUID|VARCHAR|JSONB|TIMESTAMP|vector)\b/g, '<span class="syn-type">$1</span>');
    } else if (lang === 'yaml') {
      escaped = escaped
        .replace(/^(\s*[\w-]+:)/gm, '<span class="syn-var">$1</span>')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span class="syn-str">$&</span>');
    }

    return escaped;
  }

  // Initial render
  loadFileContent(currentActiveFile);

  // Run Code Simulation
  if (runBtn) {
    runBtn.addEventListener('click', () => {
      if (isRunningCode) return;
      isRunningCode = true;
      runBtn.innerHTML = `<span>⏳</span> <span>Compiling...</span>`;
      runBtn.style.opacity = '0.7';

      if (typeof SoundFX !== 'undefined') SoundFX.playPulse();

      const consoleContent = document.getElementById('studio-console-content');
      if (consoleContent) {
        consoleContent.innerHTML = `
          <div class="console-entry"><span class="console-time">[00:00.01]</span> <span class="terminal-log-info">Initiating gVisor container sandbox for ${currentActiveFile}...</span></div>
          <div class="console-entry"><span class="console-time">[00:00.08]</span> <span class="terminal-log-info">Resolving neural dependencies & model endpoints...</span></div>
        `;
      }

      setTimeout(() => {
        if (consoleContent) {
          consoleContent.innerHTML += `
            <div class="console-entry"><span class="console-time">[00:00.22]</span> <span class="terminal-log-success">✓ Code parsed with 0 syntax errors. LLM reasoning pipeline armed.</span></div>
            <div class="console-entry"><span class="console-time">[00:00.34]</span> <span class="terminal-log-accent">⚡ Vector dimension match verified: 1536 cosine similarity.</span></div>
            <div class="console-entry"><span class="console-time">[00:00.41]</span> <span class="terminal-log-success">✓ Service deployed to edge endpoints (p99 latency: 14.2ms).</span></div>
          `;
          consoleContent.scrollTop = consoleContent.scrollHeight;
        }

        // Update live preview metrics
        const metricLatency = document.getElementById('sim-metric-latency');
        const metricTokens = document.getElementById('sim-metric-tokens');
        const metricCost = document.getElementById('sim-metric-cost');
        if (metricLatency) metricLatency.textContent = `${(Math.random() * 8 + 12).toFixed(1)} ms`;
        if (metricTokens) metricTokens.textContent = `${Math.floor(Math.random() * 400 + 1200)} tok/s`;
        if (metricCost) metricCost.textContent = `$0.000${Math.floor(Math.random() * 5 + 1)}`;

        // Switch to preview tab automatically
        switchPreviewTab('app');

        runBtn.innerHTML = `<svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg> <span>Run Code</span>`;
        runBtn.style.opacity = '1';
        isRunningCode = false;

        if (typeof showToast !== 'undefined') {
          showToast(`⚡ Build Succeeded: ${currentActiveFile} deployed successfully!`, 'success');
        }
        if (typeof SoundFX !== 'undefined') SoundFX.playSuccess();
      }, 1000);
    });
  }

  // Refactor input handler
  function triggerRefactor(instruction) {
    if (!instruction) return;
    if (typeof showToast !== 'undefined') {
      showToast(`🤖 AI Refactoring: "${instruction}"`, 'info');
    }
    if (typeof SoundFX !== 'undefined') SoundFX.playPulse();

    // Simulated transformation on active file
    const file = StudioFiles[currentActiveFile];
    if (file) {
      file.code = `# [AI Refactored: ${instruction}]\n` + file.code + `\n\n# Verified & Auto-Optimized by CodeCraft Engine\n`;
      loadFileContent(currentActiveFile);
    }
  }

  if (refactorBtn && refactorInput) {
    refactorBtn.addEventListener('click', () => {
      const val = refactorInput.value.trim();
      if (val) {
        triggerRefactor(val);
        refactorInput.value = '';
      }
    });

    refactorInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = refactorInput.value.trim();
        if (val) {
          triggerRefactor(val);
          refactorInput.value = '';
        }
      }
    });
  }

  // Quick chips for refactor
  const quickRefactorChips = document.querySelectorAll('.refactor-quick-chip');
  quickRefactorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      triggerRefactor(chip.textContent.trim());
    });
  });

  // Preview Tabs switcher
  function switchPreviewTab(tabId) {
    previewTabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    previewSections.forEach(sec => {
      sec.style.display = sec.id === `preview-${tabId}` ? 'block' : 'none';
    });
  }

  previewTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchPreviewTab(btn.dataset.tab);
      if (typeof SoundFX !== 'undefined') SoundFX.playClick();
    });
  });
}

document.addEventListener('DOMContentLoaded', initStudioPlayground);
