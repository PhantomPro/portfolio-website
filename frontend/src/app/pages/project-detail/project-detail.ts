import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="project-detail-page">
      @if (loading()) {
        <div class="loading-page">
          <div class="spinner-large"></div>
        </div>
      } @else if (project()) {
        <!-- Header -->
        <div class="detail-header">
          <div class="grid-bg" aria-hidden="true"></div>
          <div class="header-glow" aria-hidden="true"></div>
          <div class="container">
            <a routerLink="/" fragment="projects" class="back-link" aria-label="Back to projects">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back to Projects
            </a>

            <div class="detail-meta">
              <span class="category-chip">{{ getCategoryLabel(project()!.category) }}</span>
              @if (project()!.featured) {
                <span class="featured-chip">⭐ Featured</span>
              }
            </div>

            <h1 class="detail-title">{{ project()!.title }}</h1>
            <p class="detail-subtitle">{{ project()!.description }}</p>

            <div class="detail-links">
              @if (project()!.githubUrl) {
                <a [href]="project()!.githubUrl" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" aria-label="View source code on GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  View Code
                </a>
              }
            </div>
          </div>
        </div>

        <!-- Showcase Image Banner -->
        @if (project()!.image) {
          <div class="container detail-hero-media">
            <div class="media-frame">
              <img [src]="getImageUrl(project()!.image)" [alt]="project()!.title + ' interface showcase'" class="detail-preview-img" />
            </div>
          </div>
        }

        <!-- Content -->
        <div class="container detail-content">
          <!-- Tech Stack -->
          <div class="detail-section">
            <h2 class="detail-section-title">Tech Stack</h2>
            <div class="tech-stack-grid">
              @for (tech of project()!.technologies; track tech) {
                <span class="tech-badge-lg">{{ tech }}</span>
              }
            </div>
          </div>

          <!-- Overview + Problem + Solution -->
          <div class="content-grid">
            @if (project()!.longDescription) {
              <div class="content-card">
                <div class="content-card-icon" aria-hidden="true">📋</div>
                <h3>Overview</h3>
                <p>{{ project()!.longDescription }}</p>
              </div>
            }
            @if (project()!.problem) {
              <div class="content-card">
                <div class="content-card-icon" aria-hidden="true">🎯</div>
                <h3>The Problem</h3>
                <p>{{ project()!.problem }}</p>
              </div>
            }
            @if (project()!.solution) {
              <div class="content-card">
                <div class="content-card-icon" aria-hidden="true">💡</div>
                <h3>The Solution</h3>
                <p>{{ project()!.solution }}</p>
              </div>
            }
          </div>

          <!-- System Architecture -->
          @if (project()!.architecture) {
            <div class="detail-section">
              <h2 class="detail-section-title">System Architecture & Technical Design</h2>
              <div class="architecture-card">
                <div class="arch-badge">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
                  Architecture Overview
                </div>
                <p class="arch-description">{{ project()!.architecture }}</p>
              </div>
            </div>
          }

          <!-- Key Features -->
          @if (project()!.features && project()!.features.length > 0) {
            <div class="detail-section">
              <h2 class="detail-section-title">Key Features</h2>
              <ul class="features-list" aria-label="Key features">
                @for (feature of project()!.features; track $index) {
                  <li class="feature-item">
                    <span class="feature-check" aria-hidden="true">✓</span>
                    {{ feature }}
                  </li>
                }
              </ul>
            </div>
          }

          <!-- Challenges & Learnings -->
          <div class="two-col-grid">
            @if (project()!.challenges && project()!.challenges!.length > 0) {
              <div class="detail-section">
                <h2 class="detail-section-title">Challenges</h2>
                <ul class="detail-list" aria-label="Technical challenges">
                  @for (c of project()!.challenges!; track $index) {
                    <li>
                      <span aria-hidden="true">⚡</span>{{ c }}
                    </li>
                  }
                </ul>
              </div>
            }
            @if (project()!.learnings && project()!.learnings!.length > 0) {
              <div class="detail-section">
                <h2 class="detail-section-title">What I Learned</h2>
                <ul class="detail-list" aria-label="Key learnings">
                  @for (l of project()!.learnings!; track $index) {
                    <li>
                      <span aria-hidden="true">🧠</span>{{ l }}
                    </li>
                  }
                </ul>
              </div>
            }
          </div>

          <!-- Results -->
          @if (project()!.results) {
            <div class="results-card">
              <div class="results-icon" aria-hidden="true">📈</div>
              <div>
                <h3>Results & Impact</h3>
                <p>{{ project()!.results }}</p>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="not-found">
          <h2>Project not found</h2>
          <a routerLink="/" class="btn btn-primary">← Back to Portfolio</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .project-detail-page { padding-top: 80px; min-height: 100vh; }

    .loading-page {
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner-large {
      width: 50px; height: 50px;
      border: 3px solid var(--border-subtle);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .detail-header {
      position: relative;
      padding: 4rem 0;
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-subtle);
      overflow: hidden;
    }

    .header-glow {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 700px; height: 400px;
      background: radial-gradient(ellipse at center, rgba(124,111,247,0.12) 0%, transparent 70%);
      pointer-events: none;
    }

    .container { position: relative; z-index: 1; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-decoration: none;
      margin-bottom: 1.5rem;
      transition: all 0.2s;

      &:hover { color: var(--accent-primary); gap: 0.75rem; }
    }

    .detail-meta {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .category-chip, .featured-chip {
      display: inline-flex;
      align-items: center;
      padding: 0.3rem 0.875rem;
      border-radius: 100px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .category-chip {
      background: var(--accent-subtle);
      border: 1px solid var(--border-accent);
      color: var(--accent-primary);
    }

    .featured-chip {
      background: rgba(251,191,36,0.1);
      border: 1px solid rgba(251,191,36,0.3);
      color: #FBBF24;
    }

    .detail-title {
      font-size: clamp(2rem, 4vw, 3.5rem);
      font-weight: 900;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .detail-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      max-width: 700px;
      line-height: 1.75;
      margin-bottom: 2rem;
    }

    .detail-links { display: flex; gap: 1rem; flex-wrap: wrap; }
    
    .detail-hero-media {
      margin-top: -2.5rem;
      position: relative;
      z-index: 2;

      .media-frame {
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid var(--border-default);
        box-shadow: 0 25px 60px rgba(0,0,0,0.6), var(--shadow-accent);
        background: var(--bg-card);
        aspect-ratio: 16 / 9;
        max-height: 480px;

        .detail-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }
      }
    }

    /* Content */
    .detail-content {
      padding-top: 3rem;
      padding-bottom: 6rem;
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
    }

    .detail-section-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .tech-stack-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }

    .tech-badge-lg {
      padding: 0.5rem 1.1rem;
      background: var(--accent-subtle);
      border: 1px solid var(--border-accent);
      border-radius: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--accent-primary);
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .content-card {
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;

      .content-card-icon { font-size: 1.75rem; margin-bottom: 0.75rem; }
      h3 { font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem; }
      p { color: var(--text-secondary); line-height: 1.75; }
    }

    .architecture-card {
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-left: 4px solid var(--accent-primary);
      border-radius: 14px;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .arch-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--accent-primary);
      }

      .arch-description {
        color: var(--text-secondary);
        font-size: 1.05rem;
        line-height: 1.8;
      }
    }

    .features-list {
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 0.75rem;
    }

    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
      padding: 0.75rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 10px;
    }

    .feature-check {
      color: #10B981;
      font-weight: 700;
      flex-shrink: 0;
    }

    .two-col-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
    }

    .detail-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      li {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-size: 0.92rem;
        color: var(--text-secondary);
        line-height: 1.6;

        span { flex-shrink: 0; margin-top: 0.1rem; }
      }
    }

    .results-card {
      display: flex;
      align-items: flex-start;
      gap: 1.5rem;
      padding: 2rem;
      background: linear-gradient(135deg, rgba(124,111,247,0.08) 0%, rgba(34,211,238,0.05) 100%);
      border: 1px solid var(--border-accent);
      border-radius: 16px;

      .results-icon { font-size: 2.5rem; flex-shrink: 0; }
      h3 { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
      p { color: var(--text-secondary); line-height: 1.75; }
    }

    .not-found {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      text-align: center;
    }
  `],
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService);

  readonly project = signal<Project | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['']); return; }

    this.projectService.getProjectById(id).subscribe({
      next: (res) => {
        if (res.success) this.project.set(res.data);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); },
    });
  }

  getImageUrl(image?: string): string {
    if (!image) return '';
    return image.startsWith('/') ? image.substring(1) : image;
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'full-stack': 'Full Stack',
      frontend: 'Frontend',
      backend: 'Backend',
      ai: 'AI / ML',
      other: 'Other',
    };
    return labels[category] || category;
  }
}
