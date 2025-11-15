import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StoryCardComponent } from '../../components/story-card/story-card.component';
import {
  HealingStory,
  ImpactStats,
  ImpactChallenge,
} from '../../models/story.model';
import { fadeInUp, fadeIn } from '../../shared/animations/page.animations';
import { StoryService } from '../../services/story/story.service';
import { ThreeParticleService } from '../../services/three-particle/three-particle.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, StoryCardComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [fadeInUp, fadeIn],
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('particleCanvas', { static: false })
  particleCanvas!: ElementRef<HTMLDivElement>;

  featuredStory?: HealingStory;
  impactStats?: ImpactStats;
  impactChallenges: ImpactChallenge[] = [];
  isLoading = true;

  animatedLivesTouched = 0;
  animatedStories = 0;
  animatedRecoveryRate = 0;

  constructor(
    private storyService: StoryService,
    private threeParticleService: ThreeParticleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    if (this.particleCanvas) {
      setTimeout(() => {
        this.threeParticleService.init(this.particleCanvas.nativeElement);
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.threeParticleService.dispose();
  }

  private loadData(): void {
    this.storyService.getFeaturedStory().subscribe({
      next: (story) => {
        this.featuredStory = story;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading featured story:', err);
        this.isLoading = false;
      },
    });

    this.storyService.getImpactStats().subscribe({
      next: (stats) => {
        this.impactStats = stats;
        this.animateNumbers(stats);
      },
    });

    this.storyService.getImpactChallenges().subscribe({
      next: (challenges) => {
        this.impactChallenges = challenges;
      },
    });
  }

  private animateNumbers(stats: ImpactStats): void {
    this.animateNumber(0, stats.livesTouched, 2000, (val) => {
      this.animatedLivesTouched = val;
    });

    this.animateNumber(0, stats.storiesOfHope, 1800, (val) => {
      this.animatedStories = val;
    });

    this.animateNumber(0, stats.recoveryRate, 2000, (val) => {
      this.animatedRecoveryRate = val;
    });
  }

  private animateNumber(
    start: number,
    end: number,
    duration: number,
    callback: (val: number) => void
  ): void {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);

      callback(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  onParticleMouseMove(event: MouseEvent): void {
    if (this.particleCanvas) {
      this.threeParticleService.onMouseMove(
        event,
        this.particleCanvas.nativeElement
      );
    }
  }

  getPercentage(current: number, goal: number): number {
    return Math.round((current / goal) * 100);
  }

  scrollToStory(): void {
    const storySection = document.getElementById('featured-story');
    if (storySection) {
      storySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
