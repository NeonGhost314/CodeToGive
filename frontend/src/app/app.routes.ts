import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DonationPageComponent } from './pages/donation-page/donation-page.component';
import { FundDetailPageComponent } from './pages/fund-detail-page/fund-detail-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent
  },
  {
    path: 'donation',
    component: DonationPageComponent
  },
  {
    path: 'donation/:id',
    component: FundDetailPageComponent
  }
];
