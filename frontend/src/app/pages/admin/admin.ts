import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { ExperienceService } from '../../core/services/experience.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Project } from '../../core/models/project.model';
import { Experience } from '../../core/models/experience.model';

type AdminTab = 'projects' | 'experience' | 'profile';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="admin-page">
      <div class="admin-header">
        <div class="container">
          <div class="admin-nav">
            <a routerLink="/" class="back-link" aria-label="Back to portfolio">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Portfolio
            </a>
            <h1>Admin Panel</h1>
            <div class="admin-badge">
              <span class="mono">Content Manager</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container admin-body">
        <div class="admin-notice" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>This panel is for content management only. Add proper authentication before deploying to production.</span>
        </div>

        <!-- Tabs -->
        <div class="admin-tabs" role="tablist" aria-label="Admin sections">
          <button class="admin-tab" [class.active]="activeTab() === 'projects'" (click)="setTab('projects')" role="tab" [attr.aria-selected]="activeTab() === 'projects'" id="tab-projects">Projects</button>
          <button class="admin-tab" [class.active]="activeTab() === 'experience'" (click)="setTab('experience')" role="tab" [attr.aria-selected]="activeTab() === 'experience'" id="tab-experience">Experience</button>
          <button class="admin-tab" [class.active]="activeTab() === 'profile'" (click)="setTab('profile')" role="tab" [attr.aria-selected]="activeTab() === 'profile'" id="tab-profile">Profile</button>
        </div>

        <!-- Projects tab -->
        @if (activeTab() === 'projects') {
          <div role="tabpanel" aria-labelledby="tab-projects">
            <div class="panel-header">
              <h2>Projects ({{ projects().length }})</h2>
              <button class="btn btn-primary btn-sm" (click)="showAddProject()" id="admin-add-project">+ Add Project</button>
            </div>
            <div class="admin-table">
              <table aria-label="Projects list">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Featured</th>
                    <th>Technologies</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (project of projects(); track project._id) {
                    <tr>
                      <td class="td-title">{{ project.title }}</td>
                      <td><span class="table-badge">{{ project.category }}</span></td>
                      <td>
                        @if (project.featured) {
                          <span class="featured-dot" aria-label="Featured">⭐</span>
                        } @else {
                          <span class="text-tertiary">—</span>
                        }
                      </td>
                      <td class="td-tech">{{ project.technologies.slice(0,3).join(', ') }}</td>
                      <td class="td-actions">
                        <button class="action-btn" (click)="deleteProject(project._id)" [attr.aria-label]="'Delete ' + project.title">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        <!-- Experience tab -->
        @if (activeTab() === 'experience') {
          <div role="tabpanel" aria-labelledby="tab-experience">
            <div class="panel-header">
              <h2>Experience ({{ experiences().length }})</h2>
            </div>
            <div class="exp-list">
              @for (exp of experiences(); track exp._id) {
                <div class="exp-row">
                  <div class="exp-info">
                    <strong>{{ exp.role }}</strong> at <em>{{ exp.company }}</em>
                    <span class="exp-date">{{ exp.startDate }} — {{ exp.current ? 'Present' : exp.endDate }}</span>
                  </div>
                  <button class="action-btn" (click)="deleteExperience(exp._id)" [attr.aria-label]="'Delete ' + exp.role + ' at ' + exp.company">
                    Delete
                  </button>
                </div>
              }
            </div>
          </div>
        }

        <!-- Profile tab -->
        @if (activeTab() === 'profile') {
          <div role="tabpanel" aria-labelledby="tab-profile">
            <div class="panel-header">
              <h2>Profile Settings</h2>
            </div>
            <div class="profile-info-box">
              <p>Use the <code class="mono">seed.ts</code> script to populate initial data:</p>
              <code class="code-block mono">cd backend && npm run seed</code>
              <p style="margin-top:1rem;">This sets up all placeholder profile data that you can then update via the API or directly in MongoDB.</p>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      padding-top: 80px;
      background: var(--bg-primary);
    }

    .admin-header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-subtle);
      padding: 1.5rem 0;
    }

    .admin-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;

      h1 { font-size: 1.5rem; flex: 1; }
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.88rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: color 0.2s;
      &:hover { color: var(--accent-primary); }
    }

    .admin-badge {
      padding: 0.35rem 0.875rem;
      background: var(--accent-subtle);
      border: 1px solid var(--border-accent);
      border-radius: 100px;
      font-size: 0.75rem;
      color: var(--accent-primary);
    }

    .admin-body { padding: 2.5rem 0 4rem; }

    .admin-notice {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 1.25rem;
      background: rgba(251,191,36,0.08);
      border: 1px solid rgba(251,191,36,0.25);
      border-radius: 12px;
      font-size: 0.88rem;
      color: #FBBF24;
      margin-bottom: 2rem;
    }

    .admin-tabs {
      display: flex;
      gap: 0.25rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .admin-tab {
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;
      margin-bottom: -1px;

      &:hover { color: var(--text-primary); }
      &.active { color: var(--accent-primary); border-bottom-color: var(--accent-primary); }
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;

      h2 { font-size: 1.25rem; color: var(--text-primary); }
    }

    .admin-table {
      overflow-x: auto;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;

      table {
        width: 100%;
        border-collapse: collapse;

        th, td {
          padding: 1rem 1.25rem;
          text-align: left;
          border-bottom: 1px solid var(--border-subtle);
        }

        th {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
          background: var(--bg-secondary);
        }

        td { font-size: 0.9rem; color: var(--text-secondary); }

        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--bg-surface); }
      }
    }

    .td-title { font-weight: 600; color: var(--text-primary) !important; }
    .td-tech { font-family: 'JetBrains Mono', monospace; font-size: 0.78rem !important; }

    .table-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      background: var(--accent-subtle);
      border-radius: 100px;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--accent-primary);
    }

    .featured-dot { font-size: 1rem; }

    .td-actions { display: flex; gap: 0.5rem; }

    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      background: rgba(248,113,113,0.08);
      border: 1px solid rgba(248,113,113,0.2);
      border-radius: 8px;
      color: var(--error);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: 'Inter', sans-serif;

      &:hover { background: rgba(248,113,113,0.15); }
    }

    .text-tertiary { color: var(--text-tertiary); }

    .exp-list { display: flex; flex-direction: column; gap: 0.75rem; }

    .exp-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.25rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      flex-wrap: wrap;
    }

    .exp-info {
      font-size: 0.92rem;
      color: var(--text-secondary);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      strong { color: var(--text-primary); }
      em { font-style: normal; color: var(--accent-primary); }
    }

    .exp-date { font-size: 0.8rem; color: var(--text-tertiary); }

    .profile-info-box {
      padding: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      line-height: 1.75;
      color: var(--text-secondary);
    }

    .code-block {
      display: block;
      padding: 0.875rem 1.25rem;
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: 8px;
      font-size: 0.88rem;
      color: var(--accent-primary);
      margin-top: 0.75rem;
    }
  `],
})
export class AdminComponent implements OnInit {
  private projectService = inject(ProjectService);
  private experienceService = inject(ExperienceService);

  readonly activeTab = signal<AdminTab>('projects');
  readonly projects = signal<Project[]>([]);
  readonly experiences = signal<Experience[]>([]);

  ngOnInit(): void {
    this.loadProjects();
    this.loadExperiences();
  }

  setTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  private loadProjects(): void {
    this.projectService.getProjects().subscribe({
      next: (res) => { if (res.success) this.projects.set(res.data); },
      error: () => {},
    });
  }

  private loadExperiences(): void {
    this.experienceService.getExperiences().subscribe({
      next: (res) => { if (res.success) this.experiences.set(res.data); },
      error: () => {},
    });
  }

  deleteProject(id: string): void {
    if (!confirm('Are you sure you want to delete this project?')) return;
    this.projectService.deleteProject(id).subscribe({
      next: () => this.loadProjects(),
      error: () => alert('Failed to delete project'),
    });
  }

  deleteExperience(id: string): void {
    if (!confirm('Are you sure you want to delete this experience?')) return;
    this.experienceService.deleteExperience(id).subscribe({
      next: () => this.loadExperiences(),
      error: () => alert('Failed to delete experience'),
    });
  }

  showAddProject(): void {
    alert('Use the API directly or the seed script to add projects. Full CRUD UI coming soon!');
  }
}
