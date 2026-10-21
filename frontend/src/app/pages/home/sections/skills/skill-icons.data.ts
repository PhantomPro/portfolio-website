/**
 * High-definition SVG icons for all portfolio skills.
 * Provides custom neural SVG icons for AI concepts and official SVGs for dev tools.
 */

const encodeSvg = (svg: string): string => 'data:image/svg+xml;utf8,' + encodeURIComponent(svg.trim());

// ─── AI & ENGINEERING CUSTOM NEURAL SVGS ────────────────────────────────────

/** LLM-Powered Apps: Glowing Neural Brain with synapse connections */
export const SVG_LLM_APPS = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="llmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#A855F7"/>
      <stop offset="50%" stop-color="#7C6FF7"/>
      <stop offset="100%" stop-color="#22D3EE"/>
    </linearGradient>
    <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <!-- Background subtle halo -->
  <circle cx="24" cy="24" r="20" fill="url(#llmGrad)" fill-opacity="0.12"/>
  <!-- Neural Brain Contours -->
  <path d="M18 14C15.2 14 13 16.2 13 19C13 19.8 13.2 20.6 13.6 21.2C12.1 22.3 11 24.1 11 26.2C11 29 13.2 31.2 16 31.4V34C16 35.1 16.9 36 18 36H23V14H18Z" stroke="url(#llmGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M30 14C32.8 14 35 16.2 35 19C35 19.8 34.8 20.6 34.4 21.2C35.9 22.3 37 24.1 37 26.2C37 29 34.8 31.2 32 31.4V34C32 35.1 31.1 36 30 36H25V14H30Z" stroke="url(#llmGrad)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- Synapse Nodes & Interconnects -->
  <line x1="18" y1="20" x2="23" y2="22" stroke="#22D3EE" stroke-width="1.8" stroke-dasharray="1 2"/>
  <line x1="30" y1="20" x2="25" y2="22" stroke="#22D3EE" stroke-width="1.8" stroke-dasharray="1 2"/>
  <line x1="18" y1="28" x2="23" y2="26" stroke="#A855F7" stroke-width="1.8"/>
  <line x1="30" y1="28" x2="25" y2="26" stroke="#A855F7" stroke-width="1.8"/>
  <circle cx="18" cy="20" r="2" fill="#22D3EE" filter="url(#glow1)"/>
  <circle cx="30" cy="20" r="2" fill="#22D3EE" filter="url(#glow1)"/>
  <circle cx="24" cy="24" r="2.5" fill="#FFFFFF"/>
  <circle cx="18" cy="28" r="2" fill="#A855F7"/>
  <circle cx="30" cy="28" r="2" fill="#A855F7"/>
</svg>
`);

/** Prompt Engineering: Generative Terminal + AI Sparkles */
export const SVG_PROMPT_ENG = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="peGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F43F5E"/>
      <stop offset="50%" stop-color="#FB7185"/>
      <stop offset="100%" stop-color="#FDA4AF"/>
    </linearGradient>
    <linearGradient id="termGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
  </defs>
  <!-- Terminal Screen -->
  <rect x="8" y="10" width="32" height="26" rx="6" fill="#131322" stroke="url(#termGrad)" stroke-width="2"/>
  <circle cx="14" cy="16" r="1.5" fill="#EF4444"/>
  <circle cx="19" cy="16" r="1.5" fill="#F59E0B"/>
  <circle cx="24" cy="16" r="1.5" fill="#10B981"/>
  <!-- Command Prompt prompt arrow >_ -->
  <path d="M14 24L19 28L14 32" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="22" y1="32" x2="28" y2="32" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
  <!-- Sparkling AI Magic Wand Stars -->
  <path d="M34 14L35.2 17.5L38.7 18.7L35.2 19.9L34 23.4L32.8 19.9L29.3 18.7L32.8 17.5Z" fill="url(#peGrad)"/>
  <path d="M28 8L28.8 10.3L31.1 11.1L28.8 11.9L28 14.2L27.2 11.9L24.9 11.1L27.2 10.3Z" fill="#FDE047"/>
</svg>
`);

