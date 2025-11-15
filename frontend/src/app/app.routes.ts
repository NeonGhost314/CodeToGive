import { Routes } from '@angular/router';
import { DonationComponent } from './pages/donation/donation.component';
import { VideoComponent } from './pages/video-page/video.component';
import { HomeComponent } from './pages/home/home.component'; // Importez le nouveau composant

export const routes: Routes = [
  {
    path: '', // Route par défaut (la landing page)
    component: HomeComponent 
  },
  {
    path: 'donation',
    component: DonationComponent
  },  
  {
    path: 'video',
    component: VideoComponent
  }
];