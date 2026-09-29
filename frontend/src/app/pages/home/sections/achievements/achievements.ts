import { Component, OnInit, AfterViewInit, signal, inject, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Achievement } from '../../../../core/models/profile.model';

interface AchievementDisplay extends Achievement {
  current: number;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="achievements" class="section achievements-section" aria-labelledby="achievements-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
            By The Numbers
          </span>
          <h2 id="achievements-title">Impact & Milestones</h2>
        </div>

        <div class="metrics-grid">
          @for (achievement of displayAchievements(); track achievement._id; let i = $index) {
            <div
              class="metric-card animate-on-scroll in-view"
              [style.transition-delay]="(i * 0.1) + 's'"
              #metricCard
            >
              <div class="metric-icon" aria-hidden="true">{{ getIcon(achievement.icon) }}</div>
              <div class="metric-value" [attr.aria-label]="achievement.value + achievement.suffix + ' ' + achievement.label">
                <span class="metric-prefix">{{ achievement.prefix }}</span>
                <span class="metric-number">{{ achievement.current | number }}</span>
                <span class="metric-suffix">{{ achievement.suffix }}</span>
              </div>
              <div class="metric-label">{{ achievement.label }}</div>
              <div class="metric-glow" aria-hidden="true"></div>
            </div>
          }
        </div>
      </div>

      <!-- Background visual -->
      <div class="section-bg" aria-hidden="true">
        <div class="bg-orb orb-1"></div>
        <div class="bg-orb orb-2"></div>
      </div>
    </section>
  `,
  styles: [`
    .achievements-section {
      background: transparent;
      position: relative;
      overflow: hidden;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      position: relative;
      z-index: 1;

      @media (max-width: 640px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 420px) { grid-template-columns: 1fr; }
    }

    .metric-card {
      position: relative;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 2.5rem 2rem;

      @media (max-width: 480px) { padding: 1.75rem 1.25rem; }
      text-align: center;
      overflow: hidden;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: var(--border-accent);
        transform: translateY(-6px);
        box-shadow: var(--shadow-accent);

        .metric-glow { opacity: 1; }
      }
    }

    .metric-icon {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .metric-value {
      display: flex;
      align-items: baseline;
      justify-content: center;
      gap: 0.1rem;
      margin-bottom: 0.75rem;
      font-weight: 900;
      line-height: 1;
    }

    .metric-number {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      background: var(--gradient-accent-text);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .metric-prefix, .metric-suffix {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--accent-primary);
    }

    .metric-label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      letter-spacing: 0.02em;
    }

    .metric-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 100%, var(--accent-glow) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    /* BG orbs */
    .section-bg { position: absolute; inset: 0; pointer-events: none; }

    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.08;

      &.orb-1 {
        width: 500px; height: 500px;
        background: var(--accent-primary);
        top: -100px; left: -100px;
      }
      &.orb-2 {
        width: 400px; height: 400px;
        background: var(--cyan);
        bottom: -100px; right: -100px;
      }
    }
  `],
})
export class AchievementsComponent implements OnInit, AfterViewInit {
  private portfolioService = inject(PortfolioService);

  readonly displayAchievements = signal<AchievementDisplay[]>([
    { _id: '1', label: 'Problems Solved', value: 350, suffix: '+', prefix: '', icon: 'code', order: 1, current: 350 },
    { _id: '2', label: 'Certifications', value: 2, suffix: '', prefix: '', icon: 'award', order: 2, current: 2 },
    { _id: '3', label: 'HackerRank C++', value: 5, suffix: '★', prefix: '', icon: 'star', order: 3, current: 5 },
    { _id: '4', label: 'Academic CGPA', value: 8, suffix: '/10', prefix: '', icon: 'layers', order: 4, current: 8 },
  ]);
  readonly inView = signal(true);

  private observer?: IntersectionObserver;
  private countUpStarted = false;

  ngOnInit(): void {
    this.portfolioService.getAchievements().subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.length > 0) {
          this.displayAchievements.set(
            res.data.map((a) => ({ ...a, current: a.value }))
          );
        }
      },
      error: () => {},
    });
  }

  ngAfterViewInit(): void {
    const el = document.getElementById('achievements');
    if (!el) return;
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.inView.set(true);
          if (!this.countUpStarted) {
            this.countUpStarted = true;
            this.startCountUp();
          }
        }
      },
      { threshold: 0.05 }
    );
    this.observer.observe(el);
  }

  private startCountUp(): void {
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = this.easeOutCubic(step / steps);
      this.displayAchievements.update((achievements) =>
        achievements.map((a) => ({
          ...a,
          current: Math.round(a.value * progress),
        }))
      );
      if (step >= steps) {
        clearInterval(interval);
        this.displayAchievements.update((achievements) =>
          achievements.map((a) => ({ ...a, current: a.value }))
        );
      }
    }, stepTime);
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  getIcon(iconName?: string): string {
    const iconMap: { [key: string]: string } = {
      code: '💻',
      layers: '🧩',
      calendar: '📅',
      star: '⭐',
      users: '👥',
      award: '🏆',
      zap: '⚡',
    };
    return iconMap[iconName || ''] || '📊';
  }
}
