import { Component, OnInit, signal, inject, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Profile } from '../../../../core/models/profile.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="about" class="section about-section" aria-labelledby="about-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
            About Me
          </span>
          <h2 id="about-title">Who I Am</h2>
          <p>A software engineer passionate about building things that matter.</p>
        </div>

        <div class="about-grid animate-on-scroll" [class.in-view]="inView()">
          <!-- Left: Bio -->
          <div class="about-bio">
            <p class="lead-text">
              {{ profile()?.bio || 'I am a passionate software engineer who loves building scalable web applications and intelligent developer tools. I thrive at the intersection of clean code, beautiful interfaces, and real-world impact.' }}
            </p>

            <p class="bio-text">
              With a strong foundation in full stack development — from pixel-perfect Angular frontends to robust Node.js backends and MongoDB data layers — I approach every project with an engineering mindset focused on reliability, performance, and developer experience.
            </p>

            <p class="bio-text">
              Beyond writing code, I'm deeply interested in AI-powered developer tooling and how modern LLMs are reshaping the way we build software.
            </p>

            <div class="interest-tags">
              @for (interest of profile()?.interests || defaultInterests; track interest) {
                <span class="tech-badge">{{ interest }}</span>
              }
            </div>
          </div>

          <!-- Right: Info card -->
          <div class="info-card glass">
            <div class="info-item">
              <div class="info-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <div class="info-label">Location</div>
                <div class="info-value">{{ profile()?.location || '[YOUR LOCATION]' }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              </div>
              <div>
                <div class="info-label">Current Role</div>
                <div class="info-value">{{ profile()?.currentRole || 'Full Stack Developer @ Ascendion' }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M9 3h6v4H9z"/></svg>
              </div>
              <div>
                <div class="info-label">Company</div>
                <div class="info-value">
                  <a href="https://ascendion.com/" target="_blank" rel="noopener noreferrer" style="color:var(--accent-primary);text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;">
                    Ascendion
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                </div>
              </div>
            </div>

            <div class="info-item" *ngIf="profile()?.education && profile()!.education.length > 0">
              <div class="info-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div>
                <div class="info-label">Education</div>
                <div class="info-value">{{ profile()?.education[0]?.degree }}</div>
                <div class="info-sub">{{ profile()?.education[0]?.institution }}</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <div class="info-label">Experience</div>
                <div class="info-value">{{ profile()?.yearsOfExperience || '2' }}+ Years</div>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
              </div>
              <div>
                <div class="info-label">Core Stack</div>
                <div class="info-value mono" style="font-size:0.85rem;">React · Next.js · Node · FastAPI · AI</div>
              </div>
            </div>

            <a
              href="mailto:{{ profile()?.email || '[YOUR EMAIL]' }}"
              class="btn btn-primary"
              style="width:100%;justify-content:center;margin-top:0.5rem;"
              aria-label="Send email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section { background: transparent; }

    .about-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 4rem;
      align-items: start;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    .about-bio {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .lead-text {
      font-size: 1.2rem;
      color: var(--text-primary);
      line-height: 1.8;
      font-weight: 400;
    }

    .bio-text {
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.8;
    }

    .interest-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .info-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      position: sticky;
      top: 6rem;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-subtle);

      &:last-of-type { border-bottom: none; }
    }

    .info-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      background: var(--accent-subtle);
      border: 1px solid var(--border-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-primary);
      flex-shrink: 0;
    }

    .info-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.2rem;
    }

    .info-value {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .info-sub {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      margin-top: 0.15rem;
    }
  `],
})
export class AboutComponent implements OnInit, AfterViewInit {
  private portfolioService = inject(PortfolioService);
  @ViewChild('section') sectionRef?: ElementRef;

  readonly profile = signal<Profile | null>(null);
  readonly inView = signal(false);

  readonly defaultInterests = ['Full Stack Development', 'AI & Machine Learning', 'Developer Tools', 'Open Source'];

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.portfolioService.getProfile().subscribe({
      next: (res) => { if (res.success) this.profile.set(res.data); },
      error: () => {},
    });
  }

  ngAfterViewInit(): void {
    this.setupObserver();
  }

  private setupObserver(): void {
    const el = document.getElementById('about');
    if (!el) return;
    this.observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) this.inView.set(true); },
      { threshold: 0.15 }
    );
    this.observer.observe(el);
  }
}
