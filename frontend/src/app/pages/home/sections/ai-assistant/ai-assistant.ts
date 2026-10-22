import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssistantService, ChatMessage } from '../../../../core/services/assistant.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
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
                  <span class="status-text">Online</span>
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
            (scroll)="onScroll()"
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
                <div class="message-bubble typing-bubble" aria-label="Tanmay is cooking">
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-label">Tanmay is cooking...</span>
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

          <!-- Jump to bottom button -->
          @if (isScrolledUp()) {
            <button
              class="btn-scroll-bottom"
              (click)="scrollToBottom(true)"
              aria-label="Scroll to latest messages"
              title="Jump to latest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
              <span>Latest</span>
            </button>
          }

          <!-- Chat Input Area -->
          <div class="input-container">
            <div class="input-wrapper">
              <textarea
                #inputField
                rows="1"
                class="chat-input"
                placeholder="Ask anything about Tanmay..."
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

    @keyframes fab-dot-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
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
      overscroll-behavior: contain;
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
      min-height: 0;
      display: flex;
      flex-direction: column;
      border-radius: 18px;
      border: 1px solid rgba(168, 85, 247, 0.4);
      background: rgba(8, 8, 20, 0.95);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.85), 0 0 36px rgba(168, 85, 247, 0.25);
      overflow: hidden;
      overscroll-behavior: contain;

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
      flex: 1 1 0px;
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
      overflow-anchor: none;
      scroll-behavior: smooth;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      scrollbar-width: thin;
      scrollbar-color: rgba(168, 85, 247, 0.4) transparent;

      &::-webkit-scrollbar {
        width: 6px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(168, 85, 247, 0.35);
        border-radius: 9999px;
        &:hover {
          background: rgba(168, 85, 247, 0.65);
        }
      }
    }

    /* Jump to Bottom Button */
    .btn-scroll-bottom {
      position: absolute;
      bottom: 84px;
      right: 18px;
      z-index: 20;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.65rem;
      border-radius: 9999px;
      background: rgba(15, 15, 30, 0.95);
      border: 1px solid rgba(168, 85, 247, 0.45);
      color: #F8FAFC;
      font-size: 0.72rem;
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45), 0 0 12px rgba(168, 85, 247, 0.25);
      cursor: pointer;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      animation: drawer-fade-up 0.2s ease-out;

      &:hover {
        background: #7C3AED;
        border-color: #A855F7;
        color: #FFFFFF;
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(124, 58, 237, 0.45);
      }
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
      padding: 0.75rem 0.85rem;
      color: #F8FAFC;
      font-size: 0.88rem;
      line-height: 1.45;
      min-height: 40px;
      resize: none;
      font-family: inherit;

      &::placeholder {
        color: #94A3B8;
        opacity: 0.9;
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

    /* Light Theme Optimization */
    :host-context([data-theme="light"]) {
      .chat-terminal-drawer {
        background: rgba(255, 255, 255, 0.98);
        border-color: rgba(147, 51, 234, 0.25);
        box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.18), 0 0 32px rgba(147, 51, 234, 0.1);
      }

      .terminal-header {
        background: rgba(248, 250, 252, 0.95);
        border-bottom-color: rgba(226, 232, 240, 0.9);
      }

      .header-robot-icon {
        background: linear-gradient(135deg, rgba(147, 51, 234, 0.12), rgba(6, 182, 212, 0.12));
        border-color: rgba(147, 51, 234, 0.25);
        color: #7C3AED;
      }

      .header-title {
        color: #0F172A;
      }

      .status-pulse {
        background: #059669;
        box-shadow: 0 0 6px #10B981;
      }

      .status-text {
        color: #475569;
      }

      .tier-badge {
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.25);
        color: #047857;
      }

      .btn-icon-header {
        border-color: rgba(203, 213, 225, 0.8);
        color: #64748B;

        &:hover {
          color: #0F172A;
          background: #F1F5F9;
          border-color: #94A3B8;
        }
      }

      .btn-close-header:hover {
        background: #FEE2E2;
        color: #DC2626;
        border-color: #FCA5A5;
      }

      .prompt-chips-bar {
        background: rgba(248, 250, 252, 0.85);
        border-bottom-color: rgba(226, 232, 240, 0.9);
      }

      .chips-label {
        color: #7C3AED;
      }

      .prompt-chip {
        background: #FFFFFF;
        border-color: rgba(147, 51, 234, 0.25);
        color: #475569;
        box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);

        &:hover:not(:disabled) {
          border-color: #7C3AED;
          background: rgba(147, 51, 234, 0.08);
          color: #6D28D9;
        }
      }

      .messages-scroll {
        scrollbar-color: rgba(147, 51, 234, 0.4) transparent;

        &::-webkit-scrollbar-thumb {
          background: rgba(147, 51, 234, 0.3);
          &:hover {
            background: rgba(147, 51, 234, 0.6);
          }
        }
      }

      .btn-scroll-bottom {
        background: #FFFFFF;
        border-color: rgba(147, 51, 234, 0.3);
        color: #1E293B;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1), 0 0 10px rgba(147, 51, 234, 0.15);

        &:hover {
          background: #7C3AED;
          border-color: #7C3AED;
          color: #FFFFFF;
        }
      }

      .assistant-avatar {
        background: linear-gradient(135deg, #7C3AED, #9333EA);
        color: #FFFFFF;
        box-shadow: 0 4px 10px rgba(124, 58, 237, 0.3);
      }

      .user-avatar {
        background: #0F172A;
        color: #FFFFFF;
        border-color: #1E293B;
      }

      .assistant-row .message-bubble {
        background: #F8FAFC;
        border-color: #E2E8F0;
        color: #1E293B;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);

        ::ng-deep strong {
          color: #0F172A;
        }

        ::ng-deep a {
          color: #7C3AED;
          &:hover { color: #6D28D9; }
        }

        ::ng-deep code {
          background: #F1F5F9;
          border: 1px solid #E2E8F0;
          color: #7C3AED;
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
        }

        ::ng-deep pre {
          background: #0F172A;
          color: #F8FAFC;
          border: 1px solid #1E293B;
          border-radius: 8px;
        }

        ::ng-deep blockquote {
          border-left-color: #7C3AED;
          color: #475569;
        }
      }

      .user-row .message-bubble {
        background: linear-gradient(135deg, #7C3AED, #9333EA);
        border: 1px solid rgba(124, 58, 237, 0.5);
        color: #FFFFFF;
        box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);

        ::ng-deep strong {
          color: #FFFFFF;
        }

        ::ng-deep a {
          color: #F0ABFC;
        }
      }

      .assistant-row .message-time,
      .user-row .message-time {
        color: #94A3B8;
      }

      .action-pill {
        background: rgba(2, 132, 199, 0.08);
        border-color: rgba(2, 132, 199, 0.3);
        color: #0284C7;

        &:hover {
          background: rgba(2, 132, 199, 0.18);
          border-color: #0284C7;
          color: #0369A1;
        }
      }

      .typing-bubble {
        background: #F8FAFC;
        border-color: #E2E8F0;
        color: #64748B;
      }

      .typing-dot {
        background: #7C3AED;
      }

      .error-banner {
        background: #FEF2F2;
        border-color: #FECACA;
        color: #DC2626;
      }

      .btn-retry {
        background: #DC2626;
        color: #FFFFFF;
        border-color: #B91C1C;
        &:hover { background: #B91C1C; }
      }

      .input-container {
        background: rgba(248, 250, 252, 0.95);
        border-top-color: #E2E8F0;
      }

      .input-wrapper {
        background: #FFFFFF;
        border-color: #CBD5E1;
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);

        &:focus-within {
          border-color: #7C3AED;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
        }
      }

      .chat-input {
        color: #0F172A;
        &::placeholder {
          color: #94A3B8;
        }
      }

      .char-count {
        color: #94A3B8;
        &.warn { color: #D97706; }
      }

      .send-btn {
        background: linear-gradient(135deg, #7C3AED, #9333EA);
        color: #FFFFFF;

        &:hover:not(:disabled) {
          box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);
        }
      }

      .input-hints {
        color: #94A3B8;

        kbd {
          background: #F1F5F9;
          border-color: #CBD5E1;
          color: #475569;
        }
      }
    }
  `],
})
export class AiAssistantComponent implements AfterViewChecked {
  protected readonly assistantService = inject(AssistantService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('inputField') private inputField!: ElementRef<HTMLTextAreaElement>;

  userInput = '';

  readonly isScrolledUp = signal(false);
  private prevMessageCount = 0;
  private prevLoading = false;

  readonly suggestedPrompts = [
    'What projects has Tanmay built?',
    'Explain his VS Code AI coding assistant.',
    'What are his strongest technical skills?',
    'Tell me about his work experience.',
    'Show projects using React and Node.js.',
    'Why should we hire Tanmay?',
  ];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.assistantService.isOpen()) {
      this.assistantService.close();
    }
  }

  onScroll(): void {
    if (!this.messagesContainer?.nativeElement) return;
    const { scrollTop, scrollHeight, clientHeight } = this.messagesContainer.nativeElement;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    this.isScrolledUp.set(distanceFromBottom > 60);
  }

  ngAfterViewChecked(): void {
    const currentCount = this.assistantService.messages().length;
    const currentLoading = this.assistantService.isLoading();
    if (currentCount !== this.prevMessageCount || currentLoading !== this.prevLoading) {
      this.prevMessageCount = currentCount;
      this.prevLoading = currentLoading;
      if (!this.isScrolledUp()) {
        this.scrollToBottom();
      }
    }
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

  scrollToBottom(force = false): void {
    if (force) {
      this.isScrolledUp.set(false);
    }
    setTimeout(() => {
      try {
        if (this.messagesContainer?.nativeElement) {
          this.messagesContainer.nativeElement.scrollTo({
            top: this.messagesContainer.nativeElement.scrollHeight,
            behavior: 'smooth',
          });
        }
      } catch (_) {}
    }, 40);
  }
}
