import { Routes } from '@angular/router';
import { DonationPageComponent } from './pages/donation-page/donation-page.component';
import { FundDetailPageComponent } from './pages/fund-detail-page/fund-detail-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { PaymentConfirmationComponent } from './pages/payment-confirmation/payment-confirmation.component';
import { LandingComponent } from './pages/landing/landing.component';
import { VideoComponent } from './pages/video-page/video.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
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
  },
  {
    path: 'video',
    component: VideoComponent
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
