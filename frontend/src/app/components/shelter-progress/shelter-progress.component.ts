import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shelter-progress',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shelter-progress.component.html',
  styleUrl: './shelter-progress.component.scss',
})
export class ShelterProgressComponent implements AfterViewInit, OnChanges {
  @Input() current: number = 0;
  @Input() goal: number = 100;
  @Input() debugMode: boolean = false;

  @ViewChild('shelterCanvas', { static: false })
  shelterCanvas!: ElementRef<HTMLCanvasElement>;

  debugProgress: number = 0;
  private ctx?: CanvasRenderingContext2D;
  private readonly PIXEL_SIZE = 6;
  private readonly CANVAS_WIDTH = 400;
  private readonly CANVAS_HEIGHT = 300;

  // Color palette matching app theme
  private readonly COLORS = {
    lavender: '#C8BEEA',
    rose: '#EEC9D2',
    sand: '#F7EEE5',
    peach: '#F9D8C4',
    plum: '#644A73',
    forest: '#6E8B6F',
    gold: '#F4D292',
    cream: '#FFFAF7',
    sky: '#A8C2D1',
    brown: '#8B6F47',
    darkBrown: '#5C4A3A',
    grass: '#90C590',
    darkGrass: '#6B9B6B',
    window: '#87CEEB',
    door: '#CD853F',
  };

  ngAfterViewInit(): void {
    if (this.shelterCanvas) {
      const canvas = this.shelterCanvas.nativeElement;
      canvas.width = this.CANVAS_WIDTH;
      canvas.height = this.CANVAS_HEIGHT;
      this.ctx = canvas.getContext('2d')!;
      this.drawShelter();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['current'] || changes['goal']) {
      this.drawShelter();
    }
  }

  get progressPercentage(): number {
    if (this.debugMode) {
      return this.debugProgress;
    }
    return Math.min(100, Math.round((this.current / this.goal) * 100));
  }

  onDebugSliderChange(): void {
    this.drawShelter();
  }

  private drawShelter(): void {
    if (!this.ctx) return;

    const progress = this.progressPercentage;

    // Clear canvas
    this.ctx.fillStyle = this.COLORS.cream;
    this.ctx.fillRect(0, 0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

    // Draw background elements
    this.drawBackground();

    // Draw shelter based on progress
    if (progress >= 0) this.drawFoundation(progress);
    if (progress >= 15) this.drawWalls(progress);
    if (progress >= 40) this.drawRoof(progress);
    if (progress >= 60) this.drawWindows(progress);
    if (progress >= 75) this.drawDoor(progress);
    if (progress >= 85) this.drawDetails(progress);
    if (progress >= 95) this.drawFinalTouches(progress);

    // Draw construction elements for incomplete shelter
    if (progress < 100) {
      this.drawConstructionElements(progress);
    }

    // Draw celebration effects at 100%
    if (progress >= 100) {
      this.drawCelebration();
    }
  }

  private drawPixel(x: number, y: number, color: string): void {
    if (!this.ctx) return;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.PIXEL_SIZE,
      y * this.PIXEL_SIZE,
      this.PIXEL_SIZE,
      this.PIXEL_SIZE
    );
  }

