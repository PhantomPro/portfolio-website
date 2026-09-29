import { Profile, Achievement } from '../models/profile.model';
import { Experience } from '../models/experience.model';
import { Project } from '../models/project.model';
import { Skill } from '../models/skill.model';

export const FALLBACK_PROFILE: Profile = {
  _id: 'profile_1',
  name: 'Tanmay Basu',
  role: 'Full Stack Developer',
  tagline: 'Full Stack Developer & Associate Engineer at Ascendion | AI-Powered Tooling • Modern Web Apps',
  bio: 'Full Stack Developer and Associate Engineer at Ascendion in Hyderabad, India with hands-on experience in frontend engineering, backend services, API integration, and AI-powered developer tooling. Skilled in building user interfaces, reusable components, REST & GraphQL integrations, and full-stack applications using React, Angular, TypeScript, JavaScript, Node.js, Python/FastAPI, and databases. Experienced in troubleshooting client issues and delivering validated UI fixes across environments.',
  shortBio:
    'Full Stack Developer at Ascendion building AI-powered developer tools, scalable web applications, and modern design systems across React, Angular, Node.js, and Python.',
  email: 'basutanmay.007@gmail.com',
  phone: '+91 7607005541',
  location: 'Hyderabad, India',
  linkedin: 'https://www.linkedin.com/in/tanmay-basu-9310b01a1/',
  github: 'https://github.com/PhantomPro',
  resumeUrl: '#',
  education: [
    {
      degree: 'Bachelor of Technology in Computer Science and Engineering',
      institution: 'Vellore Institute of Technology (VIT), Bhopal',
      year: '2021 - 2025',
      gpa: '8.0 / 10',
    },
    {
      degree: 'Higher Secondary Certificate',
      institution: 'Kendriya Vidyalaya, Kanpur',
      year: '2019 - 2020',
      gpa: '7.0 / 10',
    },
  ],
  interests: [
    'AI-Powered Developer Tooling',
    'Full-Stack Architecture',
    'GraphQL & REST APIs',
    'Design Systems & UI Engineering',
    'Competitive Programming',
  ],
  currentRole: 'Full Stack Developer @ Ascendion',
  yearsOfExperience: 1,
};

export const FALLBACK_SKILLS: Skill[] = [
  // AI & Engineering
  { _id: 's_ai1', name: 'LLM-Powered Apps', category: 'ai', icon: 'ai', order: 1 },
  { _id: 's_ai2', name: 'Prompt Engineering', category: 'ai', icon: 'prompt', order: 2 },
  { _id: 's_ai3', name: 'Tool Integration', category: 'ai', icon: 'tools', order: 3 },
  { _id: 's_ai4', name: 'OpenAI API', category: 'ai', icon: 'openai', order: 4 },
  { _id: 's_ai5', name: 'Knowledge Bases', category: 'ai', icon: 'database', order: 5 },
  { _id: 's_ai6', name: 'AI Agents', category: 'ai', icon: 'agent', order: 6 },
  // Frontend
  { _id: 's_fe1', name: 'React.js', category: 'frontend', icon: 'react', order: 1 },
  { _id: 's_fe2', name: 'Angular', category: 'frontend', icon: 'angular', order: 2 },
  { _id: 's_fe3', name: 'TypeScript', category: 'frontend', icon: 'typescript', order: 3 },
  { _id: 's_fe4', name: 'JavaScript', category: 'frontend', icon: 'javascript', order: 4 },
  { _id: 's_fe5', name: 'Tailwind CSS', category: 'frontend', icon: 'tailwind', order: 5 },
  { _id: 's_fe6', name: 'Material UI', category: 'frontend', icon: 'mui', order: 6 },
  { _id: 's_fe7', name: 'HTML5 / CSS3', category: 'frontend', icon: 'html5', order: 7 },
  { _id: 's_fe8', name: 'Bootstrap', category: 'frontend', icon: 'bootstrap', order: 8 },
  // Backend
  { _id: 's_be1', name: 'Node.js', category: 'backend', icon: 'nodejs', order: 1 },
  { _id: 's_be2', name: 'Express.js', category: 'backend', icon: 'express', order: 2 },
  { _id: 's_be3', name: 'Python', category: 'backend', icon: 'python', order: 3 },
  { _id: 's_be4', name: 'FastAPI', category: 'backend', icon: 'fastapi', order: 4 },
  { _id: 's_be5', name: 'GraphQL', category: 'backend', icon: 'graphql', order: 5 },
  { _id: 's_be6', name: 'Apollo Server', category: 'backend', icon: 'apollo', order: 6 },
  { _id: 's_be7', name: 'REST APIs', category: 'backend', icon: 'api', order: 7 },
  { _id: 's_be8', name: 'C++', category: 'backend', icon: 'cplusplus', order: 8 },
  // Database
  { _id: 's_db1', name: 'PostgreSQL', category: 'database', icon: 'postgresql', order: 1 },
  { _id: 's_db2', name: 'MongoDB', category: 'database', icon: 'mongodb', order: 2 },
  { _id: 's_db3', name: 'MySQL', category: 'database', icon: 'mysql', order: 3 },
  // Tools
  { _id: 's_tl1', name: 'VS Code Extension API', category: 'tools', icon: 'vscode', order: 1 },
  { _id: 's_tl2', name: 'Git & GitHub', category: 'tools', icon: 'github', order: 2 },
  { _id: 's_tl3', name: 'Postman', category: 'tools', icon: 'postman', order: 3 },
  { _id: 's_tl4', name: 'Vite', category: 'tools', icon: 'vite', order: 4 },
  { _id: 's_tl5', name: 'Jest', category: 'tools', icon: 'jest', order: 5 },
  { _id: 's_tl6', name: 'Docker', category: 'tools', icon: 'docker', order: 6 },
];

