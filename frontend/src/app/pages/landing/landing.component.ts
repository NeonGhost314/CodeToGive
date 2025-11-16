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
import { ScrollIndicatorComponent } from '../../components/scroll-tracker/scroll-indicator.component';
import { StoryCardComponent } from '../../components/story-card/story-card.component';
import { VisualStatComponent } from '../../components/visual-stat/visual-stat.component';
import { EmergencyContactsComponent } from '../../components/EmergencyContacts/EmergencyContacts.component';
import {
  HealingStory,
  ImpactStats,
  ImpactChallenge,
} from '../../models/story.model';
import { fadeInUp, fadeIn } from '../../shared/animations/page.animations';
import { StoryService } from '../../services/story/story.service';
import { ThreeParticleService } from '../../services/three-particle/three-particle.service';
import { WarmthService } from '../../services/warmth/warmth.service';
import { ShelterProgressComponent } from '../../components/shelter-progress/shelter-progress.component';

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
    ScrollIndicatorComponent,
    StoryCardComponent,
    VisualStatComponent,
    EmergencyContactsComponent,
    ShelterProgressComponent,
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

  shelterCurrent: number = 0;
  shelterGoal: number = 100;
  shelterDebugMode: boolean = true; // Set to true to test!

  // Updated with accurate Shield of Athena data
  visualStats = [
    {
      icon: '🏠',
      value: 150,
      suffix: '',
      label: 'Annual Shelter',
      sublabel: 'Women and children sheltered yearly',
      color: '#C8BEEA',
    },
    {
      icon: '🌍',
      value: 10,
      suffix: '+',
      label: 'Languages',
      sublabel: 'Multilingual support available',
      color: '#EEC9D2',
    },
    {
      icon: '📍',
      value: 2,
      suffix: '',
      label: 'Locations',
      sublabel: 'Montreal & Laval offices',
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

  // Updated services to match Shield of Athena's actual offerings
  helpServices: HelpService[] = [
    {
      icon: '🏠',
      title: "Athena's House",
      description:
        'Emergency shelter providing 24/7 safe housing for women and children fleeing conjugal or family violence in a secure, empowering environment.',
      color: '#C8BEEA',
    },
    {
      icon: '💬',
      title: 'Professional Counseling',
      description:
        'Trained social workers, caseworkers, and cultural intermediaries provide multidisciplinary support in over 10 languages.',
      color: '#EEC9D2',
    },
    {
      icon: '⚖️',
      title: 'Legal Support',
      description:
        'Supervised law students and legal advocates provide guidance through police procedures, court processes, and available resources.',
      color: '#F4D292',
    },
    {
      icon: '🌍',
      title: 'Community Outreach',
      description:
        'Information and education programs delivered across Montreal and Laval in multiple languages to raise awareness and prevent violence.',
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

  shareStory(): void {
    if (navigator.share) {
      navigator
        .share({
          title: 'Help Build Hope at Shield of Athena',
          text: 'Join me in supporting women and children escaping violence. Every donation builds safety and hope.',
          url: window.location.href,
        })
        .catch(() => {
          this.copyLinkToClipboard();
        });
    } else {
      this.copyLinkToClipboard();
    }
  }
  private copyLinkToClipboard(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied! Share it with your friends and family.');
    });
  }
}
