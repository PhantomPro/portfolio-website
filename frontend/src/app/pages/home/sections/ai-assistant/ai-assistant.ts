import { Component, ElementRef, ViewChild, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService, ChatMessage } from '../../../../core/services/assistant.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="ai-assistant" class="section assistant-section" aria-labelledby="assistant-title">
      <div class="container">
        <!-- Section Header -->
        <div class="section-header">
          <span class="section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            AI Command Center
          </span>
          <h2 id="assistant-title">Ask My AI Assistant</h2>
          <p>Real-time conversational agent grounded in my verified engineering work at Ascendion, projects, and skills.</p>
        </div>

        <!-- Chat Container Card -->
        <div class="chat-terminal card">
          <!-- Terminal Header Bar -->
          <div class="terminal-header">
            <div class="terminal-status">
              <span class="status-pulse"></span>
              <span class="status-text">Gemini Flash Online</span>
              <span class="tier-badge">Free Tier</span>
            </div>

            <div class="header-actions">
              <button
                class="btn-action"
                (click)="clearConversation()"
                title="Clear conversation history"
                aria-label="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>Clear Chat</span>
              </button>
            </div>
          </div>

          <!-- Suggested Quick Prompts -->
          <div class="prompt-chips-bar" aria-label="Suggested questions">
            <span class="chips-label">Suggested:</span>
            <div class="chips-scroll">
              @for (prompt of suggestedPrompts; track prompt) {
                <button
                  class="prompt-chip"
                  (click)="sendSuggestedPrompt(prompt)"
                  [disabled]="assistantService.isLoading()"
                >
                  {{ prompt }}
                </button>
              }
            </div>
          </div>

          <!-- Messages Scroll Viewport -->
          <div #messagesContainer class="messages-viewport" role="log" aria-live="polite">
            @for (msg of assistantService.messages(); track msg.id) {
              <div
                class="message-row"
                [class.user-row]="msg.role === 'user'"
                [class.assistant-row]="msg.role === 'assistant'"
              >
                @if (msg.role === 'assistant') {
                  <div class="avatar assistant-avatar" aria-hidden="true">
                    <span>AI</span>
                  </div>
                }

                <div class="message-bubble" [class.user-bubble]="msg.role === 'user'">
                  <!-- Message Text with Markdown formatting & section jump links -->
                  <div class="message-content" [innerHTML]="formatMessage(msg.text)"></div>

                  <!-- Suggested Action Pills from Assistant -->
                  @if (msg.suggestedActions && msg.suggestedActions.length > 0) {
                    <div class="action-pills">
                      @for (act of msg.suggestedActions; track act.target) {
                        <button
                          class="action-pill"
                          (click)="handleActionClick(act)"
                        >
                          {{ act.label }} →
                        </button>
                      }
                    </div>
                  }

                  <!-- Message Metadata -->
                  <div class="message-meta">
                    <span class="meta-time">{{ msg.timestamp | date:'shortTime' }}</span>
                    @if (msg.role === 'assistant' && msg.model) {
                      <span class="meta-dot">·</span>
                      <span class="meta-model">{{ msg.model }}</span>
                    }
                  </div>
                </div>

                @if (msg.role === 'user') {
                  <div class="avatar user-avatar" aria-hidden="true">
                    <span>You</span>
                  </div>
                }
              </div>
            }

            <!-- Loading Typing Indicator -->
            @if (assistantService.isLoading()) {
              <div class="message-row assistant-row">
                <div class="avatar assistant-avatar" aria-hidden="true">
                  <span>AI</span>
                </div>
                <div class="message-bubble typing-bubble" aria-label="Assistant is thinking">
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-label">Gemini is synthesizing...</span>
                </div>
              </div>
            }

            <!-- Error Banner -->
            @if (assistantService.error()) {
              <div class="error-banner" role="alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span class="error-text">{{ assistantService.error() }}</span>
                <button class="btn-retry" (click)="retry()">Retry</button>
              </div>
            }
          </div>

          <!-- Chat Input Area -->
          <div class="input-container">
            <div class="input-wrapper">
              <textarea
                #inputField
                rows="1"
                class="chat-input"
                placeholder="Ask about Tanmay's experience, VS Code AI plugin, projects, or skills..."
                [(ngModel)]="userInput"
                (keydown)="onKeydown($event)"
                (input)="autoGrow($event)"
                maxlength="1000"
                aria-label="Ask assistant a question"
                [disabled]="assistantService.isLoading()"
              ></textarea>

              <div class="input-controls">
                <span class="char-count" [class.warn]="userInput.length > 900">
                  {{ userInput.length }}/1000
                </span>

                <button
                  class="btn btn-primary send-btn"
                  [disabled]="!userInput.trim() || assistantService.isLoading()"
                  (click)="handleSend()"
                  aria-label="Send message"
                >
                  @if (assistantService.isLoading()) {
                    <span class="spinner-small" aria-hidden="true"></span>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                  <span class="send-text">Send</span>
                </button>
              </div>
            </div>

            <div class="input-hints">
              <span>Press <kbd>Enter</kbd> to send, <kbd>Shift + Enter</kbd> for new line</span>
              <span class="api-disclaimer">Zero credentials exposed • Server-side Gemini processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .assistant-section {
      background: transparent;
      position: relative;
    }

    .chat-terminal {
      max-width: 960px;
      margin: 0 auto;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border: 1px solid var(--border-accent);
      background: var(--bg-surface);
      box-shadow: 0 16px 40px -10px rgba(0, 0, 0, 0.5), 0 0 24px var(--accent-subtle);
      transition: all 0.3s ease;
    }

    /* Terminal Header */
    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 1.25rem;
      background: rgba(10, 10, 24, 0.6);
      border-bottom: 1px solid var(--border-subtle);
    }

    .terminal-status {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .status-pulse {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 8px #10B981;
      animation: pulse-dot 2s infinite ease-in-out;
    }

    @keyframes pulse-dot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .status-text {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .tier-badge {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      background: rgba(6, 182, 212, 0.12);
      border: 1px solid rgba(6, 182, 212, 0.3);
      color: var(--cyan);
    }

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.65rem;
      border-radius: 6px;
      border: 1px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      font-size: 0.78rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-strong);
        background: var(--accent-subtle);
      }
    }

    /* Prompt Chips Bar */
    .prompt-chips-bar {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1.25rem;
      background: rgba(14, 14, 32, 0.4);
      border-bottom: 1px solid var(--border-subtle);
      overflow-x: auto;
    }

    .chips-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-tertiary);
      white-space: nowrap;
    }

    .chips-scroll {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      overflow-x: auto;
      scrollbar-width: none;
      &::-webkit-scrollbar { display: none; }
    }

    .prompt-chip {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      background: var(--accent-subtle);
      border: 1px solid var(--border-default);
      color: var(--text-secondary);
      font-size: 0.8rem;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        color: var(--text-primary);
        border-color: var(--accent-primary);
        background: rgba(129, 140, 248, 0.2);
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    /* Messages Viewport */
    .messages-viewport {
      height: 440px;
      overflow-y: auto;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      scroll-behavior: smooth;
    }

    .message-row {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      max-width: 88%;

      &.user-row {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      &.assistant-row {
        align-self: flex-start;
      }
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .assistant-avatar {
      background: linear-gradient(135deg, #6366F1 0%, #A855F7 100%);
      color: #FFFFFF;
      box-shadow: 0 0 10px rgba(129, 140, 248, 0.4);
    }

    .user-avatar {
      background: rgba(148, 163, 184, 0.2);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
    }

    .message-bubble {
      padding: 0.85rem 1.15rem;
      border-radius: 14px;
      font-size: 0.92rem;
      line-height: 1.6;
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-default);
      color: var(--text-primary);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

      &.user-bubble {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
        border-color: rgba(129, 140, 248, 0.4);
      }
    }

    .message-content {
      word-break: break-word;

      ::ng-deep p { margin: 0 0 0.5rem 0; &:last-child { margin-bottom: 0; } }
      ::ng-deep ul, ::ng-deep ol { margin: 0.35rem 0 0.65rem 1.25rem; padding: 0; }
      ::ng-deep li { margin-bottom: 0.25rem; }
      ::ng-deep a {
        color: var(--accent-primary);
        text-decoration: underline;
        font-weight: 600;
        cursor: pointer;
        &:hover { color: var(--cyan); }
      }
      ::ng-deep strong { color: var(--text-primary); font-weight: 700; }
      ::ng-deep blockquote {
        margin: 0.5rem 0;
        padding-left: 0.75rem;
        border-left: 2px solid var(--accent-primary);
        font-size: 0.85rem;
        color: var(--text-secondary);
      }
    }

    .action-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-top: 0.75rem;
    }

    .action-pill {
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      border: 1px solid var(--border-accent);
      background: var(--accent-subtle);
      color: var(--accent-primary);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: var(--accent-primary);
        color: #FFFFFF;
      }
    }

    .message-meta {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.45rem;
      font-size: 0.7rem;
      color: var(--text-tertiary);
    }

    /* Typing Dots */
    .typing-bubble {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.75rem 1rem;
    }

    .typing-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-primary);
      animation: typing-jump 1.4s infinite ease-in-out both;

      &:nth-child(1) { animation-delay: -0.32s; }
      &:nth-child(2) { animation-delay: -0.16s; }
      &:nth-child(3) { animation-delay: 0; }
    }

    @keyframes typing-jump {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1.1); opacity: 1; }
    }

    .typing-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-left: 0.35rem;
    }

    /* Error Banner */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: rgba(248, 113, 113, 0.12);
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: #F87171;
      font-size: 0.85rem;
    }

    .error-text { flex: 1; }

    .btn-retry {
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      background: #F87171;
      color: #05050A;
      border: none;
      font-weight: 600;
      font-size: 0.75rem;
      cursor: pointer;
      &:hover { opacity: 0.9; }
    }

    /* Input Container */
    .input-container {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border-subtle);
      background: rgba(10, 10, 24, 0.5);
    }

    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: 12px;
      padding: 0.5rem 0.75rem;
      transition: all 0.2s ease;

      &:focus-within {
        border-color: var(--accent-primary);
        box-shadow: 0 0 12px var(--accent-subtle);
      }
    }

    .chat-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-size: 0.92rem;
      resize: none;
      max-height: 120px;
      line-height: 1.4;
      font-family: inherit;
    }

    .input-controls {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-shrink: 0;
    }

    .char-count {
      font-size: 0.72rem;
      color: var(--text-tertiary);
      font-family: 'JetBrains Mono', monospace;
      &.warn { color: #F59E0B; }
    }

    .send-btn {
      padding: 0.5rem 0.9rem;
      border-radius: 8px;
      font-size: 0.85rem;
      gap: 0.4rem;
      min-height: unset;
    }

    .spinner-small {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #FFFFFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .input-hints {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
      font-size: 0.72rem;
      color: var(--text-tertiary);

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid var(--border-subtle);
        border-radius: 4px;
        padding: 0.1rem 0.35rem;
        font-family: inherit;
      }

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
    }

    /* Light Mode Overrides */
    :host-context([data-theme="light"]) {
      .chat-terminal {
        background: #FFFFFF;
        border-color: rgba(99, 102, 241, 0.25);
        box-shadow: 0 16px 40px -10px rgba(79, 70, 229, 0.12);
      }
      .terminal-header {
        background: #F8FAFC;
        border-bottom-color: rgba(226, 232, 240, 0.8);
      }
      .prompt-chips-bar {
        background: #F1F5F9;
        border-bottom-color: rgba(226, 232, 240, 0.8);
      }
      .prompt-chip {
        background: #FFFFFF;
        color: #475569;
        border-color: rgba(203, 213, 225, 0.8);
        &:hover:not(:disabled) {
          background: rgba(79, 70, 229, 0.08);
          color: #4338CA;
        }
      }
      .message-bubble {
        background: #F8FAFC;
        border-color: rgba(226, 232, 240, 0.9);
        color: #0F172A;
        &.user-bubble {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.2);
        }
      }
      .input-container {
        background: #F8FAFC;
        border-top-color: rgba(226, 232, 240, 0.8);
      }
      .input-wrapper {
        background: #FFFFFF;
        border-color: rgba(203, 213, 225, 0.8);
      }
    }
  `],
})
export class AiAssistantComponent implements AfterViewChecked {
  assistantService = inject(AssistantService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputField') private inputField!: ElementRef;

  userInput = '';

  readonly suggestedPrompts = [
    'What projects has Tanmay built?',
    'Explain his AI coding assistant.',
    'What are his strongest technical skills?',
    'Tell me about his experience at Ascendion.',
    'Show projects using React and Node.js.',
  ];

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  handleSend(): void {
    const text = this.userInput.trim();
    if (!text || this.assistantService.isLoading()) return;

    this.userInput = '';
    this.assistantService.sendMessage(text);
    if (this.inputField?.nativeElement) {
      this.inputField.nativeElement.style.height = 'auto';
    }
  }

  sendSuggestedPrompt(prompt: string): void {
    this.assistantService.sendMessage(prompt);
  }

  clearConversation(): void {
    this.assistantService.clearChat();
  }

  retry(): void {
    this.assistantService.retryLast();
  }

  handleActionClick(action: { label: string; action: 'navigate' | 'ask'; target: string }): void {
    if (action.action === 'navigate') {
      const el = document.getElementById(action.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (action.action === 'ask') {
      this.assistantService.sendMessage(action.target);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSend();
    }
  }

  autoGrow(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  }

  formatMessage(text: string): string {
    if (!text) return '';

    // Convert basic markdown safely
    let formatted = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Section jump links e.g. [View Projects](#projects)
      .replace(
        /\[(.*?)\]\((#.*?)\)/g,
        '<a href="$2" onclick="document.querySelector(\'$2\')?.scrollIntoView({behavior:\'smooth\'}); return false;">$1</a>'
      )
      // External links
      .replace(
        /\[(.*?)\]\((https?:\/\/.*?)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>'
      )
      // Linebreaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');

    return `<p>${formatted}</p>`;
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (_) {}
  }
}
