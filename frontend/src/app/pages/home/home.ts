import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from './sections/hero/hero';
import { AboutComponent } from './sections/about/about';
import { SkillsComponent } from './sections/skills/skills';
import { ExperienceComponent } from './sections/experience/experience';
import { ProjectsComponent } from './sections/projects/projects';
import { AchievementsComponent } from './sections/achievements/achievements';
import { ContactComponent } from './sections/contact/contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    AboutComponent,
    SkillsComponent,
    ExperienceComponent,
    ProjectsComponent,
    AchievementsComponent,
    ContactComponent,
  ],
  template: `
    <app-hero />
    <div class="divider"></div>
    <app-about />
    <div class="divider"></div>
    <app-skills />
    <div class="divider"></div>
    <app-experience />
    <div class="divider"></div>
    <app-projects />
    <div class="divider"></div>
    <app-achievements />
    <div class="divider"></div>
    <app-contact />
  `,
  styles: [`:host { display: block; }`],
})
export class HomeComponent {}
