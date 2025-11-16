import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatData {
  icon: string;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  color: string;
}

@Component({
  selector: 'app-visual-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visual-stat.component.html',
  styleUrl: './visual-stat.component.scss',
})
export class VisualStatComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() stat!: StatData;
  @ViewChild('chartCanvas', { static: false })
  chartCanvas!: ElementRef<HTMLCanvasElement>;

  animatedValue = 0;
  private animationFrame?: number;

  ngOnInit(): void {
    this.animateNumber();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.drawChart(), 100);
  }

  ngOnDestroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private animateNumber(): void {
    const duration = 1500;
    const startTime = performance.now();
    const targetValue =
      typeof this.stat.value === 'number' ? this.stat.value : 0;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      this.animatedValue = Math.floor(targetValue * easeOutQuart);

      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  private drawChart(): void {
    if (!this.chartCanvas) return;

    const canvas = this.chartCanvas.nativeElement;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 15;

    ctx.clearRect(0, 0, width, height);

    // Background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = `${this.stat.color}15`;
    ctx.lineWidth = 12;
    ctx.stroke();

    // Progress arc
    const progress = this.stat.suffix === '%' ? this.stat.value / 100 : 0.75;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + 2 * Math.PI * progress;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = this.stat.color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Inner glow
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius - 20,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(0, `${this.stat.color}00`);
    gradient.addColorStop(1, `${this.stat.color}10`);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}
