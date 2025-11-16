import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { DonationComponent } from './pages/donation/donation.component';
import { VideoComponent } from './pages/video-page/video.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'donation',
    component: DonationComponent
  },
  {
    path: 'video',
    component: VideoComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  // Story detail page will be added by Yann's team I guess
  // {
  //   path: 'story/:id',
  //   component: StoryDetailComponent
  // },
  {
    path: '**',
    redirectTo: '',
  },
];
