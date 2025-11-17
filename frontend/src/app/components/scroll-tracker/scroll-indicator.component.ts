import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface JourneyStep {
  id: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-scroll-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-indicator.component.html',
  styleUrl: './scroll-indicator.component.scss',
})
export class ScrollIndicatorComponent {
  currentSection = 'hero';
  scrollProgress = 0;

  journeySteps: JourneyStep[] = [
    { id: 'hero', icon: 'home', label: 'Welcome' },
    { id: 'how-we-help', icon: 'support', label: 'Our Services' },
    { id: 'impact-stats', icon: 'insights', label: 'Our Impact' },
    { id: 'featured-story', icon: 'auto_stories', label: 'Real Stories' },
    { id: 'shelter-progress', icon: 'volunteer_activism', label: 'Donation Builds' },
    { id: 'final-cta', icon: 'phone', label: 'Get Help' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateCurrentSection();
    this.updateScrollProgress();
  }

  private updateCurrentSection(): void {
    const scrollPosition = window.scrollY + 250;

    for (const step of this.journeySteps) {
      const element = document.getElementById(step.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          this.currentSection = step.id;
          break;
        }
      }
    }
  }

  private updateScrollProgress(): void {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = documentHeight - windowHeight;
    this.scrollProgress = (scrollTop / scrollableHeight) * 100;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  isStepActive(stepId: string): boolean {
    return this.currentSection === stepId;
  }

  isStepCompleted(index: number): boolean {
    const currentIndex = this.journeySteps.findIndex(
      (s) => s.id === this.currentSection
    );
    return index < currentIndex;
  }
}
