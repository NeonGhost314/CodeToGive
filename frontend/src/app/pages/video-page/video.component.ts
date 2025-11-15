import { Component } from '@angular/core';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [VideoPlayerComponent],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {}