/** Tool Integration: Interlocking Function Calling & Plug Connectors */
export const SVG_TOOL_INTEGRATION = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="toolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="50%" stop-color="#06B6D4"/>
      <stop offset="100%" stop-color="#10B981"/>
    </linearGradient>
  </defs>
  <!-- Center hub -->
  <rect x="18" y="18" width="12" height="12" rx="3" fill="#1E293B" stroke="url(#toolGrad)" stroke-width="2"/>
  <!-- Connectors / Sockets -->
  <path d="M24 10V18M24 30V38M10 24H18M30 24H38" stroke="url(#toolGrad)" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="24" cy="9" r="3" fill="#3B82F6"/>
  <circle cx="24" cy="39" r="3" fill="#10B981"/>
  <circle cx="9" cy="24" r="3" fill="#06B6D4"/>
  <circle cx="39" cy="24" r="3" fill="#8B5CF6"/>
  <!-- Core chip icon inside -->
  <circle cx="24" cy="24" r="2.5" fill="#FFFFFF"/>
</svg>
`);

/** OpenAI API: Official Geometrical Rosette Logo */
export const SVG_OPENAI = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="oaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10A37F"/>
      <stop offset="100%" stop-color="#2DD4BF"/>
    </linearGradient>
  </defs>
  <circle cx="24" cy="24" r="21" fill="#10A37F" fill-opacity="0.12"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M36.7 21.6C36.3 18.2 33.7 15.6 30.3 15.2C29.7 13.2 28.1 11.6 26.1 11C23.2 10.1 20.1 11.2 18.3 13.5C16.6 13.3 14.8 14.1 13.7 15.5C12.2 17.5 12.1 20.2 13.4 22.3C12.4 23.9 12.4 26 13.4 27.6C12.5 30.6 13.8 33.8 16.5 35.2C17.7 35.8 19 36 20.3 35.8C21.4 37.5 23.3 38.5 25.4 38.4C28.2 38.3 30.6 36.4 31.5 33.7C33 33.7 34.4 32.9 35.3 31.6C36.8 29.5 36.8 26.6 35.3 24.5C36.3 23.7 36.8 22.6 36.7 21.6ZM24 21.2C25.5 21.2 26.8 22.5 26.8 24C26.8 25.5 25.5 26.8 24 26.8C22.5 26.8 21.2 25.5 21.2 24C21.2 22.5 22.5 21.2 24 21.2Z" fill="url(#oaGrad)"/>
</svg>
`);

/** Knowledge Bases: Vector Database & RAG Cluster */
export const SVG_KNOWLEDGE_BASES = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="kbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B5CF6"/>
      <stop offset="50%" stop-color="#EC4899"/>
      <stop offset="100%" stop-color="#F43F5E"/>
    </linearGradient>
  </defs>
  <!-- Cylindrical Stack Layers -->
  <!-- Top disc -->
  <ellipse cx="24" cy="14" rx="14" ry="5" fill="#2E1065" stroke="url(#kbGrad)" stroke-width="2"/>
  <!-- Middle disc -->
  <path d="M10 14V22C10 24.8 16.3 27 24 27C31.7 27 38 24.8 38 22V14" stroke="url(#kbGrad)" stroke-width="2"/>
  <!-- Bottom disc -->
  <path d="M10 22V30C10 32.8 16.3 35 24 35C31.7 35 38 32.8 38 30V22" stroke="url(#kbGrad)" stroke-width="2"/>
  <!-- Semantic Vector cluster dots -->
  <circle cx="20" cy="14" r="1.5" fill="#38BDF8"/>
  <circle cx="28" cy="14" r="1.5" fill="#F43F5E"/>
  <circle cx="24" cy="22" r="1.5" fill="#FDE047"/>
  <circle cx="17" cy="22" r="1.2" fill="#38BDF8"/>
  <circle cx="31" cy="22" r="1.2" fill="#A855F7"/>
  <circle cx="24" cy="30" r="1.5" fill="#34D399"/>
