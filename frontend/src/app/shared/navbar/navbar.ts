import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  signal,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

interface NavLink {
  label: string;
  href: string;
  fragment?: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav
      class="navbar"
      [class.scrolled]="isScrolled()"
      [class.menu-open]="menuOpen()"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="container nav-inner">
        <!-- Logo -->
        <a class="logo" href="#home" (click)="closeMenu()" aria-label="Home">
          <span class="logo-bracket">{{ '{' }}</span>
          <span class="logo-text">dev</span>
          <span class="logo-bracket">{{ '}' }}</span>
          <span class="ai-badge-pill">AI</span>
        </a>

        <!-- Desktop Links -->
        <ul class="nav-links" role="list">
          @for (link of navLinks; track link.href) {
            <li>
              <a
                [href]="link.href"
                class="nav-link"
                [class.active]="activeSection() === link.href.replace('#', '')"
                (click)="scrollToSection($event, link.href)"
              >{{ link.label }}</a>
            </li>
          }
        </ul>

        <!-- Right actions -->
        <div class="nav-actions">
          <!-- Theme toggle -->
          <button
            class="icon-btn theme-toggle-btn"
            [class.ai-active]="themeService.currentTheme() === 'ai'"
            (click)="toggleTheme()"
            [attr.aria-label]="getThemeTitle()"
            [title]="getThemeTitle()"
          >
            @if (themeService.currentTheme() === 'ai') {
              <!-- AI Neural Sparkle / Chip Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="ai-sparkle-icon">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            } @else if (themeService.currentTheme() === 'dark') {
              <!-- Classic Dark Moon -->
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            } @else {
              <!-- Light Sun -->
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            }
          </button>

          <!-- GitHub -->
          <a
            href="https://github.com/PhantomPro"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            aria-label="GitHub Profile"
            title="GitHub"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>

          <!-- LinkedIn -->
          <a
            href="https://www.linkedin.com/in/tanmay-basu-9310b01a1/"
            target="_blank"
            rel="noopener noreferrer"
            class="icon-btn"
            aria-label="LinkedIn Profile"
            title="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>

          <!-- Resume -->
          <a
            [href]="resumeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-secondary btn-sm resume-btn"
            aria-label="View Resume (PDF)"
          >Resume ↗</a>

