import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScrollSection {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-scroll-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-tracker.component.html',
  styleUrl: './scroll-tracker.component.scss',
})
export class ScrollTrackerComponent {
  currentSection = 'hero';
  scrollProgress = 0;

  sections: ScrollSection[] = [
    { id: 'hero', label: 'Welcome', icon: '🏠' },
    { id: 'how-we-help', label: 'Our Services', icon: '🤝' },
    { id: 'impact-stats', label: 'Our Impact', icon: '📊' },
    { id: 'featured-story', label: 'Real Stories', icon: '💙' },
    { id: 'final-cta', label: 'Take Action', icon: '🆘' },
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.updateCurrentSection();
    this.updateScrollProgress();
  }

  private updateCurrentSection(): void {
    const scrollPosition = window.scrollY + 250;

    for (const section of this.sections) {
      const element = document.getElementById(section.id);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (
          scrollPosition >= offsetTop &&
          scrollPosition < offsetTop + offsetHeight
        ) {
          this.currentSection = section.id;
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

  getSectionProgress(index: number): number {
    const currentIndex = this.sections.findIndex(
      (s) => s.id === this.currentSection
    );
    if (index < currentIndex) return 100;
    if (index > currentIndex) return 0;

    const section = this.sections[index];
    const element = document.getElementById(section.id);
    if (!element) return 0;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const sectionTop = rect.top;
    const sectionHeight = rect.height;

    if (sectionTop > viewportHeight) return 0;
    if (sectionTop + sectionHeight < 0) return 100;

    const visibleHeight = Math.min(viewportHeight - sectionTop, sectionHeight);
    return (visibleHeight / sectionHeight) * 100;
  }
}
