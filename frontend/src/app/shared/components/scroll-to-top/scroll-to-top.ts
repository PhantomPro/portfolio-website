import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="scroll-top"
      [class.visible]="isVisible()"
      (click)="scrollToTop()"
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    </button>
  `,
  styles: [`
    .scroll-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 500;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: var(--gradient-primary);
      border: none;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow-md);
      opacity: 0;
      transform: translateY(20px) scale(0.9);
      pointer-events: none;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      &:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: var(--shadow-accent);
      }
    }
  `],
})
export class ScrollToTopComponent {
  readonly isVisible = signal(false);

  @HostListener('window:scroll')
  onScroll(): void {
    this.isVisible.set(window.scrollY > 500);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
