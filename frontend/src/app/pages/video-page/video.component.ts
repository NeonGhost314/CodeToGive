import { Component } from '@angular/core';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [VideoPlayerComponent, NavbarComponent],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {}
