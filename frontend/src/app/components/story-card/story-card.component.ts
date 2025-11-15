import { Component, Input, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HealingStory } from '../../models/story.model';
import { ChapterProgressComponent } from '../chapter-progress/chapter-progress.component';

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ChapterProgressComponent],
  templateUrl: './story-card.component.html',
  styleUrl: './story-card.component.scss',
})
export class StoryCardComponent {
  @Input() story!: HealingStory;

  cardRotation = { x: 0, y: 0 };
  isHovered = false;

  constructor(private el: ElementRef) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (!this.isHovered) return;

    const card = this.el.nativeElement.querySelector('.card');
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    this.cardRotation = { x: rotateX, y: rotateY };
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
    this.cardRotation = { x: 0, y: 0 };
  }

  get cardStyle(): any {
    return {
      transform: `perspective(1000px) rotateX(${
        this.cardRotation.x
      }deg) rotateY(${this.cardRotation.y}deg) ${
        this.isHovered ? 'translateZ(50px)' : 'translateZ(0)'
      }`,
      transition: this.isHovered
        ? 'transform 0.1s ease-out'
        : 'transform 0.3s ease-out',
    };
  }

  get unlockedCount(): number {
    return this.story.chapters.filter((c) => c.isUnlocked).length;
  }
}
