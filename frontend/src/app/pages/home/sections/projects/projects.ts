import { Component, OnInit, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../../../core/services/project.service';
import { Project } from '../../../../core/models/project.model';

interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="projects" class="section projects-section" aria-labelledby="projects-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
            Featured Work
          </span>
          <h2 id="projects-title">Projects That Matter</h2>
          <p>Real engineering work — from concept to production.</p>
        </div>

        <!-- Featured projects -->
        @if (featuredProjects().length > 0) {
          <div class="featured-section">
            <div class="featured-grid">
              @for (project of featuredProjects(); track project._id; let i = $index) {
                <div
                  class="featured-card animate-on-scroll"
                  [class.in-view]="inView()"
                  [style.transition-delay]="(i * 0.15) + 's'"
                  (click)="openProject(project)"
                  role="button"
                  tabindex="0"
                  [attr.aria-label]="'View ' + project.title + ' project details'"
                  (keydown.enter)="openProject(project)"
                  (keydown.space)="$event.preventDefault(); openProject(project)"
                >
                  <!-- Image -->
                  <div class="featured-image">
                    @if (project.image) {
                      <img [src]="getImageUrl(project.image)" [alt]="project.title + ' UI preview'" class="project-img" loading="lazy" />
                    } @else {
                      <div class="image-placeholder" [style.background]="getProjectGradient(i)">
                        <span class="image-icon">{{ getProjectEmoji(project.category) }}</span>
                      </div>
                    }
                    <div class="image-overlay">
                      <span class="view-case-study">View Case Study →</span>
                    </div>
                    <div class="category-chip">{{ getCategoryLabel(project.category) }}</div>
                  </div>

                  <!-- Content -->
                  <div class="featured-content">
                    <h3 class="project-title">{{ project.title }}</h3>
                    <p class="project-description">{{ project.description }}</p>

                    <div class="tech-tags" aria-label="Technologies used">
                      @for (tech of project.technologies.slice(0, 5); track tech) {
                        <span class="tech-badge">{{ tech }}</span>
                      }
                      @if (project.technologies.length > 5) {
                        <span class="tech-badge">+{{ project.technologies.length - 5 }}</span>
                      }
                    </div>

                    <div class="project-actions">
                      @if (project.githubUrl) {
                        <a
                          [href]="project.githubUrl"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="btn btn-secondary btn-sm"
                          (click)="$event.stopPropagation()"
                          [attr.aria-label]="'GitHub repository for ' + project.title"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          GitHub
                        </a>
                      }
                      <button
                        class="btn btn-ghost btn-sm"
                        (click)="openProject(project)"
                        [attr.aria-label]="'View case study for ' + project.title"
                      >Case Study →</button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- More Projects -->
        @if (otherProjects().length > 0) {
          <div class="more-projects">
            <h3 class="more-title">More Projects</h3>

            <!-- Filter tabs -->
            <div class="filter-tabs" role="tablist" aria-label="Filter projects by category">
              @for (f of filters; track f.value) {
                <button
                  class="filter-tab"
                  [class.active]="activeFilter() === f.value"
                  (click)="setFilter(f.value)"
                  role="tab"
                  [attr.aria-selected]="activeFilter() === f.value"
                >{{ f.label }}</button>
              }
            </div>

            <div class="projects-grid">
              @for (project of filteredOtherProjects(); track project._id; let i = $index) {
                <div
                  class="project-card"
                  (click)="openProject(project)"
                  role="button"
                  tabindex="0"
                  [attr.aria-label]="'View ' + project.title + ' project'"
                  (keydown.enter)="openProject(project)"
                >
                  <div class="project-card-image">
                    @if (project.image) {
                      <img [src]="getImageUrl(project.image)" [alt]="project.title + ' thumbnail'" class="card-thumb-img" loading="lazy" />
                    } @else {
                      <div class="card-placeholder" [style.background]="getProjectGradient(i)">
                        <span class="card-emoji">{{ getProjectEmoji(project.category) }}</span>
                      </div>
                    }
                    <div class="card-category">{{ getCategoryLabel(project.category) }}</div>
                  </div>
                  <div class="project-card-body">
                    <h4 class="project-card-title">{{ project.title }}</h4>
                    <p class="project-card-desc">{{ project.description }}</p>
                    <div class="project-card-tech">
                      @for (tech of project.technologies.slice(0, 4); track tech) {
                        <span class="tech-badge">{{ tech }}</span>
                      }
                    </div>
                    <div class="project-card-links">
                      @if (project.githubUrl) {
                        <a [href]="project.githubUrl" target="_blank" rel="noopener" (click)="$event.stopPropagation()" class="card-link" [attr.aria-label]="'GitHub for ' + project.title">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                          Code
                        </a>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (loading()) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading projects…</p>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .projects-section { background: transparent; }

    /* Featured grid */
    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(100%, 520px), 1fr));
      gap: 2rem;
      margin-bottom: 5rem;

      @media (max-width: 640px) { grid-template-columns: 1fr; }
    }

    .featured-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      position: relative;

      &:hover {
        border-color: var(--border-accent);
        transform: translateY(-8px);
        box-shadow: var(--shadow-xl), var(--shadow-accent);

        .featured-image .project-img { transform: scale(1.05); }
        .featured-image .image-placeholder { transform: scale(1.04); }
        .image-overlay { opacity: 1; }
        .project-actions .btn-ghost { gap: 0.75rem; }
      }

      &:focus-visible {
        outline: 2px solid var(--accent-primary);
        outline-offset: 3px;
      }
    }

    .featured-image {
      position: relative;
      height: 250px;
      overflow: hidden;
      background: var(--bg-surface);

      .project-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        display: block;
      }

      .image-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.4s ease;
      }

      .image-icon { font-size: 5rem; filter: drop-shadow(0 4px 16px rgba(0,0,0,0.3)); }
    }

    .image-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(2px);

      .view-case-study {
        color: #fff;
        font-weight: 600;
        font-size: 1rem;
        letter-spacing: 0.02em;
      }
    }

    .category-chip {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.3rem 0.75rem;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 100px;
      font-size: 0.72rem;
      font-weight: 600;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .featured-content {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      flex: 1;
    }

    .project-title {
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .project-description {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.7;
      flex: 1;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .project-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    /* More projects */
    .more-projects { margin-top: 1rem; }

    .more-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }

    .filter-tab {
      padding: 0.45rem 1rem;
      border: 1px solid var(--border-default);
      background: transparent;
      color: var(--text-secondary);
      border-radius: 100px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Inter', sans-serif;

      &:hover { color: var(--text-primary); border-color: var(--border-strong); }
      &.active { background: var(--accent-subtle); border-color: var(--accent-primary); color: var(--accent-primary); }
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;

      @media (max-width: 640px) { grid-template-columns: 1fr; }
    }

    .project-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        border-color: var(--border-accent);
        transform: translateY(-4px);
        box-shadow: var(--shadow-accent);

        .card-thumb-img { transform: scale(1.06); }
      }

      &:focus-visible {
        outline: 2px solid var(--accent-primary);
        outline-offset: 3px;
      }
    }

    .project-card-image {
      height: 160px;
      overflow: hidden;
      position: relative;
      background: var(--bg-surface);

      .card-thumb-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        transition: transform 0.4s ease;
        display: block;
      }

      .card-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .card-emoji { font-size: 2.5rem; }
      .card-category {
        position: absolute;
        top: 0.75rem; right: 0.75rem;
        padding: 0.2rem 0.6rem;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.15);
        border-radius: 100px;
        font-size: 0.7rem;
        color: rgba(255,255,255,0.8);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .project-card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .project-card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .project-card-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-card-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .project-card-links {
      display: flex;
      gap: 1rem;
    }

    .card-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;

      &:hover { color: var(--accent-primary); }
    }

    /* Loading */
    .loading-state {
      text-align: center;
      padding: 4rem;
      color: var(--text-tertiary);

      .spinner {
        width: 40px; height: 40px;
        border: 3px solid var(--border-subtle);
        border-top-color: var(--accent-primary);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto 1rem;
      }
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ProjectsComponent implements OnInit, AfterViewInit {
  private projectService = inject(ProjectService);
  private router = inject(Router);

  readonly featuredProjects = signal<Project[]>([]);
  readonly otherProjects = signal<Project[]>([]);
  readonly filteredOtherProjects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly inView = signal(false);
  readonly activeFilter = signal('all');

  readonly filters: FilterOption[] = [
    { label: 'All', value: 'all' },
    { label: 'Full Stack', value: 'full-stack' },
    { label: 'Frontend', value: 'frontend' },
    { label: 'Backend', value: 'backend' },
    { label: 'AI', value: 'ai' },
    { label: 'Other', value: 'other' },
  ];

  private observer?: IntersectionObserver;

  ngOnInit(): void {
    this.projectService.getProjects().subscribe({
      next: (res) => {
        if (res.success) {
          const featured = res.data.filter((p) => p.featured);
          const others = res.data.filter((p) => !p.featured);
          this.featuredProjects.set(featured);
          this.otherProjects.set(others);
          this.filteredOtherProjects.set(others);
        }
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); },
    });
  }

  ngAfterViewInit(): void {
    const el = document.getElementById('projects');
    if (!el) return;
    this.observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) this.inView.set(true); },
      { threshold: 0.05 }
    );
    this.observer.observe(el);
  }

  setFilter(filter: string): void {
    this.activeFilter.set(filter);
    if (filter === 'all') {
      this.filteredOtherProjects.set(this.otherProjects());
    } else {
      this.filteredOtherProjects.set(this.otherProjects().filter((p) => p.category === filter));
    }
  }

  getImageUrl(image?: string): string {
    if (!image) return '';
    return image.startsWith('/') ? image.substring(1) : image;
  }

  openProject(project: Project): void {
    this.router.navigate(['/projects', project._id]);
  }

  getProjectGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
      'linear-gradient(135deg, #0f172a 0%, #164e63 50%, #0f172a 100%)',
      'linear-gradient(135deg, #1a0533 0%, #4c1d95 50%, #1a0533 100%)',
      'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    ];
    return gradients[index % gradients.length];
  }

  getProjectEmoji(category: string): string {
    const emojiMap: { [key: string]: string } = {
      'full-stack': '🔧',
      frontend: '🎨',
      backend: '⚙️',
      ai: '🧠',
      other: '📦',
    };
    return emojiMap[category] || '💻';
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
