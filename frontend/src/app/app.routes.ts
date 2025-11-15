import { Routes } from '@angular/router';
import { ImpactFundsPageComponent } from './pages/impact-funds-page/impact-funds-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DonationOptionsPageComponent } from './pages/donation-options-page/donation-options-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'impact-funds',
    component: ImpactFundsPageComponent
  },
  {
    path: 'donation-options/:id',
    component: DonationOptionsPageComponent
  }
];
