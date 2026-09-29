import { Component, OnInit, OnDestroy, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Profile } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="home" class="hero" aria-label="Hero section">
      <div class="container hero-container">
        <!-- Left Content -->
        <div class="hero-content">
          <div class="status-badge animate-on-scroll" [class.in-view]="animIn()">
            <span class="status-dot"></span>
            <span class="mono">Neural Engine Active • Ascendion AI Engineering</span>
          </div>

          <h1 class="hero-name animate-on-scroll delay-1" [class.in-view]="animIn()">
            Hi, I'm<br />
            <span class="gradient-text">{{ profile()?.name || 'Tanmay Basu' }}</span>
          </h1>

          <div class="hero-role animate-on-scroll delay-2" [class.in-view]="animIn()">
            <span class="typing-text mono">{{ currentRole() }}</span>
          </div>

          <p class="hero-bio animate-on-scroll delay-3" [class.in-view]="animIn()">
            {{ profile()?.shortBio || 'Full Stack Developer building AI-powered developer tools, scalable web applications, and modern design systems across React, Angular, Node.js, and Python.' }}
          </p>

          <div class="hero-cta animate-on-scroll delay-4" [class.in-view]="animIn()">
            <a
              href="#projects"
              class="btn btn-primary btn-lg"
              id="hero-view-projects"
              (click)="scrollTo($event, 'projects')"
              aria-label="View my projects"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              View Projects
            </a>
            <a
              href="#contact"
              class="btn btn-secondary btn-lg"
              (click)="scrollTo($event, 'contact')"
              id="hero-lets-connect"
              aria-label="Get in touch"
            >
              Let's Connect →
            </a>
          </div>
        </div>

        <!-- Right — Interactive Developer Visual -->
        <div class="hero-visual animate-on-scroll delay-3" [class.in-view]="animIn()" aria-hidden="true">
          <!-- Terminal Window -->
          <div class="terminal-window" role="img" aria-label="Code terminal illustration">
            <div class="terminal-header">
              <div class="terminal-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="terminal-title mono">agent.developer.ts</span>
              <span class="terminal-badge mono">AI Agent v2.5</span>
            </div>
            <div class="terminal-body">
              <div class="code-line prompt-line"><span class="token-prompt">❯</span> <span class="token-command">ascendion-agent init --profile</span> <span class="token-flag">--ai-mode</span></div>
              <div class="code-line"><span class="token-keyword">const</span> <span class="token-variable">developer</span> = &#123;</div>
              <div class="code-line indent"><span class="token-property">name</span>: <span class="token-string">'Tanmay Basu'</span>,</div>
              <div class="code-line indent"><span class="token-property">role</span>: <span class="token-string">'Full Stack Developer'</span>,</div>
              <div class="code-line indent"><span class="token-property">company</span>: <span class="token-string">'Ascendion'</span>,</div>
              <div class="code-line indent"><span class="token-property">neuralFocus</span>: <span class="token-string">'AI Tools & VS Code Extensions'</span>,</div>
              <div class="code-line indent"><span class="token-property">stack</span>: [</div>
              <div class="code-line double-indent"><span class="token-string">'React'</span>, <span class="token-string">'Angular'</span>,</div>
              <div class="code-line double-indent"><span class="token-string">'Node.js'</span>, <span class="token-string">'Python / FastAPI'</span>,</div>
              <div class="code-line double-indent"><span class="token-string">'LLM & Agents'</span></div>
              <div class="code-line indent">],</div>
              <div class="code-line indent"><span class="token-property">status</span>: <span class="token-string">'Synthesizing scalable software ⚡'</span></div>
              <div class="code-line">&#125;;</div>
              <div class="code-line">&nbsp;</div>
              <div class="code-line"><span class="token-function">AI</span>.<span class="token-function">optimize</span>(developer.stack); <span class="token-comment">// latency: 18ms</span></div>
              <div class="code-cursor"></div>
            </div>
          </div>

          <!-- Floating tech badges -->
          <div class="floating-badge badge-1">
            <span class="badge-icon">🧠</span>
            <span class="mono">LLM & AI Agents</span>
          </div>
          <div class="floating-badge badge-2">
            <span class="badge-icon">⚛️</span>
            <span class="mono">React & Angular</span>
          </div>
          <div class="floating-badge badge-3">
            <span class="badge-icon">⚡</span>
            <span class="mono">Node & FastAPI</span>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="scroll-indicator" aria-hidden="true">
        <div class="scroll-mouse">
          <div class="scroll-wheel"></div>
        </div>
        <span class="mono">scroll</span>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow-x: clip;
      overflow-y: visible;
      padding-top: 5rem;
    }

    .hero-glow {
      position: absolute;
      top: -10%;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 600px;
      background: radial-gradient(ellipse at center, rgba(124,111,247,0.15) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-container {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
      gap: 3rem;
      align-items: center;
      padding-top: 2rem;
      padding-bottom: 7rem;
      position: relative;
      z-index: 1;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        text-align: center;
        gap: 3rem;
        padding-bottom: 5rem;
      }
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      min-width: 0;

      @media (max-width: 1024px) { align-items: center; }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.4rem 1rem;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 100px;
      font-size: 0.8rem;
      color: #10B981;
      width: fit-content;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px rgba(16,185,129,0.6);
      animation: pulse-dot 2s ease-in-out infinite;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.3); }
    }

    .hero-name {
      font-size: clamp(2.6rem, 5vw, 4.5rem);
      font-weight: 900;
      line-height: 1.05;
      letter-spacing: -0.03em;
      word-break: break-word;
    }

    .hero-role {
      font-size: clamp(0.95rem, 1.8vw, 1.15rem);
      color: var(--accent-primary);
      font-weight: 500;
      letter-spacing: 0.01em;
      line-height: 1.5;
    }

    .typing-text {
      display: inline-block;
      color: var(--accent-primary);
      border-right: 2px solid var(--accent-primary);
      animation: blink-caret 1s step-end infinite;
      word-break: break-word;
      padding-right: 4px;
    }

    @keyframes blink-caret {
      0%, 100% { border-color: var(--accent-primary); }
      50% { border-color: transparent; }
    }

    .hero-bio {
      font-size: 1.05rem;
      color: var(--text-secondary);
      max-width: 520px;
      line-height: 1.75;

      @media (max-width: 1024px) { max-width: 600px; }
    }

    .hero-cta {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      @media (max-width: 1024px) { justify-content: center; }
      @media (max-width: 480px) {
        flex-direction: column;
        width: 100%;
        .btn { width: 100%; justify-content: center; }
      }
    }

    /* Terminal */
    .hero-visual {
      position: relative;
      display: flex;
      justify-content: center;
      min-width: 0;
      padding: 1rem 0.5rem;

      @media (max-width: 1024px) {
        order: -1;
        max-width: 500px;
        margin: 0 auto;
        width: 100%;
        padding: 0;
      }
    }

    .terminal-window {
      background: #0B0F19;
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 16px;
      box-shadow: 0 20px 50px -10px rgba(15, 23, 42, 0.4), 0 0 50px rgba(99, 102, 241, 0.15);
      overflow: hidden;
      width: 100%;
      max-width: 440px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
    }

    .terminal-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.875rem 1.25rem;
      background: #111827;
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
    }

    .terminal-dots {
      display: flex;
      gap: 0.4rem;

      .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        &.red { background: #FF5F56; }
        &.yellow { background: #FFBD2E; }
        &.green { background: #27C93F; }
      }
    }

    .terminal-title { color: var(--text-tertiary); font-size: 0.78rem; }

    .terminal-badge {
      margin-left: auto;
      font-size: 0.68rem;
      padding: 0.15rem 0.5rem;
      border-radius: 100px;
      background: rgba(129, 140, 248, 0.15);
      border: 1px solid rgba(129, 140, 248, 0.35);
      color: #38BDF8;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .terminal-body {
      padding: 1.25rem 1.5rem;
      line-height: 1.65;

      @media (max-width: 480px) {
        padding: 1rem 0.85rem;
        font-size: 0.72rem;
      }
    }

    .code-line {
      display: block;
      white-space: pre;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .code-line.indent {
      padding-left: 1.25rem;
      @media (max-width: 480px) { padding-left: 0.75rem; }
    }
    .code-line.double-indent {
      padding-left: 2.25rem;
      @media (max-width: 480px) { padding-left: 1.25rem; }
    }

    .prompt-line {
      margin-bottom: 0.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px dashed rgba(255,255,255,0.08);
      font-size: 0.8rem;
    }
    .token-prompt { color: #10B981; font-weight: 700; }
    .token-command { color: #38BDF8; font-weight: 600; }
    .token-flag { color: #EC4899; }
    .token-comment { color: #64748B; font-style: italic; }

    .token-keyword { color: #C792EA; }
    .token-type { color: #FFCB6B; }
    .token-string { color: #C3E88D; }
    .token-property { color: #82AAFF; }
    .token-variable { color: #F07178; }
    .token-function { color: #82AAFF; }

    .code-cursor {
      display: inline-block;
      width: 8px;
      height: 16px;
      background: var(--accent-primary);
      margin-left: 2px;
      margin-top: 4px;
      vertical-align: middle;
      border-radius: 2px;
      animation: cursor-blink 1s step-end infinite;
    }

    @keyframes cursor-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* Floating badges */
    .floating-badge {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.8rem;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      border-radius: 100px;
      font-size: 0.76rem;
      font-weight: 600;
      color: var(--text-primary);
      box-shadow: var(--shadow-md);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      white-space: nowrap;
      z-index: 2;

      .badge-icon { font-size: 0.95rem; }

      @media (max-width: 1024px) { display: none; }
    }

    .badge-1 {
      top: -0.75rem;
      right: 1rem;
      animation: float1 4s ease-in-out infinite;
    }
    .badge-2 {
      bottom: -0.75rem;
      left: 1rem;
      animation: float2 5s ease-in-out infinite;
    }
    .badge-3 {
      top: 50%;
      right: -0.75rem;
      transform: translateY(-50%);
      animation: float3 4.5s ease-in-out infinite;
    }

    @keyframes float1 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-8px); }
    }
    @keyframes float2 {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(6px); }
    }
    @keyframes float3 {
      0%, 100% { transform: translateY(-50%) translateY(0px); }
      50% { transform: translateY(-50%) translateY(-6px); }
    }

    /* Scroll indicator */
    .scroll-indicator {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-tertiary);
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      animation: bounce-scroll 2s ease-in-out infinite;

      @media (max-width: 768px) { display: none; }
    }

    .scroll-mouse {
      width: 22px;
      height: 36px;
      border: 2px solid var(--border-default);
      border-radius: 12px;
      display: flex;
      justify-content: center;
      padding-top: 6px;
    }

    .scroll-wheel {
      width: 3px;
      height: 7px;
      background: var(--accent-primary);
      border-radius: 2px;
      animation: scroll-wheel 1.5s ease-in-out infinite;
    }

    @keyframes scroll-wheel {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(8px); opacity: 0; }
    }

    @keyframes bounce-scroll {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(-4px); }
    }

  `],
})
export class HeroComponent implements OnInit, OnDestroy {
  private portfolioService = inject(PortfolioService);

  readonly profile = signal<Profile | null>(null);
  readonly animIn = signal(false);
  readonly currentRole = signal('Full Stack Developer & Associate Engineer | AI & Cloud');

  private roleTimeout?: ReturnType<typeof setTimeout>;
  private animTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.portfolioService.getProfile().subscribe({
      next: (res) => {
        if (res.success) {
          this.profile.set(res.data);
          if (res.data.tagline) {
            this.currentRole.set(res.data.tagline);
          }
        }
      },
      error: () => {
        // Use defaults on error
      },
    });

    // Trigger entrance animation
    this.animTimeout = setTimeout(() => this.animIn.set(true), 100);
  }

  ngOnDestroy(): void {
    if (this.roleTimeout) clearTimeout(this.roleTimeout);
    if (this.animTimeout) clearTimeout(this.animTimeout);
  }

  scrollTo(event: Event, id: string): void {
    event.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
}
