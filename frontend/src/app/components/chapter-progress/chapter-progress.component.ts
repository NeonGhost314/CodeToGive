import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chapter } from '../../models/story.model';

@Component({
  selector: 'app-chapter-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chapter-progress.component.html',
  styleUrl: './chapter-progress.component.scss',
})
export class ChapterProgressComponent {
  @Input() chapters: Chapter[] = [];
  @Input() size: 'small' | 'large' = 'small';
  @Input() showLabels: boolean = false;
}
