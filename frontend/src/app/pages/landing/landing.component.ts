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
import { ScrollTrackerComponent } from '../../components/scroll-tracker/scroll-tracker.component';
import { StoryCardComponent } from '../../components/story-card/story-card.component';
import { VisualStatComponent } from '../../components/visual-stat/visual-stat.component';
import {
  HealingStory,
  ImpactStats,
  ImpactChallenge,
} from '../../models/story.model';
import { fadeInUp, fadeIn } from '../../shared/animations/page.animations';
import { StoryService } from '../../services/story/story.service';
import { ThreeParticleService } from '../../services/three-particle/three-particle.service';
import { WarmthService } from '../../services/warmth/warmth.service';

interface HelpService {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    ScrollTrackerComponent,
    StoryCardComponent,
    VisualStatComponent,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [fadeInUp, fadeIn],
})
export class LandingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('particleCanvas', { static: false })
  particleCanvas!: ElementRef<HTMLDivElement>;

  @ViewChild('warmthCanvas', { static: false })
  warmthCanvas!: ElementRef<HTMLDivElement>;

  featuredStory?: HealingStory;
  impactStats?: ImpactStats;
  impactChallenges: ImpactChallenge[] = [];
  isLoading = true;

  visualStats = [
    {
      icon: '👥',
      value: 2400,
      suffix: '+',
      label: 'Lives Touched',
      sublabel: 'Women and children helped annually',
      color: '#C8BEEA',
    },
    {
      icon: '🏠',
      value: 150,
      suffix: '',
      label: 'Shelter Spaces',
      sublabel: 'Safe refuge provided yearly',
      color: '#EEC9D2',
    },
    {
      icon: '🌟',
      value: 98,
      suffix: '%',
      label: 'Success Rate',
      sublabel: 'Survivors rebuild their lives',
      color: '#F4D292',
    },
    {
      icon: '⏰',
      value: 24,
      suffix: '/7',
      label: 'Always Here',
      sublabel: 'Emergency support available',
      color: '#A8C2D1',
    },
  ];

  helpServices: HelpService[] = [
    {
      icon: '🏠',
      title: "Athena's House",
      description:
        'Emergency shelter providing safe haven for women and children fleeing violence. Available 24/7 with no waiting list.',
      color: '#C8BEEA',
    },
    {
      icon: '💬',
      title: 'Counseling & Support',
      description:
        'Professional therapy services in multiple languages, including individual, family, and group counseling.',
      color: '#EEC9D2',
    },
    {
      icon: '⚖️',
      title: 'Legal Advocacy',
      description:
        'Expert legal guidance through the justice system, including court accompaniment and documentation support.',
      color: '#F4D292',
    },
    {
      icon: '🎓',
      title: 'Life Skills & Training',
      description:
        'Educational programs, job training, and financial literacy workshops to build long-term independence.',
      color: '#A8C2D1',
    },
  ];

  constructor(
    private storyService: StoryService,
    private threeParticleService: ThreeParticleService,
    private warmthService: WarmthService
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

    if (this.warmthCanvas) {
      setTimeout(() => {
        this.warmthService.init(this.warmthCanvas.nativeElement);
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.threeParticleService.dispose();
    this.warmthService.dispose();
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
      },
    });

    this.storyService.getImpactChallenges().subscribe({
      next: (challenges) => {
        this.impactChallenges = challenges;
      },
    });
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

  scrollToHelp(): void {
    const helpSection = document.getElementById('how-we-help');
    if (helpSection) {
      helpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
