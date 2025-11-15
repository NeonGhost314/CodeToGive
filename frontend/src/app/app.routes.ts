import { Routes } from '@angular/router';
import { DonationComponent } from './pages/donation/donation.component';
import { VideoComponent } from './pages/video-page/video.component';

export const routes: Routes = [
  {
    path: 'donation',
    component: DonationComponent
  },  
  {
    path: 'video',
    component: VideoComponent
  }
];
