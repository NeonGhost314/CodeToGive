import { Component, Input, HostListener } from '@angular/core';
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

  isHovered = false;

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHovered = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHovered = false;
  }

  get unlockedCount(): number {
    return this.story.chapters.filter((c) => c.isUnlocked).length;
  }
}
