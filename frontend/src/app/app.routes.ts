import { Routes } from '@angular/router';
import { DonationComponent } from './pages/donation/donation.component';
import { VideoComponent } from './pages/video-page/video.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthComponent } from './pages/auth/auth.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  {
    path: '', // Default route (landing page)
    component: HomeComponent 
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
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  }
];