import { Component, OnInit, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceService } from '../../../../core/services/experience.service';
import { Experience } from '../../../../core/models/experience.model';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="experience" class="section experience-section" aria-labelledby="experience-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
            Work History
          </span>
          <h2 id="experience-title">Professional Experience</h2>
          <p>Where I've built real-world software that matters.</p>
        </div>

        <div class="timeline" role="list">
          @if (loading()) {
            @for (n of [1,2]; track n) {
              <div class="timeline-item">
                <div class="timeline-card skeleton" style="height:260px;"></div>
              </div>
            }
          }
          @for (exp of experiences(); track exp._id; let i = $index) {
            <div
              class="timeline-item animate-on-scroll"
              [class.in-view]="inView()"
              [style.transition-delay]="(i * 0.15) + 's'"
              role="listitem"
            >
              <!-- Timeline dot & line -->
              <div class="timeline-connector" aria-hidden="true">
                <div class="timeline-dot" [class.current]="exp.current">
                  @if (exp.current) {
                    <div class="dot-pulse"></div>
                  }
                </div>
                @if (i < experiences().length - 1) {
                  <div class="timeline-line"></div>
                }
              </div>

              <!-- Card -->
              <div class="timeline-card">
                <div class="card-header">
                  <div class="role-info">
                    <div class="role-meta">
                      @if (exp.companyUrl) {
                        <a [href]="exp.companyUrl" target="_blank" rel="noopener noreferrer" class="company-link" [attr.aria-label]="exp.company + ' website'">
                          <span class="company">{{ exp.company }}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </a>
                      } @else {
                        <span class="company">{{ exp.company }}</span>
                      }
                      @if (exp.current) {
                        <span class="current-badge">Current</span>
                      }
                    </div>
                    <h3 class="role-title">{{ exp.role }}</h3>
                    <div class="role-details">
                      <span class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {{ formatDate(exp.startDate) }} — {{ exp.current ? 'Present' : formatDate(exp.endDate!) }}
                      </span>
                      <span class="detail-separator" aria-hidden="true">·</span>
                      <span class="detail-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        {{ exp.location }}
                      </span>
                    </div>
                  </div>
                </div>

                <p class="role-description">{{ exp.description }}</p>

                <ul class="achievements-list" aria-label="Key achievements">
                  @for (achievement of exp.achievements; track $index) {
                    <li class="achievement-item">
                      <span class="achievement-bullet" aria-hidden="true">▸</span>
                      <span>{{ achievement }}</span>
                    </li>
                  }
                </ul>

                <div class="tech-tags" aria-label="Technologies used">
                  @for (tech of exp.technologies; track tech) {
                    <span class="tech-badge">{{ tech }}</span>
                  }
                </div>
              </div>
            </div>
          }

          @if (!loading() && experiences().length === 0) {
            <p class="empty-state">Experience data will appear here once configured.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .experience-section { background: transparent; }

    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .timeline-item {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 1.5rem;
      position: relative;

      @media (max-width: 600px) {
        grid-template-columns: 30px 1fr;
        gap: 1rem;
      }
    }

    .timeline-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 0.5rem;
    }

    .timeline-dot {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid var(--border-default);
      background: var(--bg-primary);
      position: relative;
      z-index: 1;
      flex-shrink: 0;
      transition: border-color 0.3s;

      &.current {
        border-color: var(--accent-primary);
        background: var(--accent-subtle);
        box-shadow: 0 0 12px var(--accent-glow);
      }
    }

    .dot-pulse {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid var(--accent-primary);
      opacity: 0.5;
      animation: pulse-ring 2s ease-out infinite;
    }

    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(1.6); opacity: 0; }
    }

    .timeline-line {
      flex: 1;
      width: 2px;
      background: var(--border-subtle);
      margin: 0.25rem 0;
      min-height: 2rem;
    }

    .timeline-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--border-accent);
        box-shadow: var(--shadow-accent);
      }

      @media (max-width: 600px) { padding: 1.25rem; }
    }

    .card-header { margin-bottom: 1.25rem; }

    .role-meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.35rem;
    }

    .company-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      text-decoration: none;
      color: var(--accent-primary);
      transition: all 0.2s ease;

      &:hover {
        opacity: 0.85;
        transform: translateX(1px);
        text-decoration: underline;
        text-underline-offset: 3px;
      }
    }

    .company {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-primary);
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.02em;
    }

    .current-badge {
      font-size: 0.7rem;
      font-weight: 700;
      color: #10B981;
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.25);
      padding: 0.15rem 0.5rem;
      border-radius: 100px;
    }

    .role-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .role-details {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .detail-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.83rem;
      color: var(--text-tertiary);
    }

    .detail-separator { color: var(--text-tertiary); }

    .role-description {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.75;
      margin-bottom: 1.25rem;
    }

    .achievements-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-bottom: 1.5rem;
    }

    .achievement-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .achievement-bullet {
      color: var(--accent-primary);
      flex-shrink: 0;
      margin-top: 0.1rem;
      font-size: 0.7rem;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .empty-state {
      text-align: center;
      color: var(--text-tertiary);
      padding: 3rem;
    }
  `],
})
export class ExperienceComponent implements OnInit, AfterViewInit {
  private experienceService = inject(ExperienceService);

  readonly experiences = signal<Experience[]>([]);
  readonly loading = signal(true);
  readonly inView = signal(false);

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.experienceService.getExperiences().subscribe({
      next: (res) => { if (res.success) this.experiences.set(res.data); this.loading.set(false); },
      error: () => { this.loading.set(false); },
    });
  }

  ngAfterViewInit(): void {
    const el = document.getElementById('experience');
    if (!el) return;
    this.observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) this.inView.set(true); },
      { threshold: 0.1 }
    );
    this.observer.observe(el);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${monthNames[parseInt(month || '1') - 1]} ${year}`;
  }
}
