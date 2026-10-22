import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, timeout } from 'rxjs/operators';
import { of } from 'rxjs';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  model?: string;
  grounded?: boolean;
  suggestedActions?: Array<{ label: string; action: 'navigate' | 'ask'; target: string }>;
}

export interface AssistantApiResponse {
  success: boolean;
  data?: {
    reply: string;
    model: string;
    grounded?: boolean;
    suggestedActions?: Array<{ label: string; action: 'navigate' | 'ask'; target: string }>;
  };
  error?: string;
}

const INITIAL_GREETING: ChatMessage = {
  id: 'msg_welcome',
  role: 'assistant',
  text:
    'Hi! I’m Tanmay’s **Portfolio AI Assistant**, powered by **Google Gemini**.\n\n' +
    'Ask me anything about Tanmay’s **software engineering experience at Ascendion**, his **VS Code AI coding assistant**, **projects**, or **technical stack**.\n\n' +
    'Try one of the suggested prompts below, or ask your own question!',
  timestamp: new Date(),
  model: 'gemini-2.5-flash',
  grounded: true,
  suggestedActions: [
    { label: 'View Projects', action: 'navigate', target: 'projects' },
    { label: 'Ascendion Role', action: 'navigate', target: 'experience' },
    { label: 'Core Skills', action: 'navigate', target: 'skills' },
  ],
};

@Injectable({ providedIn: 'root' })
export class AssistantService {
  private http = inject(HttpClient);

  readonly messages = signal<ChatMessage[]>([INITIAL_GREETING]);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly activeHighlight = signal<string | null>(null);

  /**
   * Send a query to the AI Assistant
   */
  sendMessage(content: string): void {
    const trimmed = (content || '').trim();
    if (!trimmed || this.isLoading()) return;

    this.error.set(null);

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
    };

    // Append user message
    this.messages.update((prev) => [...prev, userMsg]);
    this.isLoading.set(true);

    // Prepare conversation history (last 4 turns)
    const historyPayload = this.messages()
      .slice(-5, -1)
      .map((m) => ({
        role: m.role,
        content: m.text,
      }));

