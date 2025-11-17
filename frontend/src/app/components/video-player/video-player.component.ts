import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent {
  @Input() videoSrc!: string;

  get hasSource(): boolean {
    return typeof this.videoSrc === 'string' && this.videoSrc.trim().length > 0;
  }
}