  private drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ): void {
    if (!this.ctx) return;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(
      x * this.PIXEL_SIZE,
      y * this.PIXEL_SIZE,
      width * this.PIXEL_SIZE,
      height * this.PIXEL_SIZE
    );
  }

  private drawBackground(): void {
    // Draw sky
    this.drawRect(0, 0, 67, 35, this.COLORS.sky);

    // Draw grass
    this.drawRect(0, 35, 67, 15, this.COLORS.grass);

    // Draw grass details
    for (let i = 0; i < 67; i += 3) {
      this.drawPixel(i, 35, this.COLORS.darkGrass);
      this.drawPixel(i + 1, 36, this.COLORS.darkGrass);
    }

    // Draw clouds
    this.drawCloud(8, 5);
    this.drawCloud(45, 8);
  }

  private drawCloud(x: number, y: number): void {
    const cloudColor = 'rgba(255, 255, 255, 0.8)';
    this.drawPixel(x + 1, y, cloudColor);
    this.drawPixel(x + 2, y, cloudColor);
    this.drawPixel(x, y + 1, cloudColor);
    this.drawPixel(x + 1, y + 1, cloudColor);
    this.drawPixel(x + 2, y + 1, cloudColor);
    this.drawPixel(x + 3, y + 1, cloudColor);
  }

  private drawFoundation(progress: number): void {
    const foundationProgress = Math.min(100, (progress / 15) * 100);
    const width = Math.floor((foundationProgress / 100) * 24);

    // Foundation base
    this.drawRect(22, 34, width, 2, this.COLORS.darkBrown);

    // Foundation details
    for (let i = 0; i < width; i += 2) {
      this.drawPixel(22 + i, 35, this.COLORS.brown);
    }
  }

  private drawWalls(progress: number): void {
    const wallProgress = Math.min(100, ((progress - 15) / 25) * 100);
    const height = Math.floor((wallProgress / 100) * 12);

    // Left wall
    this.drawRect(22, 34 - height, 2, height, this.COLORS.rose);

    // Right wall
    this.drawRect(44, 34 - height, 2, height, this.COLORS.rose);

    // Back wall
    if (wallProgress > 50) {
      const backHeight = Math.floor(((wallProgress - 50) / 50) * 12);
      this.drawRect(24, 34 - backHeight, 20, backHeight, this.COLORS.peach);
    }

    // Wall texture
    for (let i = 0; i < height; i += 3) {
      this.drawPixel(22, 34 - i, this.COLORS.lavender);
      this.drawPixel(45, 34 - i, this.COLORS.lavender);
    }
  }

  private drawRoof(progress: number): void {
    const roofProgress = Math.min(100, ((progress - 40) / 20) * 100);

    // Roof base
    const roofWidth = Math.floor((roofProgress / 100) * 26);
    this.drawRect(21, 20, roofWidth, 2, this.COLORS.plum);

    // Roof peak
    if (roofProgress > 50) {
      for (let i = 0; i < 4; i++) {
        const width = 26 - i * 2;
        this.drawRect(21 + i, 16 + i, width, 1, this.COLORS.plum);
      }

      // Roof tiles
      for (let y = 16; y < 22; y++) {
        for (let x = 21; x < 47; x += 2) {
          if ((x + y) % 4 === 0) {
            this.drawPixel(x, y, this.COLORS.lavender);
          }
        }
      }
    }
  }

  private drawWindows(progress: number): void {
    const windowProgress = Math.min(100, ((progress - 60) / 15) * 100);

    if (windowProgress > 0) {
      // Left window
      this.drawRect(26, 26, 4, 4, this.COLORS.window);
      this.drawPixel(27, 27, 'rgba(255, 255, 255, 0.6)');
      this.drawPixel(28, 28, 'rgba(255, 255, 255, 0.6)');

      // Window frame
      this.drawPixel(26, 26, this.COLORS.darkBrown);
      this.drawPixel(29, 26, this.COLORS.darkBrown);
      this.drawPixel(26, 29, this.COLORS.darkBrown);
      this.drawPixel(29, 29, this.COLORS.darkBrown);
    }

    if (windowProgress > 50) {
      // Right window
      this.drawRect(38, 26, 4, 4, this.COLORS.window);
      this.drawPixel(39, 27, 'rgba(255, 255, 255, 0.6)');
      this.drawPixel(40, 28, 'rgba(255, 255, 255, 0.6)');

      // Window frame
      this.drawPixel(38, 26, this.COLORS.darkBrown);
      this.drawPixel(41, 26, this.COLORS.darkBrown);
      this.drawPixel(38, 29, this.COLORS.darkBrown);
      this.drawPixel(41, 29, this.COLORS.darkBrown);
    }
  }

  private drawDoor(progress: number): void {
    const doorProgress = Math.min(100, ((progress - 75) / 10) * 100);

    if (doorProgress > 0) {
      // Door
      this.drawRect(32, 28, 4, 6, this.COLORS.door);

      // Door frame
      this.drawRect(31, 28, 1, 6, this.COLORS.darkBrown);
      this.drawRect(36, 28, 1, 6, this.COLORS.darkBrown);
      this.drawRect(31, 27, 6, 1, this.COLORS.darkBrown);

      // Door knob
      this.drawPixel(35, 31, this.COLORS.gold);

      // Door details
      this.drawPixel(32, 29, this.COLORS.darkBrown);
      this.drawPixel(35, 29, this.COLORS.darkBrown);
      this.drawPixel(32, 32, this.COLORS.darkBrown);
      this.drawPixel(35, 32, this.COLORS.darkBrown);
    }
  }

  private drawDetails(progress: number): void {
    const detailProgress = Math.min(100, ((progress - 85) / 10) * 100);

    if (detailProgress > 0) {
      // Chimney
      this.drawRect(38, 14, 3, 4, this.COLORS.darkBrown);
      this.drawPixel(38, 14, this.COLORS.brown);

      // Smoke
      if (detailProgress > 50) {
        this.drawPixel(39, 12, 'rgba(150, 150, 150, 0.4)');
        this.drawPixel(40, 11, 'rgba(150, 150, 150, 0.3)');
        this.drawPixel(38, 10, 'rgba(150, 150, 150, 0.2)');
      }

      // Garden flowers
      this.drawPixel(18, 35, this.COLORS.rose);
      this.drawPixel(19, 36, this.COLORS.forest);
      this.drawPixel(48, 35, this.COLORS.lavender);
      this.drawPixel(49, 36, this.COLORS.forest);
    }
  }

  private drawFinalTouches(progress: number): void {
    // Welcome mat
    this.drawRect(31, 34, 6, 1, this.COLORS.plum);

    // Bushes
    this.drawPixel(20, 34, this.COLORS.forest);
    this.drawPixel(21, 34, this.COLORS.forest);
    this.drawPixel(20, 33, this.COLORS.darkGrass);

    this.drawPixel(46, 34, this.COLORS.forest);
    this.drawPixel(47, 34, this.COLORS.forest);
    this.drawPixel(47, 33, this.COLORS.darkGrass);
  }

  private drawConstructionElements(progress: number): void {
    // Construction cone
    this.drawPixel(16, 36, this.COLORS.gold);
    this.drawPixel(16, 37, this.COLORS.gold);
    this.drawPixel(15, 38, this.COLORS.gold);
    this.drawPixel(16, 38, this.COLORS.gold);
    this.drawPixel(17, 38, this.COLORS.gold);

    // Tool box
    this.drawRect(50, 37, 3, 2, this.COLORS.plum);
    this.drawPixel(51, 36, this.COLORS.darkBrown);
  }

  private drawCelebration(): void {
    // Heart particles
    const hearts = [
      { x: 12, y: 20 },
      { x: 52, y: 18 },
      { x: 15, y: 28 },
      { x: 50, y: 25 },
    ];

    hearts.forEach((heart) => {
      this.drawHeart(heart.x, heart.y);
    });

    // Stars
    const stars = [
      { x: 10, y: 15 },
      { x: 55, y: 14 },
      { x: 33, y: 10 },
    ];

    stars.forEach((star) => {
      this.drawStar(star.x, star.y);
    });
  }

  private drawHeart(x: number, y: number): void {
    this.drawPixel(x, y, this.COLORS.rose);
    this.drawPixel(x + 2, y, this.COLORS.rose);
    this.drawPixel(x, y + 1, this.COLORS.rose);
    this.drawPixel(x + 1, y + 1, this.COLORS.rose);
    this.drawPixel(x + 2, y + 1, this.COLORS.rose);
    this.drawPixel(x + 1, y + 2, this.COLORS.rose);
  }

  private drawStar(x: number, y: number): void {
    this.drawPixel(x, y, this.COLORS.gold);
    this.drawPixel(x - 1, y, this.COLORS.gold);
    this.drawPixel(x + 1, y, this.COLORS.gold);
    this.drawPixel(x, y - 1, this.COLORS.gold);
    this.drawPixel(x, y + 1, this.COLORS.gold);
  }
}
