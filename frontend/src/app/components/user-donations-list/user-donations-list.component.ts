import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, Donation } from '../../services/user.service';

@Component({
  selector: 'app-user-donations-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-donations-list.component.html',
  styleUrl: './user-donations-list.component.scss',
})
export class UserDonationsListComponent implements OnInit {
  @Input() userId!: number;

  donations: Donation[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.userId) {
      this.loadDonations();
    }
  }

  loadDonations(): void {
    this.loading = true;
    this.error = null;

    this.userService.getUserDonations(this.userId).subscribe({
      next: (donations) => {
        this.donations = donations;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load donations';
        this.loading = false;
        console.error('Error loading donations:', err);
      },
    });
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  getStateClass(state: string): string {
    const stateLower = state.toLowerCase();
    if (stateLower === 'completed' || stateLower === 'success') {
      return 'state-success';
    } else if (stateLower === 'pending') {
      return 'state-pending';
    } else {
      return 'state-default';
    }
  }
}

