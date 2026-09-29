import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer" role="contentinfo">
      <div class="container footer-inner">
        <div class="footer-logo">
          <span class="logo-bracket">{{ '{' }}</span>
          <span class="logo-text">dev</span>
          <span class="logo-bracket">{{ '}' }}</span>
        </div>
        <p class="footer-tagline">Building the future, one commit at a time.</p>
        <div class="footer-links" role="list">
          <a href="https://github.com/PhantomPro" target="_blank" rel="noopener" aria-label="GitHub">GitHub</a>
          <span aria-hidden="true">·</span>
          <a href="https://www.linkedin.com/in/tanmay-basu-9310b01a1/" target="_blank" rel="noopener" aria-label="LinkedIn">LinkedIn</a>
          <span aria-hidden="true">·</span>
          <a href="mailto:basutanmay.007@gmail.com" aria-label="Email">Email</a>
        </div>
        <p class="footer-copy">
          &copy; {{ year }} Tanmay Basu · Built with Angular & Node.js
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: rgba(5, 5, 10, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-top: 1px solid var(--border-subtle);
      padding: 3rem 0 2rem;
      text-align: center;
    }
    .footer-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    .footer-logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      .logo-bracket { color: var(--accent-primary); }
      .logo-text { color: var(--text-primary); }
    }
    .footer-tagline {
      color: var(--text-tertiary);
      font-size: 0.9rem;
    }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      a {
        color: var(--text-secondary);
        font-size: 0.9rem;
        text-decoration: none;
        transition: color 0.2s;
        &:hover { color: var(--accent-primary); }
      }
      span { color: var(--text-tertiary); }
    }
    .footer-copy {
      color: var(--text-tertiary);
      font-size: 0.8rem;
    }
  `],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
