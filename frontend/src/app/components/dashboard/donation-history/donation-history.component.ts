import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { Donation } from '../../../models/dashboard.model';

@Component({
  selector: 'app-donation-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-history.component.html',
  styleUrl: './donation-history.component.scss'
})
export class DonationHistoryComponent implements OnInit {
  donations: Donation[] = [];
  isLoading: boolean = true;
  error?: string;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadDonations(userId);
    }
  }

  loadDonations(userId: number): void {
    this.isLoading = true;
    this.dashboardService.getDonationHistory(userId).subscribe({
      next: (donations) => {
        this.donations = donations;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load donation history';
        this.isLoading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatAmount(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }
}

