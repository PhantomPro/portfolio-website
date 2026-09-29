import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ViewChild, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  color: string;
}

@Component({
  selector: 'app-neural-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cyber-grid" aria-hidden="true"></div>
    <div class="ambient-glow glow-top" aria-hidden="true"></div>
    <div class="ambient-glow glow-mid" aria-hidden="true"></div>
    <div class="ambient-glow glow-bottom" aria-hidden="true"></div>
    <canvas #neuralCanvas class="neural-canvas" aria-hidden="true"></canvas>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .cyber-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(129, 140, 248, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(129, 140, 248, 0.08) 1px, transparent 1px);
      background-size: 50px 50px;
      mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 50%, rgba(0, 0, 0, 0.4) 85%, transparent 100%);
      opacity: 0.85;
      transition: opacity 0.5s ease;
    }

    :host-context([data-theme="dark"]) .cyber-grid {
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
      opacity: 0.5;
    }

    :host-context([data-theme="light"]) .cyber-grid {
      background-image:
        linear-gradient(rgba(79, 70, 229, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(79, 70, 229, 0.08) 1px, transparent 1px);
      opacity: 0.7;
    }

    .ambient-glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(140px);
      pointer-events: none;
      opacity: 0.18;
      transition: opacity 0.6s ease;
    }

    .glow-top {
      top: -150px;
      left: 15%;
      width: 750px;
      height: 650px;
      background: radial-gradient(circle, #6366F1 0%, #A855F7 60%, transparent 80%);
    }

    .glow-mid {
      top: 45%;
      right: 5%;
      width: 800px;
      height: 700px;
      background: radial-gradient(circle, #EC4899 0%, #818CF8 50%, transparent 80%);
      opacity: 0.14;
    }

    .glow-bottom {
      bottom: -150px;
      left: 20%;
      width: 900px;
      height: 750px;
      background: radial-gradient(circle, #06B6D4 0%, #3B82F6 50%, transparent 80%);
      opacity: 0.16;
    }

    :host-context([data-theme="light"]) .ambient-glow {
      opacity: 0.12;
      filter: blur(150px);
    }

    :host-context([data-theme="light"]) .glow-top {
      background: radial-gradient(circle, rgba(79, 70, 229, 0.25) 0%, rgba(124, 58, 237, 0.12) 50%, transparent 75%);
    }

    :host-context([data-theme="light"]) .glow-mid {
      background: radial-gradient(circle, rgba(219, 39, 119, 0.18) 0%, rgba(79, 70, 229, 0.10) 50%, transparent 75%);
    }

    :host-context([data-theme="light"]) .glow-bottom {
      background: radial-gradient(circle, rgba(2, 132, 199, 0.22) 0%, rgba(59, 130, 246, 0.10) 50%, transparent 75%);
    }

    .neural-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
      opacity: 0.9;
      transition: opacity 0.5s ease;
    }

    :host-context([data-theme="light"]) .neural-canvas {
      opacity: 0.55;
    }
  `],
})
export class NeuralBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('neuralCanvas', { static: true })
  private canvasRef!: ElementRef<HTMLCanvasElement>;

  private themeService = inject(ThemeService);
  private ctx: CanvasRenderingContext2D | null = null;
  private nodes: (Node & { colorIndex: number })[] = [];
  private animationFrameId: number | null = null;
  private width = 0;
  private height = 0;
  private mouse = { x: -1000, y: -1000, active: false };

  private readonly darkColors = ['#818CF8', '#A855F7', '#22D3EE', '#6366F1'];
  private readonly lightColors = ['#4F46E5', '#7C3AED', '#0284C7', '#DB2777'];

  ngOnInit(): void {}

  private isTabVisible = true;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.handleResize();
    this.initNodes();
    this.animate();

    // Pause animation when tab is in background to save mobile battery and CPU
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  ngOnDestroy(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
  }

  private onVisibilityChange = (): void => {
    this.isTabVisible = !document.hidden;
    if (this.isTabVisible && this.animationFrameId === null) {
      this.animate();
    }
  };

  @HostListener('window:resize')
  onResize(): void {
    this.handleResize();
    this.initNodes();
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.mouse.active = true;
  }

  @HostListener('window:mouseleave')
  onMouseLeave(): void {
    this.mouse.active = false;
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(e: TouchEvent): void {
    if (e.touches && e.touches.length > 0) {
      this.mouse.x = e.touches[0].clientX;
      this.mouse.y = e.touches[0].clientY;
      this.mouse.active = true;
    }
  }

  @HostListener('window:touchend')
  onTouchEnd(): void {
    this.mouse.active = false;
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  private handleResize(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = Math.floor(this.width * dpr);
    canvas.height = Math.floor(this.height * dpr);
    if (this.ctx) {
      this.ctx.resetTransform?.();
      this.ctx.scale(dpr, dpr);
    }
  }

  private initNodes(): void {
    const isMobile = this.width < 768;
    const density = isMobile
      ? Math.floor((this.width * this.height) / 40000)
      : Math.floor((this.width * this.height) / 26000);
    const count = isMobile
      ? Math.min(Math.max(density, 16), 26)
      : Math.min(Math.max(density, 28), 55);

    this.nodes = [];

    for (let i = 0; i < count; i++) {
      const colorIndex = i % this.darkColors.length;
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.25,
        pulsePhase: Math.random() * Math.PI * 2,
        colorIndex,
        color: this.darkColors[colorIndex],
      });
    }
  }

  private animate(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);
    const time = Date.now() * 0.002;
    const maxDistance = 140;
    const isLight = this.themeService.currentTheme() === 'light';
    const palette = isLight ? this.lightColors : this.darkColors;

    // Update & draw nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const nodeColor = palette[node.colorIndex % palette.length];

      node.x += node.vx;
      node.y += node.vy;

      // Wrap edges
      if (node.x < 0) node.x = this.width;
      if (node.x > this.width) node.x = 0;
      if (node.y < 0) node.y = this.height;
      if (node.y > this.height) node.y = 0;

      // Mouse influence
      let extraGlow = 0;
      if (this.mouse.active) {
        const dx = node.x - this.mouse.x;
        const dy = node.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          extraGlow = (1 - dist / 180) * 0.4;
        }
      }

      const pulse = Math.sin(time + node.pulsePhase) * 0.15;
      const alpha = Math.min(Math.max(node.baseAlpha + pulse + extraGlow, 0.1), 0.95);

      // Draw node dot
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius + (extraGlow > 0 ? 0.8 : 0), 0, Math.PI * 2);
      this.ctx.fillStyle = nodeColor;
      this.ctx.globalAlpha = isLight ? Math.min(alpha * 1.2, 0.95) : alpha;
      this.ctx.fill();

      // Soft glow around node
      if (alpha > 0.35) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
        this.ctx.fillStyle = nodeColor;
        this.ctx.globalAlpha = alpha * (isLight ? 0.22 : 0.18);
        this.ctx.fill();
      }

      // Connect lines to nearby nodes
      for (let j = i + 1; j < this.nodes.length; j++) {
        const other = this.nodes[j];
        const dx = node.x - other.x;
        const dy = node.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const lineAlpha = (1 - dist / maxDistance) * (isLight ? 0.35 : 0.22) * (alpha + other.baseAlpha) * 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(node.x, node.y);
          this.ctx.lineTo(other.x, other.y);
          this.ctx.strokeStyle = nodeColor;
          this.ctx.globalAlpha = lineAlpha;
          this.ctx.lineWidth = isLight ? 1.0 : 0.85;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.globalAlpha = 1.0;
    if (this.isTabVisible) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationFrameId = null;
    }
  }
}
