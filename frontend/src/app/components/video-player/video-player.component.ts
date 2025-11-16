import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent {
  @Input() videoSrc!: string;
  
  constructor(private sanitizer: DomSanitizer) {}
  
  get safeVideoSrc(): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(this.videoSrc);
  }
}
