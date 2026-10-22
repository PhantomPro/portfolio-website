import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  HostListener,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService, ChatMessage } from '../../../../core/services/assistant.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Action Button (when closed) -->
    @if (!assistantService.isOpen()) {
      <button
        class="ai-fab-pill"
        (click)="assistantService.open()"
        aria-label="Open AI Assistant Chat"
        title="Ask Tanmay's AI Assistant"
      >
        <span class="fab-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="10" rx="2"/>
            <circle cx="12" cy="5" r="2"/>
            <path d="M12 7v4"/>
            <line x1="8" y1="16" x2="8" y2="16"/>
            <line x1="16" y1="16" x2="16" y2="16"/>
          </svg>
          <span class="fab-live-dot" aria-hidden="true"></span>
        </span>
        <span class="fab-text">Ask Tanmay AI</span>
        <span class="fab-sparkle" aria-hidden="true">✨</span>
      </button>
    }

    <!-- Floating Chat Window (when open) -->
    @if (assistantService.isOpen()) {
      <div
        class="ai-chat-drawer-container"
        role="dialog"
        aria-labelledby="ai-chat-title"
        aria-modal="true"
      >
        <!-- Chat Terminal Card -->
        <div class="chat-terminal-drawer">
          <!-- Terminal Header Bar -->
          <div class="terminal-header">
            <div class="header-left">
              <div class="header-robot-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="10" rx="2"/>
                  <circle cx="12" cy="5" r="2"/>
                  <path d="M12 7v4"/>
                  <line x1="8" y1="16" x2="8" y2="16"/>
                  <line x1="16" y1="16" x2="16" y2="16"/>
                </svg>
              </div>
              <div class="header-title-group">
                <h3 id="ai-chat-title" class="header-title">Ask Tanmay AI</h3>
                <div class="terminal-status">
                  <span class="status-pulse" aria-hidden="true"></span>
                  <span class="status-text">Gemini 3.5 Flash</span>
                  <span class="tier-badge">Live</span>
                </div>
              </div>
            </div>

            <div class="header-actions">
              <!-- Clear Chat -->
              <button
                class="btn-icon-header"
                (click)="clearConversation()"
                title="Clear conversation history"
                aria-label="Clear chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>

              <!-- Close Widget -->
              <button
                class="btn-icon-header btn-close-header"
                (click)="assistantService.close()"
                title="Close chat window (Esc)"
                aria-label="Close AI Assistant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <!-- Suggested Quick Prompts -->
          <div class="prompt-chips-bar" aria-label="Suggested questions">
            <span class="chips-label">Quick:</span>
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

          <!-- Message History Scroll Area -->
          <div
            #messagesContainer
            class="messages-scroll"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            @for (msg of assistantService.messages(); track msg.id) {
              <div
                class="message-row"
                [class.user-row]="msg.role === 'user'"
                [class.assistant-row]="msg.role === 'assistant'"
              >
                <!-- Avatar -->
                <div
                  class="avatar"
                  [class.user-avatar]="msg.role === 'user'"
                  [class.assistant-avatar]="msg.role === 'assistant'"
                  aria-hidden="true"
                >
                  @if (msg.role === 'assistant') {
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
                  } @else {
                    <span>You</span>
                  }
                </div>

                <!-- Bubble Content -->
                <div class="bubble-wrapper">
                  <div class="message-bubble" [class.user-bubble]="msg.role === 'user'">
                    <div class="message-text" [innerHTML]="formatMessage(msg.text)"></div>
                  </div>

                  <!-- Metadata footer -->
                  <div class="message-meta">
                    <span class="meta-time">{{ msg.timestamp | date:'shortTime' }}</span>
                    @if (msg.model && msg.role === 'assistant') {
                      <span class="meta-model">• {{ msg.model }}</span>
                    }
                  </div>

                  <!-- Suggested Action Pills -->
                  @if (msg.suggestedActions && msg.suggestedActions.length > 0) {
                    <div class="action-pills" role="group" aria-label="Related actions">
                      @for (act of msg.suggestedActions; track act.label) {
                        <button
                          class="action-pill"
                          (click)="handleActionClick(act)"
                        >
                          {{ act.label }} →
                        </button>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Loading Typing Indicator -->
            @if (assistantService.isLoading()) {
              <div class="message-row assistant-row">
                <div class="avatar assistant-avatar" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
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
                placeholder="Ask about Tanmay's experience, VS Code AI plugin, projects..."
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  }
                  <span class="send-text">Send</span>
                </button>
              </div>
            </div>

            <div class="input-hints">
              <span>Press <kbd>Enter</kbd> to send</span>
              <span class="api-disclaimer">Zero credentials exposed • Server-side Gemini</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Floating Action Pill Button */
    .ai-fab-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9998;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 1.25rem;
      border-radius: 9999px;
      border: 1px solid rgba(168, 85, 247, 0.45);
      background: rgba(10, 10, 24, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      color: #F8FAFC;
      font-size: 0.9rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      cursor: pointer;
      box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.6), 0 0 24px rgba(168, 85, 247, 0.35);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      touch-action: manipulation;

      &:hover {
        transform: translateY(-3px) scale(1.02);
        border-color: #A855F7;
        box-shadow: 0 12px 36px -4px rgba(0, 0, 0, 0.7), 0 0 32px rgba(168, 85, 247, 0.55);
        color: #FFFFFF;
      }

      .fab-icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #C084FC;
      }

      .fab-live-dot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10B981;
        box-shadow: 0 0 6px #10B981;
        animation: fab-dot-pulse 2s infinite ease-in-out;
      }

      .fab-sparkle {
        font-size: 0.85rem;
        animation: sparkle-rotate 3s infinite ease-in-out;
      }

      @media (max-width: 600px) {
        bottom: 20px;
        right: 16px;
        padding: 0.65rem 1rem;
        font-size: 0.85rem;
      }
    }

    @keyframes fab-dot-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }

    @keyframes sparkle-rotate {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.2) rotate(15deg); }
    }

    /* Floating Chat Drawer Container */
    .ai-chat-drawer-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 440px;
      max-width: calc(100vw - 32px);
      height: 620px;
      max-height: calc(100vh - 40px);
      animation: drawer-fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

      @media (max-width: 600px) {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        max-width: 100%;
        height: 92vh;
        max-height: 92vh;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    @keyframes drawer-fade-up {
      from {
        opacity: 0;
        transform: translateY(24px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .chat-terminal-drawer {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: 18px;
      border: 1px solid rgba(168, 85, 247, 0.4);
      background: rgba(8, 8, 20, 0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 36px rgba(168, 85, 247, 0.25);
      overflow: hidden;

      @media (max-width: 600px) {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }

    /* Terminal Header */
    .terminal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.15rem;
      background: rgba(15, 15, 32, 0.8);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .header-robot-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(6, 182, 212, 0.2));
      border: 1px solid rgba(168, 85, 247, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #C084FC;
    }

    .header-title-group {
      display: flex;
      flex-direction: column;
    }

    .header-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #F8FAFC;
      margin: 0;
      line-height: 1.2;
    }

    .terminal-status {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin-top: 2px;
    }

    .status-pulse {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px #10B981;
      animation: fab-dot-pulse 2s infinite ease-in-out;
    }

    .status-text {
      font-size: 0.72rem;
      font-weight: 600;
      color: #94A3B8;
    }

    .tier-badge {
      font-size: 0.62rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.1rem 0.4rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #10B981;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .btn-icon-header {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      background: transparent;
      color: #94A3B8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: #F8FAFC;
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }

    .btn-close-header:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
      border-color: rgba(239, 68, 68, 0.4);
    }

    /* Prompt Chips Bar */
    .prompt-chips-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: rgba(12, 12, 26, 0.6);
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      flex-shrink: 0;
      overflow: hidden;
    }

    .chips-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #A855F7;
      flex-shrink: 0;
    }

    .chips-scroll {
      display: flex;
      gap: 0.4rem;
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar { display: none; }
    }

    .prompt-chip {
      white-space: nowrap;
      padding: 0.3rem 0.7rem;
      border-radius: 9999px;
      border: 1px solid rgba(168, 85, 247, 0.3);
      background: rgba(168, 85, 247, 0.08);
      color: #CBD5E1;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        border-color: #A855F7;
        background: rgba(168, 85, 247, 0.22);
        color: #FFFFFF;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    /* Messages Scroll Area */
    .messages-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(168, 85, 247, 0.3) transparent;
    }

    .message-row {
      display: flex;
      gap: 0.65rem;
      max-width: 90%;
    }

    .user-row {
      margin-left: auto;
      flex-direction: row-reverse;
    }

    .assistant-row {
      margin-right: auto;
    }

    .avatar {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .assistant-avatar {
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      color: #FFFFFF;
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
    }

    .user-avatar {
      background: rgba(255, 255, 255, 0.12);
      color: #F8FAFC;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .bubble-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      max-width: 100%;
    }

    .message-bubble {
      padding: 0.75rem 0.95rem;
      border-radius: 12px;
      font-size: 0.85rem;
      line-height: 1.55;
      background: rgba(18, 18, 38, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #E2E8F0;
      word-break: break-word;

      ::ng-deep p {
        margin: 0 0 0.5rem 0;
        &:last-child { margin-bottom: 0; }
      }

      ::ng-deep strong {
        color: #F8FAFC;
        font-weight: 600;
      }

      ::ng-deep a {
        color: #38BDF8;
        text-decoration: underline;
        font-weight: 600;
        cursor: pointer;
        &:hover { color: #7DD3FC; }
      }
    }

    .user-bubble {
      background: linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(168, 85, 247, 0.3));
      border-color: rgba(168, 85, 247, 0.45);
      color: #FFFFFF;
    }

    .message-meta {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.68rem;
      color: #64748B;
      padding: 0 0.25rem;

      .user-row & {
        justify-content: flex-end;
      }
    }

    .action-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.25rem;
    }

    .action-pill {
      font-size: 0.72rem;
      font-weight: 600;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      border: 1px solid rgba(6, 182, 212, 0.35);
      background: rgba(6, 182, 212, 0.1);
      color: #38BDF8;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(6, 182, 212, 0.22);
        border-color: #38BDF8;
        color: #FFFFFF;
        transform: translateY(-1px);
      }
    }

    /* Typing indicator */
    .typing-bubble {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 0.85rem;
      color: #94A3B8;
      font-size: 0.75rem;
    }

    .typing-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #A855F7;
      animation: typing-jump 1.4s infinite ease-in-out;
      &:nth-child(2) { animation-delay: 0.2s; }
      &:nth-child(3) { animation-delay: 0.4s; }
    }

    @keyframes typing-jump {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40% { transform: translateY(-5px); opacity: 1; }
    }

    /* Error banner */
    .error-banner {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 0.9rem;
      border-radius: 10px;
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #F87171;
      font-size: 0.8rem;
    }

    .btn-retry {
      margin-left: auto;
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      border: 1px solid rgba(239, 68, 68, 0.4);
      background: rgba(239, 68, 68, 0.2);
      color: #FFFFFF;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      &:hover { background: rgba(239, 68, 68, 0.35); }
    }

    /* Input Container */
    .input-container {
      padding: 0.75rem 1rem 0.85rem;
      background: rgba(10, 10, 24, 0.8);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      flex-shrink: 0;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(15, 15, 30, 0.7);
      transition: all 0.2s ease;

      &:focus-within {
        border-color: #A855F7;
        box-shadow: 0 0 16px rgba(168, 85, 247, 0.25);
      }
    }

    .chat-input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      padding: 0.65rem 0.85rem;
      color: #F8FAFC;
      font-size: 0.85rem;
      line-height: 1.45;
      resize: none;
      font-family: inherit;

      &::placeholder {
        color: #64748B;
      }
    }

    .input-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.4rem 0.85rem 0.6rem;
    }

    .char-count {
      font-size: 0.68rem;
      color: #64748B;
      font-family: 'JetBrains Mono', monospace;
      &.warn { color: #F59E0B; }
    }

    .send-btn {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 8px;
      background: linear-gradient(135deg, #7C3AED, #A855F7);
      border: none;
      color: #FFFFFF;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        box-shadow: 0 0 12px rgba(168, 85, 247, 0.5);
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .input-hints {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.35rem;
      font-size: 0.65rem;
      color: #64748B;

      kbd {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        padding: 0.1rem 0.3rem;
        font-family: monospace;
      }

      @media (max-width: 600px) {
        span:first-child { display: none; }
      }
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

    /* Light Theme Tweaks */
    :host-context([data-theme="light"]) {
      .ai-fab-pill {
        background: rgba(255, 255, 255, 0.95);
        border-color: rgba(147, 51, 234, 0.4);
        color: #1E293B;
        box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.15), 0 0 20px rgba(147, 51, 234, 0.2);
        &:hover {
          background: #FFFFFF;
          color: #0F172A;
        }
      }

      .chat-terminal-drawer {
        background: rgba(255, 255, 255, 0.97);
        border-color: rgba(147, 51, 234, 0.3);
        box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.2), 0 0 24px rgba(147, 51, 234, 0.15);
      }

      .terminal-header {
        background: rgba(248, 250, 252, 0.9);
        border-bottom-color: rgba(226, 232, 240, 0.8);
      }

      .header-title { color: #0F172A; }
      .message-bubble {
        background: #F1F5F9;
        border-color: #E2E8F0;
        color: #1E293B;
        ::ng-deep strong { color: #0F172A; }
      }

      .input-container {
        background: rgba(248, 250, 252, 0.9);
        border-top-color: #E2E8F0;
      }

      .input-wrapper {
        background: #FFFFFF;
        border-color: #CBD5E1;
      }

      .chat-input { color: #0F172A; }
    }
  `],
})
export class AiAssistantComponent implements AfterViewChecked {
  protected readonly assistantService = inject(AssistantService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('inputField') private inputField!: ElementRef<HTMLTextAreaElement>;

  userInput = '';

  readonly suggestedPrompts = [
    'What projects has Tanmay built?',
    'Explain his VS Code AI coding assistant.',
    'What are his strongest technical skills?',
    'Tell me about his experience at Ascendion.',
    'Show projects using React and Node.js.',
    'Why should we hire Tanmay?',
  ];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.assistantService.isOpen()) {
      this.assistantService.close();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  handleSend(): void {
    const text = this.userInput.trim();
    if (!text || this.assistantService.isLoading()) return;

    this.userInput = '';
    this.assistantService.sendMessage(text);
  }

  sendSuggestedPrompt(prompt: string): void {
    if (this.assistantService.isLoading()) return;
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
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  }

  formatMessage(text: string): string {
    if (!text) return '';

    let formatted = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Section jump links e.g. [View Projects](#projects)
      .replace(
        /\[([^\]]+)\]\((#[^)]+)\)/g,
        '<a href="$2" onclick="document.querySelector(\'$2\')?.scrollIntoView({behavior:\'smooth\'}); return false;">$1</a>'
      )
      // External links e.g. [GitHub Repository](https://github.com/...)
      .replace(
        /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>'
      )
      // Clean up dangling bracket links e.g. [GitHub Repository] without URL
      .replace(/\[([^\]]+)\](?!\()/g, '<strong>$1</strong>')
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
