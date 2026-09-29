import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { NavbarComponent } from './shared/navbar/navbar';
import { FooterComponent } from './shared/footer/footer';
import { ScrollToTopComponent } from './shared/components/scroll-to-top/scroll-to-top';
import { NeuralBackgroundComponent } from './shared/components/neural-background/neural-background';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ScrollToTopComponent, NeuralBackgroundComponent],
  template: `
    <app-neural-background />
    <div class="app-wrapper">
      <app-navbar />
      <main>
        <router-outlet />
      </main>
      <app-footer />
      <app-scroll-to-top />
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 1;
    }
    main {
      flex: 1;
    }
  `],
})
export class AppComponent implements OnInit {
  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Theme is initialized in the service constructor
  }
}
