import { Component } from '@angular/core';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { VideoJourneyComponent } from '../../components/journey/journey.component';
import { VideoEventsComponent } from '../../components/event-component/events.component';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [VideoPlayerComponent, NavbarComponent, VideoJourneyComponent, VideoEventsComponent],
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent {}