          <!-- Mobile hamburger -->
          <button
            class="hamburger"
            [class.open]="menuOpen()"
            (click)="toggleMenu()"
            aria-label="Toggle mobile menu"
            [attr.aria-expanded]="menuOpen()"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div class="mobile-menu" [class.open]="menuOpen()" role="dialog" aria-label="Mobile navigation">
        <ul role="list">
          @for (link of navLinks; track link.href) {
            <li>
              <a
                [href]="link.href"
                class="mobile-nav-link"
                [class.active]="activeSection() === link.href.replace('#', '')"
                (click)="scrollToSection($event, link.href); closeMenu()"
              >{{ link.label }}</a>
            </li>
          }
          <li class="mobile-resume">
            <a
              [href]="resumeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
              (click)="closeMenu()"
            >
              View Resume ↗
            </a>
          </li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    :host { display: block; }

    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      padding: 1.25rem 0;
      padding-top: max(1.25rem, env(safe-area-inset-top));
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &.scrolled {
        padding: 0.75rem 0;
        padding-top: max(0.75rem, env(safe-area-inset-top));
        background: var(--navbar-bg-scroll);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-bottom: 1px solid var(--border-subtle);
      }
    }

    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .logo {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.25rem;
      font-weight: 700;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.15rem;
      flex-shrink: 0;

      .logo-bracket { color: var(--accent-primary); }
      .logo-text { color: var(--text-primary); }
      &:hover .logo-text { color: var(--accent-primary); }

      .ai-badge-pill {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        padding: 0.15rem 0.45rem;
        border-radius: 6px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%);
        border: 1px solid var(--border-accent);
        color: var(--accent-primary);
        margin-left: 0.35rem;
        box-shadow: 0 0 8px var(--accent-glow);
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      list-style: none;

      @media (max-width: 900px) { display: none; }
    }

    .nav-link {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.45rem 0.65rem;
      border-radius: 8px;
      transition: all 0.2s ease;
      position: relative;
      white-space: nowrap;

      &:hover, &.active { color: var(--text-primary); background: var(--accent-subtle); }
      &.active {
        color: var(--accent-primary);
        font-weight: 600;
        background: var(--accent-subtle);
        box-shadow: 0 0 12px var(--accent-glow);
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      border-radius: 10px;
      border: 1px solid var(--border-subtle);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      touch-action: manipulation;

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-default);
        background: var(--accent-subtle);
        transform: translateY(-1px);
      }

      @media (max-width: 600px) { width: 38px; height: 38px; min-width: 38px; min-height: 38px; }
    }

    .theme-toggle-btn.ai-active {
      color: var(--accent-primary);
      border-color: var(--border-accent);
      background: var(--accent-subtle);
      box-shadow: 0 0 12px var(--accent-glow);

      .ai-sparkle-icon {
        animation: ai-pulse 3s ease-in-out infinite;
      }
    }

    @keyframes ai-pulse {
      0%, 100% { transform: scale(1) rotate(0deg); }
      50% { transform: scale(1.1) rotate(90deg); filter: drop-shadow(0 0 6px #A855F7); }
    }

    .resume-btn {
      @media (max-width: 900px) { display: none; }
    }

    /* Accessible 44px touch target Hamburger */
    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 44px;
      height: 44px;
      min-width: 44px;
      min-height: 44px;
      background: transparent;
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
      cursor: pointer;
      padding: 10px;
      touch-action: manipulation;

      @media (max-width: 900px) { display: flex; }

      span {
        display: block;
        width: 100%;
        height: 2px;
        background: var(--text-primary);
        border-radius: 2px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;
      }

      &.open {
        span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
      }
    }

    /* Mobile menu */
    .mobile-menu {
      display: none;
      position: absolute;
      top: 100%; left: 0; right: 0;
      background: var(--navbar-bg-scroll);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid var(--border-subtle);
      padding: 1rem 0;
      max-height: calc(100dvh - 80px);
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      opacity: 0;
      transform: translateY(-10px);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      @media (max-width: 900px) { display: block; }

      &.open {
        opacity: 1;
        transform: translateY(0);
        pointer-events: all;
      }

      ul { list-style: none; }

      .mobile-nav-link {
        display: block;
        padding: 0.875rem 2rem;
        font-size: 1rem;
        font-weight: 500;
        color: var(--text-secondary);
        text-decoration: none;
        transition: all 0.2s ease;
        border-left: 3px solid transparent;

        &:hover, &.active {
          color: var(--accent-primary);
          border-left-color: var(--accent-primary);
          background: var(--accent-subtle);
        }
      }

      .mobile-resume {
        padding: 1rem 2rem 0.5rem;
        a { width: 100%; justify-content: center; }
      }
    }
  `],
})
export class NavbarComponent implements OnInit, OnDestroy {
  protected readonly themeService = inject(ThemeService);

  readonly isScrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly activeSection = signal('home');
  readonly resumeUrl = 'resume.pdf';

  readonly navLinks: NavLink[] = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Achievements', href: '#achievements' },
    { label: 'Contact', href: '#contact' },
  ];

  private sectionIds = ['home', 'about', 'skills', 'experience', 'projects', 'achievements', 'contact'];

  ngOnInit(): void {
    // Initial active section calculation
    setTimeout(() => {
      this.updateActiveSection();
    }, 150);
  }

  ngOnDestroy(): void {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 30);
    this.updateActiveSection();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateActiveSection();
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getThemeTitle(): string {
    const t = this.themeService.currentTheme();
    if (t === 'ai') return 'Theme: AI Neural Mode (Click for Classic Dark)';
    if (t === 'dark') return 'Theme: Classic Dark (Click for Light)';
    return 'Theme: Light Mode (Click for AI Neural)';
  }

  scrollToSection(event: Event, href: string): void {
    event.preventDefault();
    const id = href.replace('#', '');
    this.activeSection.set(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    this.closeMenu();
  }

  private updateActiveSection(): void {
    const scrollY = window.scrollY;

    // At top of page
    if (scrollY < 120) {
      this.activeSection.set('home');
      return;
    }

    // Near bottom of page
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    if (window.innerHeight + scrollY >= docHeight - 80) {
      this.activeSection.set('contact');
      return;
    }

    const navbarThreshold = 140;
    let currentId = this.activeSection();

    // 1. Try to find the section currently spanning the threshold line
    let found = false;
    for (const id of this.sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= navbarThreshold && rect.bottom > navbarThreshold) {
          currentId = id;
          found = true;
          break;
        }
      }
    }

    // 2. If in a small divider gap between sections, pick the latest section whose top has passed
    if (!found) {
      for (let i = this.sectionIds.length - 1; i >= 0; i--) {
        const id = this.sectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= navbarThreshold) {
            currentId = id;
            break;
          }
        }
      }
    }

    if (currentId !== this.activeSection()) {
      this.activeSection.set(currentId);
    }
  }
}