export const FALLBACK_EXPERIENCES: Experience[] = [
  {
    _id: 'exp_1',
    company: 'Ascendion',
    role: 'Associate Engineer — Backend & AI Plugin Development (VS Code AI Plugin)',
    startDate: '2025-06',
    endDate: undefined,
    current: true,
    location: 'Hyderabad, India',
    description:
      'Contributing to AI engineering initiatives at Ascendion, developing an interactive AI-powered VS Code extension that delivers a chatbot-style coding companion, backend microservices, and enterprise agent search workflows.',
    achievements: [
      'Contributing to a VS Code plugin that provides a chatbot-style coding experience directly in the editor',
      'Working on backend services, API integrations, chat workflows, and extension functionality',
      'Implemented a chat filter option to significantly improve conversation navigation and developer usability',
      'Integrated an enterprise API enabling users to search, discover, and invoke AI agents across the organization',
      'Engineered reliable cross-environment workflows and resilient prompt/context handling',
    ],
    technologies: ['TypeScript', 'Node.js', 'Python', 'FastAPI', 'VS Code API', 'AI/LLM', 'REST APIs'],
    companyUrl: 'https://ascendion.com/',
    order: 1,
  },
  {
    _id: 'exp_2',
    company: 'Ascendion',
    role: 'Frontend Developer — Experience Studio 2.5 (AAVA)',
    startDate: '2025-01',
    endDate: '2025-06',
    current: false,
    location: 'Hyderabad, India',
    description:
      'Developed enterprise workspace interfaces and implemented AAVA components for Ascendion’s generative AI Experience Studio platform and modular design system libraries.',
    achievements: [
      'Worked on frontend development, implementing AAVA components and critical UI enhancements for Experience Studio 2.5',
      'Contributed to the core Design System and Workspace using reusable components and consistent UI patterns',
      'Streamlined component reusability and maintained strict UI fidelity across responsive viewports',
    ],
    technologies: ['React.js', 'Angular', 'TypeScript', 'Design Systems', 'Reusable Components', 'CSS3'],
    companyUrl: 'https://ascendion.com/',
    order: 2,
  },
  {
    _id: 'exp_3',
    company: 'Ascendion',
    role: 'Frontend Developer — Client Solutions (HP Delta)',
    startDate: '2024-08',
    endDate: '2024-12',
    current: false,
    location: 'Hyderabad, India',
    description:
      'Frontend development, defect troubleshooting, and cross-environment stability for the HP Delta client platform under Ascendion.',
    achievements: [
      'Executed frontend development and deep troubleshooting for the HP Delta client platform',
      'Implemented targeted UI fixes and enhancements across the INT and SFI environments',
      'Validated fixes across affected environments to guarantee consistent, regression-free functionality',
    ],
    technologies: ['JavaScript', 'TypeScript', 'UI Debugging', 'INT & SFI Environments', 'Playwright'],
    companyUrl: 'https://ascendion.com/',
    order: 3,
  },
  {
    _id: 'exp_4',
    company: 'Academic & Research Projects — VIT Bhopal',
    role: 'Full Stack & AI Developer',
    startDate: '2021-09',
    endDate: '2025-06',
    current: false,
    location: 'Bhopal, India',
    description:
      'Engineered production-grade web applications, generative AI platforms, and algorithmic solutions.',
    achievements: [
      'Built AI Image Generator with React.js and OpenAI API, reducing API latency by 25% and load times by 35%',
      'Developed Stock Photo Gallery (Carbon Gallery) with Next.js, FastAPI, and PostgreSQL, improving page load speeds by 20%',
      'Created Project Graphite CSS generator tool, reducing data retrieval times by 20%',
      'Solved 350+ algorithmic problems across LeetCode & GeeksforGeeks with a 5-star rating in C++ on HackerRank',
    ],
    technologies: ['ReactJS', 'NextJS', 'NodeJS', 'FastAPI', 'Python', 'PostgreSQL', 'C++'],
    companyUrl: 'https://vitbhopal.ac.in/',
    order: 4,
  },
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    _id: 'proj_1',
    title: 'Insurance Management Application',
    description:
      'Full-stack enterprise application with JWT role-based access control, policies, automated claims pipeline, and Apollo GraphQL APIs.',
    longDescription:
      'A comprehensive enterprise-grade insurance lifecycle platform designed to modernize policy issuance, renewals, and claims processing. Built with Angular on the frontend and Node.js/Express with Apollo Server on the backend, it models complex insurance workflows with granular role-based permissions (Admin, Agent, Customer), automated claim verification pipelines, and transactional payment logs.',
    problem:
      'Traditional insurance systems suffer from fragmented communications between policyholders and adjusters, slow manual reviews, and legacy REST endpoints that over-fetch heavy nested policy hierarchies, causing 2–3s page load latencies on mobile devices.',
    solution:
      'Architected a unified full-stack solution utilizing Angular 17+ for responsive user workflows and an Apollo GraphQL server over MongoDB. Designed normalized GraphQL schemas allowing clients to query exact policy fields, enforced granular RBAC guarding sensitive claim records, and established automated state transitions for claim approvals and policy renewals.',
    architecture:
      'Modular 3-Tier Architecture: (1) Client: Angular 17 SPA with reactive forms, Apollo Client caching, and responsive SCSS design tokens. (2) API & Gateway: Node.js & Express server running Apollo Server 4, handling JWT auth, custom permission directives, and input validation schemas. (3) Database: MongoDB with Mongoose document modeling, supporting ACID transactions for policy purchases and claim payout states.',
    technologies: ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'GraphQL', 'Apollo Server', 'TypeScript', 'JWT Auth', 'Mongoose'],
    features: [
      'JWT-based authentication with granular Role-Based Access Control (RBAC) across Admin, Agent, and Customer portals',
      'End-to-end policy lifecycle management: automated quote generation, policy issuance, endorsement, and renewal triggers',
      'Interactive claims filing pipeline with multi-file receipt uploads, real-time status tracker, and adjuster review workbench',
      'Apollo GraphQL server with optimized resolvers, custom directives for authorization, and sub-second query execution',
      'Responsive policy comparison dashboard with dynamic deductible and premium calculation engine',
      'Comprehensive audit logging for every claim status change and approval action to maintain regulatory compliance',
    ],
    challenges: [
      'Designing a normalized GraphQL schema capable of handling deeply nested policy riders, multiple beneficiaries, and dynamic claim adjustments without circular references or N+1 query bottlenecks.',
      'Enforcing strict field-level and mutation-level authorization rules so policyholders can only query their own claims while adjusters can review assigned queues and admins retain platform-wide override capabilities.',
    ],
    learnings: [
      'Advanced GraphQL resolver composition, DataLoader batching patterns, and schema-first API design in Apollo Server.',
      'Complex reactive form state management, custom asynchronous validators, and functional route guards in Angular.',
    ],
    results:
      'Reduced redundant API payload overhead by 35% using GraphQL, streamlined simulated claim submission cycles by 50%, and eliminated over-fetching across all core dashboard views.',
    image: 'images/projects/insurance.jpg',
    githubUrl: 'https://github.com/PhantomPro/insurance-management-Capstone',
    liveUrl: '',
    featured: true,
    category: 'full-stack',
    order: 1,
  },
  {
    _id: 'proj_2',
    title: 'AI Image Generator',
    description:
      'Web-based generative AI studio integrating OpenAI API for real-time customizable image synthesis, prompt tuning, and gallery rendering.',
    longDescription:
      'A production-ready AI image creation workspace built with React.js and Node.js. It bridges the gap between complex AI generation parameters and everyday creators by providing an intuitive studio interface for prompt crafting, real-time rendering feedback, resolution control, and instant community sharing.',
    problem:
      'Generative AI interfaces often suffer from steep learning curves, lack of clear prompt guidance, high latency during model synthesis without user feedback, and unhandled 429 rate limit exceptions that frustrate users.',
    solution:
      'Engineered an interactive, user-friendly React.js interface with real-time feedback suggestions, animated loading skeleton states, and a streamlined Node.js backend proxy to securely handle OpenAI API keys, enforce rate limits, and optimize request payloads.',
    architecture:
      'Client-Proxy Architecture: React 18 single-page application with modular UI components and Tailwind CSS styling communicating over REST to a Node.js/Express backend service. The backend orchestrates OpenAI API requests, handles image buffer transformations, and manages caching.',
    technologies: ['React.js', 'Node.js', 'Express.js', 'JavaScript', 'HTML5', 'CSS3', 'OpenAI API', 'Tailwind CSS', 'Axios'],
    features: [
      'Integrated OpenAI API for generating diverse and photorealistic images from natural language prompts',
      'Interactive customization of image parameters including dimensions, stylistic presets, and prompt enhancers',
      'Secure Node.js backend proxy isolating API credentials and preventing unauthorized client-side quota leaks',
      'Real-time image generation pipeline with animated skeleton feedback reducing perceived wait times',
      'Community showcase gallery allowing creators to explore recent creations, inspect prompt seeds, and download high-res exports',
      'Rigorous cross-browser testing and responsive layout optimization across desktop, tablet, and mobile viewports',
    ],
    challenges: [
      'Managing third-party model latency (4–10 seconds per high-resolution generation) and providing responsive visual feedback so users remain confident the system is processing their request.',
      'Handling memory consumption and rapid asset transfer of large base64 image strings without degrading browser performance.',
    ],
    learnings: [
      'Deep understanding of generative AI APIs, prompt parameter tuning, and graceful degradation during service interruptions.',
      'Optimizing asynchronous state management in React for real-time operations, error boundary recovery, and image caching.',
    ],
    results:
      'Reduced API response times by 25%, enhanced load times by 35%, and decreased user-reported bugs by 40% through comprehensive cross-browser validation.',
    image: 'images/projects/ai-image-gen.jpg',
    githubUrl: 'https://github.com/PhantomPro/AI-Image-Generator',
    liveUrl: '',
    featured: true,
    category: 'ai',
    order: 2,
  },
  {
    _id: 'proj_3',
    title: 'Stock Photo Gallery (Carbon Gallery)',
    description:
      'Collaborative stock photo discovery platform built with Next.js, FastAPI, and PostgreSQL with high-performance search and filtering.',
    longDescription:
      'Developed in an agile 5-member engineering team, Carbon Gallery is a stock media platform designed for fast visual browsing, metadata tagging, and collection management. Features server-side rendered media catalogs, instant keyword filtering, and lightweight backend services delivering high-throughput asset delivery.',
    problem:
      'High-resolution image galleries frequently struggle with slow initial page loads, layout shifts during asynchronous image hydration, and inefficient database queries when filtering across multiple tags and camera metadata.',
    solution:
      'Engineered responsive frontend interfaces using Next.js for server-side rendering and static asset optimization, paired with an asynchronous FastAPI Python microservice backed by indexed PostgreSQL tables for sub-50ms photo queries.',
    architecture:
      'Full-Stack Decoupled Architecture: Next.js frontend with React Server Components and progressive image loading communicating with a Python FastAPI asynchronous backend microservice, backed by a PostgreSQL relational database with indexed query paths.',
    technologies: ['JavaScript', 'Node.js', 'Next.js', 'FastAPI', 'Python', 'HTML/CSS', 'PostgreSQL', 'Figma', 'Postman'],
    features: [
      'High-performance stock photo catalog with responsive infinite scroll and progressive image rendering',
      'Multi-facet filtering by category, orientation, color palette, and user-curated collections',
      'FastAPI asynchronous endpoints delivering sub-50ms database query response times',
      'Detailed media inspector showcasing EXIF metadata, camera specifications, license details, and download resolutions',
      'Collaborative UI design workflow based on pixel-perfect Figma component specifications',
      'PostgreSQL relational schemas with foreign key integrity across user bookmarks, tags, and photo records',
    ],
    challenges: [
      'Aligning API contracts across independent frontend (Next.js) and backend (FastAPI) repositories while collaborating across a 5-engineer team.',
      'Eliminating Cumulative Layout Shift (CLS) when loading heterogeneous photo aspect ratios in a dynamic masonry layout.',
    ],
    learnings: [
      'Cross-functional engineering communication, Git branching strategies (feature branches & PR code reviews), and Figma design token handoffs.',
      'Leveraging Python FastAPI async route handlers alongside Next.js SSR for hybrid performance gains.',
    ],
    results:
      'Reduced data integration time by 25%, decreased data synchronization issues by 30%, and improved page load times by 20% compared to baseline CSR applications.',
    image: 'images/projects/carbon-gallery.jpg',
    githubUrl: 'https://github.com/PlabanKr/carbon-gallery-frontend',
    liveUrl: 'https://github.com/PlabanKr/carbon-gallery-backend',
    featured: false,
    category: 'full-stack',
    order: 3,
  },
  {
    _id: 'proj_4',
    title: 'Project Graphite - CSS Code Generator',
    description:
      'Developer productivity suite for visually designing, customizing, and exporting production-ready CSS styling and components in real time.',
    longDescription:
      'Built within a collaborative 5-member engineering team, Project Graphite empowers frontend developers and UI designers to visually configure complex CSS styles—such as multi-layered box shadows, mesh gradients, glassmorphism filters, and border animations—and instantly generate cleanly formatted, cross-browser compliant CSS snippet code.',
    problem:
      'Hand-coding nuanced CSS properties (e.g. multi-stop cubic-bezier transitions, complex drop-shadow elevations, clip-paths) requires tedious trial-and-error in browser devtools, slowing down design-to-code velocity.',
    solution:
      'Created an interactive visual workbench where users tweak sliders, color pickers, and toggle switches with immediate live preview updates, accompanied by single-click syntax-highlighted code export in CSS, SCSS, or Tailwind classes.',
    architecture:
      'Interactive Visual Architecture: Modular JavaScript, HTML5, and CSS3 frontend utilizing reactive DOM state bindings and debounced math calculations, backed by Node.js and PostgreSQL for saving preset designs and Postman collections for endpoint validation.',
    technologies: ['JavaScript', 'Node.js', 'HTML/CSS', 'PostgreSQL', 'Postman', 'Figma', 'REST APIs'],
    features: [
      'Visual generator workbench for box-shadows, gradients, border-radius geometry, and CSS filter effects',
      'Real-time rendering canvas reflecting sub-pixel changes with zero frame drops',
      'Single-click code export supporting pure CSS3, SCSS mixins, and Tailwind utility classes',
      'Preset persistence allowing creators to save, categorize, and share custom styling snippets via unique URL identifiers',
      'Responsive UI designed in Figma with high-contrast accessibility and dark mode default',
      'Thoroughly tested backend REST endpoints verified using Postman integration suites',
    ],
    challenges: [
      'Maintaining real-time 60fps canvas re-rendering while parsing and recalculating complex CSS string values on high-frequency slider drag events.',
      'Translating visual design coordinates into standards-compliant vendor-prefixed CSS strings that render consistently across Chromium, Safari, and Firefox.',
    ],
    learnings: [
      'Advanced CSS specification mechanics, CSS Houdini concepts, and high-performance interactive DOM component development.',
      'Structured API contract testing and continuous validation with Postman test suites.',
    ],
    results:
      'Reduced data retrieval times by 20%, drastically accelerated frontend UI styling workflows, and delivered seamless preset saving.',
    image: 'images/projects/project-graphite.jpg',
    githubUrl: 'https://github.com/PlabanKr/Project-Graphite',
    liveUrl: 'https://www.figma.com/file/U87WqMDAYL294JiX9IqzKe/graphite?node-id=0%3A1&t=61v5uO4xgxBLaW2i-1',
    featured: false,
    category: 'frontend',
    order: 4,
  },
  {
    _id: 'proj_5',
    title: 'Expense Tracker Dashboard',
    description:
      'Personal finance analytics application featuring categorized transaction tracking, Recharts data visualization, and localized persistence.',
    longDescription:
      'A modern single-page personal finance dashboard designed to provide clear, actionable visibility into personal expenditures and income trends. Built with React and TypeScript, it utilizes Material UI components for cohesive design tokens, Context API for centralized financial state management, and Recharts for interactive charts and graphs.',
    problem:
      'Most personal expense trackers are either bloated with intrusive third-party banking syncs or overly simplistic spreadsheets that fail to visualize spending velocity, budget thresholds, or categorical distributions.',
    solution:
      'Built a streamlined, responsive personal finance dashboard that provides instant transaction logging, automated categorical grouping, interactive spending distribution charts, and reliable client-side persistence for immediate data security and zero cloud lock-in.',
    architecture:
      'Component & State Architecture: React 18 single-page application built with TypeScript, leveraging Material UI v5 for design tokens, Context API with reducer patterns for predictable immutable state transitions, and Recharts for SVG data rendering.',
    technologies: ['React.js', 'TypeScript', 'Material UI', 'Context API', 'Recharts', 'HTML5/CSS3', 'LocalStorage'],
    features: [
      'Real-time categorical breakdown (Housing, Food, Transit, Entertainment, Utilities) with color-coded spending distribution',
      'Interactive monthly cashflow and spending trend visualization with Recharts interactive tooltips and responsive containers',
      'Granular transaction management: quick add, filter by date range, edit existing entries, and instant search',
      'Context API state container with strict TypeScript interfaces guaranteeing type safety across financial calculations',
      'Client-side LocalStorage persistence with data export/import capabilities for user privacy',
      'Responsive layout optimized for rapid mobile transaction entry on the go',
    ],
    challenges: [
      'Calculating real-time aggregated metrics across historical transactions without causing unnecessary re-renders of the chart SVG nodes.',
      'Managing responsive layout reflows on mobile screens while preserving chart legibility and interactive touch tooltips.',
    ],
    learnings: [
      'Advanced memoization patterns (useMemo, useCallback) in React for financial data aggregation pipelines.',
      'Customizing Material UI design tokens and building custom SVG chart wrappers with Recharts.',
    ],
    results:
      'Delivered an interactive, zero-latency financial tracking tool providing instant visual insights with zero server latency and 100% offline functionality.',
    image: 'images/projects/expense-tracker.jpg',
    githubUrl: 'https://github.com/PhantomPro/expense-tracker-dashboard',
    liveUrl: '',
    featured: false,
    category: 'frontend',
    order: 5,
  },
];

export const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  { _id: '1', label: 'Problems Solved', value: 350, suffix: '+', prefix: '', icon: 'code', order: 1 },
  { _id: '2', label: 'Certifications', value: 2, suffix: '', prefix: '', icon: 'award', order: 2 },
  { _id: '3', label: 'HackerRank C++', value: 5, suffix: '★', prefix: '', icon: 'star', order: 3 },
  { _id: '4', label: 'Academic CGPA', value: 8, suffix: '/10', prefix: '', icon: 'layers', order: 4 },
];