    this.http
      .post<AssistantApiResponse>(
        `${environment.apiUrl}/assistant`,
        {
          message: trimmed,
          history: historyPayload,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .pipe(
        timeout(20000),
        catchError((err) => {
          console.warn('[AssistantService] Backend request failed or timed out:', err?.message || err);
          // Seamless client-side grounded fallback if backend is unreachable (e.g. static hosting)
          return of(this.getFallbackResponse(trimmed));
        })
      )
      .subscribe({
        next: (res) => {
          this.isLoading.set(false);
          if (res.success && res.data) {
            const assistantMsg: ChatMessage = {
              id: `msg_a_${Date.now()}`,
              role: 'assistant',
              text: res.data.reply,
              timestamp: new Date(),
              model: res.data.model || 'gemini-2.5-flash',
              grounded: res.data.grounded ?? true,
              suggestedActions: res.data.suggestedActions,
            };
            this.messages.update((prev) => [...prev, assistantMsg]);
            this.checkAndHighlight(res.data.reply);
          } else {
            this.error.set(res.error || 'Failed to get a response from Gemini. Please try again.');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set('Network issue. Please try again in a few moments.');
        },
      });
  }

  clearChat(): void {
    this.messages.set([
      {
        ...INITIAL_GREETING,
        id: `msg_welcome_${Date.now()}`,
        timestamp: new Date(),
      },
    ]);
    this.error.set(null);
  }

  retryLast(): void {
    const list = this.messages();
    for (let i = list.length - 1; i >= 0; i--) {
      if (list[i].role === 'user') {
        const lastQuery = list[i].text;
        // Remove trailing errors and retry
        this.messages.update((prev) => prev.slice(0, i));
        this.sendMessage(lastQuery);
        break;
      }
    }
  }

  askAboutProject(title: string): void {
    this.scrollToAssistant();
    setTimeout(() => {
      this.sendMessage(`Explain Tanmay's ${title} project and its architecture.`);
    }, 400);
  }

  askAboutSkill(skillName: string): void {
    this.scrollToAssistant();
    setTimeout(() => {
      this.sendMessage(`Which of Tanmay's projects and experience utilize ${skillName}?`);
    }, 400);
  }

  scrollToAssistant(): void {
    const el = document.getElementById('ai-assistant');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private checkAndHighlight(text: string): void {
    const lower = text.toLowerCase();
    if (lower.includes('insurance management')) {
      this.triggerHighlight('insurance');
    } else if (lower.includes('ai image generator')) {
      this.triggerHighlight('ai-image');
    } else if (lower.includes('stock photo') || lower.includes('carbon gallery')) {
      this.triggerHighlight('carbon');
    } else if (lower.includes('project graphite')) {
      this.triggerHighlight('graphite');
    } else if (lower.includes('expense tracker')) {
      this.triggerHighlight('expense');
    }
  }

  private triggerHighlight(id: string): void {
    this.activeHighlight.set(id);
    setTimeout(() => {
      this.activeHighlight.set(null);
    }, 4000);
  }

  /**
   * Grounded fallback engine when backend is offline or on static hosting without server
   */
  private getFallbackResponse(query: string): AssistantApiResponse {
    const q = query.toLowerCase();

    if (q.includes('project') || q.includes('built') || q.includes('work')) {
      return {
        success: true,
        data: {
          reply:
            'Tanmay Basu has engineered 5 notable production & capstone projects:\n\n' +
            '1. **Insurance Management Application**: Angular 17 & Apollo Server GraphQL platform with MongoDB and RBAC ([View Projects](#projects)).\n' +
            '2. **AI Image Generator**: Generative AI studio with React 18, Node.js proxy, and OpenAI API ([View Projects](#projects)).\n' +
            '3. **Stock Photo Gallery (Carbon Gallery)**: Next.js SSR + Python FastAPI async microservice delivering sub-50ms query times.\n' +
            '4. **Project Graphite**: Interactive CSS generator for shadows, gradients, and glassmorphism with 1-click export.\n' +
            '5. **Expense Tracker Dashboard**: React + TypeScript personal finance tool with Recharts visualization.\n\n' +
            'Ask me about any specific project for details on its problem, solution, and architecture!',
          model: 'gemini-grounded-client',
          grounded: true,
          suggestedActions: [
            { label: 'View Projects', action: 'navigate', target: 'projects' },
            { label: 'Ascendion Experience', action: 'navigate', target: 'experience' },
          ],
        },
      };
    }

    if (q.includes('ascendion') || q.includes('experience') || q.includes('role')) {
      return {
        success: true,
        data: {
          reply:
            'Tanmay is a **Full Stack Developer & Associate Engineer at Ascendion** (2+ years experience) in Hyderabad, India.\n\n' +
            'Key contributions:\n' +
            '- **VS Code AI Plugin**: Developing an interactive coding companion directly in VS Code, engineering backend microservices in Node.js and FastAPI, and integrating enterprise AI agent discovery APIs.\n' +
            '- **Experience Studio 2.5 (AAVA)**: Implementing core generative AI workspace components and reusable design system modules in React and Angular.\n' +
            '- **HP Delta Client Solutions**: Frontend troubleshooting and cross-environment stability across INT & SFI environments.\n\n' +
            'Explore the full timeline in the [Experience Section](#experience).',
          model: 'gemini-grounded-client',
          grounded: true,
          suggestedActions: [{ label: 'View Experience', action: 'navigate', target: 'experience' }],
        },
      };
    }

    if (q.includes('assistant') || q.includes('plugin') || q.includes('extension') || q.includes('coding')) {
      return {
        success: true,
        data: {
          reply:
            'Tanmay’s work on the **VS Code AI Coding Assistant** at Ascendion:\n\n' +
            '- Built a chatbot-style coding companion directly integrated inside the VS Code editor.\n' +
            '- Developed backend microservices and REST APIs using TypeScript, Node.js, and FastAPI.\n' +
            '- Implemented a chat filter feature to streamline developer conversation navigation.\n' +
            '- Integrated enterprise APIs enabling developers to search, discover, and invoke AI agents.\n\n' +
            'Check it out in the [Experience Section](#experience).',
          model: 'gemini-grounded-client',
          grounded: true,
          suggestedActions: [{ label: 'View Experience', action: 'navigate', target: 'experience' }],
        },
      };
    }

    if (q.includes('skill') || q.includes('stack') || q.includes('technolog')) {
      return {
        success: true,
        data: {
          reply:
            'Tanmay’s core verified skills include:\n\n' +
            '- **AI & LLM**: LLM applications, Prompt Engineering, OpenAI & Gemini APIs, AI Agents, Tool Integration.\n' +
            '- **Frontend**: React.js, Angular, TypeScript, JavaScript, Next.js, Tailwind CSS, Material UI.\n' +
            '- **Backend**: Node.js, Express.js, Python, FastAPI, GraphQL, Apollo Server, REST APIs, C++.\n' +
            '- **Databases**: PostgreSQL, MongoDB, MySQL.\n' +
            '- **Tools**: VS Code Extension API, Git & GitHub, Postman, Vite, Docker, Jest.\n\n' +
            'See the breakdown in the [Skills Section](#skills).',
          model: 'gemini-grounded-client',
          grounded: true,
          suggestedActions: [{ label: 'View Skills', action: 'navigate', target: 'skills' }],
        },
      };
    }

    if (q.includes('react') && q.includes('node')) {
      return {
        success: true,
        data: {
          reply:
            'Projects built with **React.js & Node.js**:\n\n' +
            '1. **AI Image Generator**: React 18 frontend with Node.js/Express backend proxy to securely handle OpenAI API requests and caching ([View Projects](#projects)).\n' +
            '2. **Project Graphite**: React & modular JavaScript visual workbench with Node.js backend.\n' +
            '3. **Experience Studio 2.5 (Ascendion)**: React & Angular generative AI platform with Node.js microservices ([View Experience](#experience)).',
          model: 'gemini-grounded-client',
          grounded: true,
          suggestedActions: [
            { label: 'View Projects', action: 'navigate', target: 'projects' },
            { label: 'View Experience', action: 'navigate', target: 'experience' },
          ],
        },
      };
    }

    return {
      success: true,
      data: {
        reply:
          'I am Tanmay Basu’s AI portfolio assistant. I can answer questions about his **experience at Ascendion**, his **VS Code AI plugin**, his **5 key projects**, and his **technical stack**.\n\n' +
          'Feel free to ask a question or explore:\n' +
          '- [View Projects](#projects)\n' +
          '- [View Experience](#experience)\n' +
          '- [Contact Tanmay](#contact)',
        model: 'gemini-grounded-client',
        grounded: true,
        suggestedActions: [
          { label: 'View Projects', action: 'navigate', target: 'projects' },
          { label: 'View Skills', action: 'navigate', target: 'skills' },
        ],
      },
    };
  }
}
