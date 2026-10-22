import { Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export type Theme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  readonly currentTheme = signal<Theme>('dark');

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initTheme();
  }

  private initTheme(): void {
    const stored = localStorage.getItem(this.THEME_KEY);
    // If stored was 'light', use 'light'; otherwise default to 'dark'
    const theme: Theme = stored === 'light' ? 'light' : 'dark';
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const next: Theme = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next);
  }

  setTheme(theme: Theme): void {
    this.applyTheme(theme);
  }

  private applyTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.THEME_KEY, theme);
  }
}
