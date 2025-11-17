import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardData, User } from '../../models/dashboard.model';
import { DonationHistoryComponent } from '../../components/dashboard/donation-history/donation-history.component';
import { SubscriptionManagementComponent } from '../../components/dashboard/subscription-management/subscription-management.component';
import { PersonalGoalsComponent } from '../../components/dashboard/personal-goals/personal-goals.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    DonationHistoryComponent,
    SubscriptionManagementComponent,
    PersonalGoalsComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  dashboardData?: DashboardData;
  isLoading: boolean = true;
  error?: string;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/auth']);
      return;
    }

    this.loadDashboardData(userId);
  }

  loadDashboardData(userId: number): void {
    this.isLoading = true;
    this.dashboardService.getDashboardData(userId).subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load dashboard data';
        this.isLoading = false;
      }
    });
  }


  getUserFullName(): string {
    if (!this.dashboardData?.user) return 'User';
    return `${this.dashboardData.user.first_name} ${this.dashboardData.user.last_name}`;
  }

  getTotalDonations(): number {
    return this.dashboardData?.total_donations || 0;
  }
}

