import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AssistantResponse {
  reply: string;
  model: string;
  suggestedActions?: Array<{ label: string; action: 'navigate' | 'ask'; target: string }>;
  grounded: boolean;
}

const TANMAY_PORTFOLIO_SYSTEM_INSTRUCTION = `
You are the official AI Assistant for Tanmay Basu's developer portfolio.
Your role is to represent Tanmay professionally, accurately, and concisely to recruiters, engineering managers, and visitors.

========================
VERIFIED PORTFOLIO KNOWLEDGE BASE (GROUND TRUTH)
========================
- Full Name: Tanmay Basu
- Role: Full Stack Developer & Associate Engineer
- Current Company: Ascendion (Hyderabad, India)
- Total Experience: 2+ Years
- Contact: basutanmay.007@gmail.com | Phone: +91 7607005541 | Location: Hyderabad, India
- Links: GitHub (https://github.com/PhantomPro) | LinkedIn (https://www.linkedin.com/in/tanmay-basu-9310b01a1/) | Resume (resume.pdf)
- Education: Bachelor of Technology (B.Tech) in Computer Science & Engineering from Vellore Institute of Technology (VIT), Bhopal (2021 - 2025), CGPA: 8.0 / 10. Higher Secondary: Kendriya Vidyalaya (2019 - 2020), 7.0 / 10.

PROFESSIONAL EXPERIENCE AT ASCENDION:
1. Associate Engineer — Backend & AI Plugin Development (VS Code AI Plugin) [2025-06 – Present, Hyderabad]:
   - Developing an interactive AI-powered VS Code extension that serves as a chatbot-style coding companion directly in the editor.
   - Engineering backend microservices, REST APIs, chat workflows, and extension core functionality using TypeScript, Node.js, Python, and FastAPI.
   - Implemented a chat filter option that significantly enhanced conversation navigation and developer usability.
   - Integrated an enterprise API enabling users to search, discover, and invoke AI agents across the organization.
   - Built resilient prompt/context handling and reliable cross-environment workflows.
2. Frontend Developer — Experience Studio 2.5 (AAVA) [2025-01 – 2025-06, Hyderabad]:
   - Worked on frontend engineering, implementing AAVA components and critical UI enhancements for Ascendion's generative AI Experience Studio platform.
   - Contributed to the core Design System and Workspace using reusable components and consistent UI patterns across React.js, Angular, and TypeScript.
   - Maintained strict UI fidelity, responsiveness, and component reusability across platforms.
3. Frontend Developer — Client Solutions (HP Delta) [2024-08 – 2024-12, Hyderabad]:
   - Handled frontend development, deep defect troubleshooting, and cross-environment stability for the HP Delta client platform under Ascendion.
   - Implemented validated UI fixes across INT and SFI environments to ensure regression-free functionality.

PERSONAL & CAPSTONE PROJECTS:
1. Insurance Management Application:
   - Tech: Angular 17+, Node.js, Express.js, MongoDB, Apollo Server 4, GraphQL, TypeScript, JWT RBAC.
   - Highlights: Enterprise insurance lifecycle platform with granular RBAC (Admin, Agent, Customer), automated claim verification pipeline, normalized GraphQL schemas reducing payload overhead by 35%, and sub-second query execution.
   - GitHub: https://github.com/PhantomPro/insurance-management-Capstone
2. AI Image Generator:
   - Tech: React.js, Node.js, Express.js, OpenAI API, Tailwind CSS, Axios.
   - Highlights: Generative AI studio for natural language prompt crafting, real-time skeleton loading states, secure Node.js backend proxy preventing client quota leaks, and community showcase gallery. Reduced API latency by 25% and load times by 35%.
   - GitHub: https://github.com/PhantomPro/AI-Image-Generator
3. Stock Photo Gallery (Carbon Gallery):
   - Tech: Next.js (SSR), FastAPI (Python), PostgreSQL, Figma, Postman.
   - Highlights: Collaborative 5-engineer media platform with progressive image rendering, multi-facet filtering, and FastAPI async microservices delivering sub-50ms database queries. Improved page load times by 20%.
   - GitHub: https://github.com/PlabanKr/carbon-gallery-frontend
4. Project Graphite - CSS Code Generator:
   - Tech: JavaScript, Node.js, HTML5/CSS3, PostgreSQL, Postman.
   - Highlights: Interactive visual developer productivity workbench for customizing box-shadows, mesh gradients, glassmorphism filters, and exporting production-ready CSS/SCSS/Tailwind code. Reduced data retrieval times by 20%.
   - GitHub: https://github.com/PlabanKr/Project-Graphite
5. Expense Tracker Dashboard:
   - Tech: React.js, TypeScript, Material UI v5, Context API, Recharts, LocalStorage.
   - Highlights: Single-page personal finance analytics dashboard with categorical breakdown, interactive cashflow charts via Recharts, and zero-latency client persistence.
   - GitHub: https://github.com/PhantomPro/expense-tracker-dashboard

TECHNICAL SKILLS:
- AI & LLM Engineering: LLM-powered applications, Prompt Engineering, OpenAI & Gemini APIs, Tool Integration, Knowledge Bases, AI Agents.
- Frontend: React.js, Angular, TypeScript, JavaScript, Next.js, Tailwind CSS, Material UI, HTML5 / CSS3.
- Backend: Node.js, Express.js, Python, FastAPI, GraphQL, Apollo Server, REST APIs, C++.
- Databases: PostgreSQL, MongoDB, MySQL.
- Tools: VS Code Extension API, Git & GitHub, Postman, Vite, Docker, Jest.

ACHIEVEMENTS:
- Solved 350+ algorithmic problems across LeetCode & GeeksforGeeks.
- 5-Star rated in C++ on HackerRank.
- 2 Industry Certifications.

========================
BEHAVIOR & CONSTRAINTS:
========================
1. Grounding: Answer ONLY based on Tanmay's verified background above. If a user asks about something outside Tanmay's verified professional portfolio (e.g. general trivia, unrelated code), politely redirect them back to Tanmay's skills, experience, or projects.
2. Tone: Professional, enthusiastic, concise, and recruiter-friendly.
3. Links: Whenever referencing projects, experience, skills, or contact, include markdown section jump links:
   - [View Projects](#projects)
   - [View Experience](#experience)
   - [View Skills](#skills)
   - [View About Me](#about)
   - [Contact Tanmay](#contact)
4. No Hallucinations: NEVER invent projects, years of experience, unverified skills, or proprietary internal source code. State clearly when details are not publicly shareable.
5. Conciseness: Keep responses under 150-200 words unless explicitly asked for deep architectural breakdowns.
6. Company Name Rule: ONLY mention the company name 'Ascendion' when directly answering questions about Tanmay's professional work experience or 'Who is Tanmay'. Do NOT insert or repeat 'Ascendion' when answering questions about personal projects, technical skills, frontend/backend questions, or general queries.
`;

