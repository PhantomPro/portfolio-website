import { Component, OnInit, AfterViewInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../../../core/services/portfolio.service';
import { Skill, SkillGroup } from '../../../../core/models/skill.model';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="skills" class="section skills-section" aria-labelledby="skills-title">
      <div class="container">
        <div class="section-header">
          <span class="section-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>
            Technical Skills
          </span>
          <h2 id="skills-title">What I Work With</h2>
          <p>Technologies I use to build modern, production-quality software.</p>
        </div>

        <!-- Category tabs -->
        <div class="category-tabs" role="tablist" aria-label="Skill categories">
          @for (group of skillGroups(); track group.category) {
            <button
              class="tab"
              [class.active]="activeCategory() === group.category"
              (click)="setCategory(group.category)"
              role="tab"
              [attr.aria-selected]="activeCategory() === group.category"
              [id]="'tab-' + group.category"
            >
              <span class="tab-icon" aria-hidden="true">{{ group.icon }}</span>
              {{ group.label }}
            </button>
          }
        </div>

        <!-- Skills grid -->
        <div class="skills-grid" role="tabpanel" [attr.aria-labelledby]="'tab-' + activeCategory()">
          @for (group of skillGroups(); track group.category) {
            @if (activeCategory() === group.category) {
              @for (skill of group.skills; track skill._id; let i = $index) {
                <div
                  class="skill-card animate-on-scroll"
                  [class.in-view]="inView()"
                  [style.transition-delay]="(i * 0.05) + 's'"
                  [attr.aria-label]="skill.name"
                >
                  <div class="skill-icon-wrap">
                    <img
                      [src]="getSkillIcon(skill)"
                      [alt]="skill.name + ' icon'"
                      class="skill-icon"
                      (error)="handleIconError($event, skill)"
                      loading="lazy"
                    />
                  </div>
                  <div class="skill-name">{{ skill.name }}</div>
                  <div class="skill-glow" aria-hidden="true"></div>
                </div>
              }
            }
          }

          @if (loading()) {
            @for (n of [1,2,3,4,5,6]; track n) {
              <div class="skill-card skeleton" style="height:120px;"></div>
            }
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .skills-section { background: transparent; }

    .category-tabs {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }

    .tab {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.6rem 1.25rem;
      border: 1px solid var(--border-default);
      background: transparent;
      color: var(--text-secondary);
      border-radius: 100px;
      font-size: 0.88rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.25s ease;
      font-family: 'Inter', sans-serif;

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-strong);
        background: var(--bg-surface);
      }

      &.active {
        background: var(--gradient-primary);
        border-color: transparent;
        color: #fff;
        box-shadow: 0 4px 15px var(--accent-glow);
      }

      .tab-icon { font-size: 1rem; }
    }

    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: stretch;
      gap: 1.25rem;
      max-width: 1060px;
      margin: 0 auto;

      @media (max-width: 600px) {
        gap: 0.75rem;
      }
    }

    .skill-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 1.75rem 1rem;
      width: 145px;
      min-height: 150px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      cursor: default;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      @media (max-width: 600px) {
        width: calc(33.333% - 0.5rem);
        min-width: 95px;
        min-height: 120px;
        padding: 1rem 0.5rem;
      }

      &:hover {
        border-color: var(--border-accent);
        transform: translateY(-6px);
        box-shadow: var(--shadow-accent);

        .skill-icon { transform: scale(1.15) rotate(-3deg); }
        .skill-glow { opacity: 1; }
        .skill-name { color: var(--accent-primary); }
      }
    }

    .skill-icon-wrap {
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .skill-icon {
      width: 44px;
      height: 44px;
      object-fit: contain;
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .skill-name {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-align: center;
      transition: color 0.2s;
      line-height: 1.3;
    }

    .skill-glow {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 110%, var(--accent-glow) 0%, transparent 60%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
  `],
})
export class SkillsComponent implements OnInit, AfterViewInit {
  private portfolioService = inject(PortfolioService);

  readonly activeCategory = signal<string>('ai');
  readonly skillGroups = signal<SkillGroup[]>([]);
  readonly loading = signal(true);
  readonly inView = signal(false);

  private observer?: IntersectionObserver;

  private readonly categoryConfig: { [key: string]: { label: string; icon: string; order: number } } = {
    ai:        { label: 'AI & Engineering', icon: '🧠', order: 1 },
    frontend:  { label: 'Frontend',         icon: '🎨', order: 2 },
    backend:   { label: 'Backend',          icon: '⚙️', order: 3 },
    database:  { label: 'Database',         icon: '🗄️', order: 4 },
    tools:     { label: 'Dev Tools',        icon: '🛠️', order: 5 },
  };

  ngOnInit(): void {
    this.portfolioService.getSkills().subscribe({
      next: (res) => {
        if (res.success) this.buildGroups(res.data);
        this.loading.set(false);
      },
      error: () => { this.loading.set(false); },
    });
  }

  ngAfterViewInit(): void {
    const el = document.getElementById('skills');
    if (!el) return;
    this.observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) this.inView.set(true); },
      { threshold: 0.1 }
    );
    this.observer.observe(el);
  }

  private buildGroups(skills: Skill[]): void {
    const groupMap = new Map<string, Skill[]>();
    skills.forEach((s) => {
      const arr = groupMap.get(s.category) || [];
      arr.push(s);
      groupMap.set(s.category, arr);
    });

    const groups: SkillGroup[] = [];
    groupMap.forEach((skills, cat) => {
      const conf = this.categoryConfig[cat];
      if (conf) {
        groups.push({ category: cat, label: conf.label, icon: conf.icon, skills });
      }
    });

    groups.sort((a, b) => {
      const oa = this.categoryConfig[a.category]?.order ?? 99;
      const ob = this.categoryConfig[b.category]?.order ?? 99;
      return oa - ob;
    });

    this.skillGroups.set(groups);
    if (groups.length) this.activeCategory.set(groups[0].category);
  }

  setCategory(cat: string): void {
    this.activeCategory.set(cat);
    this.inView.set(false);
    setTimeout(() => this.inView.set(true), 50);
  }

  getSkillIcon(skill: Skill): string {
    const iconMap: { [key: string]: string } = {
      angular: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
      react: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
      html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
      css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
      tailwind: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
      nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      express: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
      fastapi: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
      mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
      github: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
      docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      vscode: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
      python: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      openai: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/networkx/networkx-original.svg',
    };
    const key = skill.icon?.toLowerCase() || skill.name.toLowerCase().replace(/[^a-z]/g, '');
    return iconMap[key] || `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name)}&background=7C6FF7&color=fff&size=64&bold=true`;
  }

  handleIconError(event: Event, skill: Skill): void {
    const img = event.target as HTMLImageElement;
    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(skill.name)}&background=7C6FF7&color=fff&size=64&bold=true`;
  }
}
