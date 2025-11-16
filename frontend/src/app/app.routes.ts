import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { DonationPageComponent } from './pages/donation-page/donation-page.component';
import { FundDetailPageComponent } from './pages/fund-detail-page/fund-detail-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { PaymentConfirmationComponent } from './pages/payment-confirmation/payment-confirmation.component';

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
  },
  {
    path: 'payment',
    component: PaymentPageComponent
  },
  {
    path: 'payment/confirmation',
    component: PaymentConfirmationComponent
  }
];