export class GeminiAssistantService {
  private client: GoogleGenAI | null = null;
  private readonly primaryModel: string;
  private readonly fallbackModel = 'gemini-3.8-flash';

  constructor() {
    this.primaryModel = config.geminiModel || 'gemini-3.5-flash-lite';
    if (config.geminiApiKey) {
      this.client = new GoogleGenAI({ apiKey: config.geminiApiKey });
    }
  }

  /**
   * Generates a portfolio-grounded assistant reply using Google Gemini API free-tier.
   */
  async generateReply(
    userMessage: string,
    history: ChatMessage[] = []
  ): Promise<AssistantResponse> {
    const trimmedMessage = (userMessage || '').trim();

    if (!trimmedMessage) {
      return {
        reply: 'Hello! I am Tanmay Basu’s AI assistant. How can I help you explore his projects, technical skills, or engineering experience at Ascendion?',
        model: 'system',
        grounded: true,
      };
    }

    // If no API key is configured on the server, gracefully handle with offline grounding
    if (!this.client || !config.geminiApiKey) {
      return this.generateOfflineGroundingResponse(trimmedMessage);
    }

    // Build concise conversation turns (last 6 messages max for free-tier token efficiency)
    const recentHistory = (history || []).slice(-6);
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    for (const msg of recentHistory) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: trimmedMessage }],
    });

    // Try primary model first, with fallback to gemini-1.5-flash on error
    try {
      return await this.callGemini(this.primaryModel, contents);
    } catch (primaryError: any) {
      console.warn(`[GeminiService] Primary model (${this.primaryModel}) error:`, primaryError?.message || primaryError);

      // Handle 429 Quota Exhaustion immediately with friendly message
      if (this.isQuotaError(primaryError)) {
        return {
          reply:
            'The Gemini free-tier rate limit has been temporarily reached. Tanmay’s portfolio is still fully interactive! You can explore his [Projects](#projects), [Experience at Ascendion](#experience), and [Technical Skills](#skills) directly.',
          model: this.primaryModel,
          grounded: true,
          suggestedActions: [
            { label: 'View Projects', action: 'navigate', target: 'projects' },
            { label: 'View Experience', action: 'navigate', target: 'experience' },
            { label: 'View Skills', action: 'navigate', target: 'skills' },
          ],
        };
      }

      // Try fallback model if primary model wasn't fallback
      if (this.primaryModel !== this.fallbackModel) {
        try {
          console.info(`[GeminiService] Attempting fallback to ${this.fallbackModel}...`);
          return await this.callGemini(this.fallbackModel, contents);
        } catch (fallbackError: any) {
          console.error('[GeminiService] Fallback model error:', fallbackError?.message || fallbackError);
          if (this.isQuotaError(fallbackError)) {
            return {
              reply:
                'The Gemini API free tier is currently experiencing high demand. Please try again in 30 seconds or jump directly to Tanmay’s [Projects](#projects) and [Resume](#home).',
              model: this.fallbackModel,
              grounded: true,
            };
          }
        }
      }

      // Fallback to grounded portfolio reply if API call fails
      return this.generateOfflineGroundingResponse(trimmedMessage);
    }
  }

  private async callGemini(
    model: string,
    contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>
  ): Promise<AssistantResponse> {
    if (!this.client) throw new Error('Gemini client not initialized');

    const response = await this.client.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: TANMAY_PORTFOLIO_SYSTEM_INSTRUCTION,
        temperature: 0.3,
        maxOutputTokens: 600,
      },
    });

    const replyText = response.text?.trim() || 'I am ready to help you learn more about Tanmay Basu’s projects and experience.';

    return {
      reply: replyText,
      model,
      grounded: true,
      suggestedActions: this.deriveSuggestedActions(replyText),
    };
  }

  private isQuotaError(err: any): boolean {
    const msg = (err?.message || '').toLowerCase();
    const status = err?.status || err?.statusCode || 0;
    return (
      status === 429 ||
      msg.includes('429') ||
      msg.includes('quota') ||
      msg.includes('resource_exhausted') ||
      msg.includes('rate limit')
    );
  }

  private deriveSuggestedActions(text: string): Array<{ label: string; action: 'navigate' | 'ask'; target: string }> {
    const actions: Array<{ label: string; action: 'navigate' | 'ask'; target: string }> = [];
    const lower = text.toLowerCase();

    if (lower.includes('#projects') || lower.includes('project')) {
      actions.push({ label: 'Explore Projects', action: 'navigate', target: 'projects' });
    }
    if (lower.includes('#experience') || lower.includes('ascendion')) {
      actions.push({ label: 'View Experience', action: 'navigate', target: 'experience' });
    }
    if (lower.includes('#skills') || lower.includes('skill')) {
      actions.push({ label: 'View Skills', action: 'navigate', target: 'skills' });
    }
    if (lower.includes('#contact') || lower.includes('email') || lower.includes('reach')) {
      actions.push({ label: 'Contact Tanmay', action: 'navigate', target: 'contact' });
    }

    return actions.slice(0, 3);
  }

  /**
   * Graceful offline portfolio knowledge engine when GEMINI_API_KEY is not configured
   */
  private generateOfflineGroundingResponse(query: string): AssistantResponse {
    const q = query.toLowerCase();

    if (q.includes('project') || q.includes('built') || q.includes('work')) {
      return {
        reply:
          'Tanmay has engineered 5 notable projects:\n\n' +
          '1. **Insurance Management Application**: Enterprise Angular 17 & Apollo GraphQL platform with MongoDB and RBAC ([View Projects](#projects)).\n' +
          '2. **AI Image Generator**: Generative AI studio built with React 18, Node.js proxy, and OpenAI API ([View Projects](#projects)).\n' +
          '3. **Stock Photo Gallery (Carbon Gallery)**: Next.js SSR + FastAPI Python microservice with sub-50ms query times.\n' +
          '4. **Project Graphite**: Visual CSS and glassmorphism styling workbench with one-click export.\n' +
          '5. **Expense Tracker Dashboard**: React + TypeScript personal finance tool with Recharts visualization.\n\n' +
          '> *Note: Set `GEMINI_API_KEY` in your `.env` to enable dynamic real-time Gemini Flash reasoning!*',
        model: 'portfolio-grounded-engine',
        grounded: true,
        suggestedActions: [{ label: 'View Projects', action: 'navigate', target: 'projects' }],
      };
    }

    if (q.includes('ascendion') || q.includes('experience') || q.includes('role') || q.includes('job')) {
      return {
        reply:
          'Tanmay Basu is currently a **Full Stack Developer & Associate Engineer at Ascendion** (2+ years experience) in Hyderabad, India.\n\n' +
          'Key contributions at Ascendion include:\n' +
          '- **VS Code AI Plugin**: Developing an interactive chatbot coding assistant, engineering backend microservices in Node.js/Python, and integrating enterprise AI agent discovery APIs.\n' +
          '- **Experience Studio 2.5 (AAVA)**: Implementing core generative AI workspace components and reusable design system modules in React and Angular.\n' +
          '- **HP Delta Client Solutions**: Frontend troubleshooting and cross-environment stability across INT & SFI environments.\n\n' +
          'Explore his timeline in the [Experience Section](#experience).',
        model: 'portfolio-grounded-engine',
        grounded: true,
        suggestedActions: [{ label: 'View Experience', action: 'navigate', target: 'experience' }],
      };
    }

    if (q.includes('coding assistant') || q.includes('plugin') || q.includes('extension') || q.includes('agent')) {
      return {
        reply:
          'Tanmay’s work on the **VS Code AI Coding Assistant** at Ascendion includes:\n\n' +
          '- Built a chatbot-style coding companion directly integrated inside the VS Code editor.\n' +
          '- Developed backend services and REST APIs with Node.js and FastAPI.\n' +
          '- Implemented a chat filter feature to streamline developer conversation navigation.\n' +
          '- Integrated enterprise APIs enabling developers to search, discover, and invoke AI agents.\n\n' +
          'See more in the [Experience Section](#experience).',
        model: 'portfolio-grounded-engine',
        grounded: true,
        suggestedActions: [{ label: 'View Experience', action: 'navigate', target: 'experience' }],
      };
    }

    if (q.includes('skill') || q.includes('stack') || q.includes('technolog')) {
      return {
        reply:
          'Tanmay’s core technical stack spans full-stack engineering and AI:\n\n' +
          '- **AI & LLM**: LLM applications, Prompt Engineering, OpenAI/Gemini APIs, AI Agents, Tool Integration.\n' +
          '- **Frontend**: React.js, Angular, TypeScript, JavaScript, Next.js, Tailwind CSS, Material UI.\n' +
          '- **Backend**: Node.js, Express.js, Python, FastAPI, GraphQL, Apollo Server, REST APIs, C++.\n' +
          '- **Databases**: PostgreSQL, MongoDB, MySQL.\n' +
          '- **Tools**: VS Code Extension API, Git & GitHub, Postman, Vite, Docker, Jest.\n\n' +
          'Check out all technologies in the [Skills Section](#skills).',
        model: 'portfolio-grounded-engine',
        grounded: true,
        suggestedActions: [{ label: 'View Skills', action: 'navigate', target: 'skills' }],
      };
    }

    return {
      reply:
        'Hello! I am Tanmay Basu’s AI portfolio assistant. I can answer questions about his **experience at Ascendion**, his **projects** (like the Insurance Management App or AI Image Generator), his **AI coding assistant plugin**, and his **technical skills**.\n\n' +
        'What would you like to know? You can also jump to:\n' +
        '- [View Projects](#projects)\n' +
        '- [View Experience](#experience)\n' +
        '- [Contact Tanmay](#contact)\n\n' +
        '> *Tip: Configure `GEMINI_API_KEY` in `.env` to unlock live Google Gemini Flash responses!*',
      model: 'portfolio-grounded-engine',
      grounded: true,
      suggestedActions: [
        { label: 'View Projects', action: 'navigate', target: 'projects' },
        { label: 'View Experience', action: 'navigate', target: 'experience' },
      ],
    };
  }
}

export const geminiAssistantService = new GeminiAssistantService();