</svg>
`);

/** AI Agents: Autonomous Cybernetic Bot Entity */
export const SVG_AI_AGENTS = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="agentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06B6D4"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <!-- Antenna -->
  <line x1="24" y1="7" x2="24" y2="12" stroke="#06B6D4" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="24" cy="6" r="2.5" fill="#06B6D4"/>
  <!-- Head outline -->
  <rect x="10" y="12" width="28" height="24" rx="8" fill="#0F172A" stroke="url(#agentGrad)" stroke-width="2.2"/>
  <!-- Visor / Eyes -->
  <rect x="15" y="18" width="18" height="7" rx="3.5" fill="#1E293B" stroke="#06B6D4" stroke-width="1.5"/>
  <circle cx="19" cy="21.5" r="2" fill="#22D3EE"/>
  <circle cx="29" cy="21.5" r="2" fill="#22D3EE"/>
  <!-- Mouth / Speech pulse line -->
  <path d="M18 29H30" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round"/>
  <!-- Ear nodes -->
  <rect x="6" y="20" width="4" height="8" rx="2" fill="#3B82F6"/>
  <rect x="38" y="20" width="4" height="8" rx="2" fill="#3B82F6"/>
</svg>
`);

/** REST APIs: Gateway and Cloud Endpoints */
export const SVG_REST_APIS = encodeSvg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <defs>
    <linearGradient id="apiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
  </defs>
  <rect x="8" y="14" width="32" height="20" rx="6" fill="#0F172A" stroke="url(#apiGrad)" stroke-width="2"/>
  <!-- Code brackets -->
  <path d="M16 21L13 24L16 27M32 21L35 24L32 27M26 19L22 29" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- HTTP transfer pills -->
  <circle cx="12" cy="9" r="2" fill="#10B981"/>
  <line x1="12" y1="9" x2="12" y2="14" stroke="#10B981" stroke-width="1.5"/>
  <circle cx="36" cy="39" r="2" fill="#F59E0B"/>
  <line x1="36" y1="34" x2="36" y2="39" stroke="#F59E0B" stroke-width="1.5"/>
</svg>
`);

// ─── MASTER ICON MAPPER ─────────────────────────────────────────────────────

export const SKILL_ICONS_MAP: { [key: string]: string } = {
  // AI & Engineering
  ai: SVG_LLM_APPS,
  llmpoweredapps: SVG_LLM_APPS,
  prompt: SVG_PROMPT_ENG,
  promptengineering: SVG_PROMPT_ENG,
  tools: SVG_TOOL_INTEGRATION,
  toolintegration: SVG_TOOL_INTEGRATION,
  openai: SVG_OPENAI,
  openaiapi: SVG_OPENAI,
  database: SVG_KNOWLEDGE_BASES,
  knowledgebases: SVG_KNOWLEDGE_BASES,
  agent: SVG_AI_AGENTS,
  aiagents: SVG_AI_AGENTS,

  // Frontend
  react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  reactjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
  typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  tailwindcss: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  mui: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
  materialui: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg',
  html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  html5css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  bootstrap: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',

  // Backend
  nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  express: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  expressjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  fastapi: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  graphql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  apollo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/networkx/networkx-original.svg',
  apolloserver: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/networkx/networkx-original.svg',
  api: SVG_REST_APIS,
  restapis: SVG_REST_APIS,
  cplusplus: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',
  c: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg',

  // Database
  postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  mysql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',

  // Tools & DevOps
  vscode: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  vscodeextensionapi: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  github: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  gitgithub: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  postman: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
  vite: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
  jest: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',
  docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  playwright: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/playwright/playwright-original.svg',
};
