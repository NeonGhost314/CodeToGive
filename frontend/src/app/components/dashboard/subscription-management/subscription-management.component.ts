import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from '../../../models/dashboard.model';

@Component({
  selector: 'app-subscription-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription-management.component.html',
  styleUrl: './subscription-management.component.scss'
})
export class SubscriptionManagementComponent implements OnInit {
  subscriptions: Subscription[] = [];
  isLoading: boolean = true;
  error?: string;
  actionLoading?: number; // subscription ID being acted upon

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadSubscriptions(userId);
    }
  }

  loadSubscriptions(userId: number): void {
    this.isLoading = true;
    this.dashboardService.getSubscriptions(userId).subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load subscriptions';
        this.isLoading = false;
      }
    });
  }

  updateSubscription(subscriptionId: number, action: 'pause' | 'resume' | 'cancel'): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.actionLoading = subscriptionId;
    const status = action === 'pause' ? 'paused' : action === 'resume' ? 'active' : 'cancelled';

    this.dashboardService.updateSubscription(userId, subscriptionId, { status }).subscribe({
      next: () => {
        this.actionLoading = undefined;
        this.loadSubscriptions(userId);
      },
      error: (error) => {
        this.error = 'Failed to update subscription';
        this.actionLoading = undefined;
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

  formatFrequency(frequency: string): string {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  }
}

