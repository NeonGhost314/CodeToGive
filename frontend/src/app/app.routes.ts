import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
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
