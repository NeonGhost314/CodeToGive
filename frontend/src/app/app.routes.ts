import { Routes } from '@angular/router';
import { DonationPageComponent } from './pages/donation-page/donation-page.component';
import { FundDetailPageComponent } from './pages/fund-detail-page/fund-detail-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { PaymentConfirmationComponent } from './pages/payment-confirmation/payment-confirmation.component';
import { LandingComponent } from './pages/landing/landing.component';
import { VideoComponent } from './pages/video-page/video.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

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
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'auth/signup',
    component: AuthComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
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
