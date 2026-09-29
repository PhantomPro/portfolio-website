import { Injectable, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export type Theme = 'ai' | 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly THEME_KEY = 'portfolio-theme';
  readonly currentTheme = signal<Theme>('ai');

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.initTheme();
  }

  private initTheme(): void {
    const stored = localStorage.getItem(this.THEME_KEY) as Theme | null;
    const theme: Theme = stored || 'ai';
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const order: Theme[] = ['ai', 'dark', 'light'];
    const currentIndex = order.indexOf(this.currentTheme());
    const next = order[(currentIndex + 1) % order.length];
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
