import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';
import { UserDonationsListComponent } from '../../components/user-donations-list/user-donations-list.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, UserDonationsListComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  user: User | null = null;
  userId: number | null = null;

  // Profile form
  first_name: string = '';
  profileLoading: boolean = false;
  profileSuccess: string | null = null;
  profileError: string | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();

    if (!this.userId) {
      // Redirect to auth if not authenticated
      this.router.navigate(['/auth']);
      return;
    }

    this.loadUser();
  }

  loadUser(): void {
    if (!this.userId) return;

    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.first_name = user.first_name;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        // If user doesn't exist in backend, might be a mock user
        // Try to get from mock data
        const mockUser = this.authService.getMockUser(this.userId!);
        if (mockUser) {
          this.user = {
            id: mockUser.user_id,
            mail: mockUser.email,
            first_name: mockUser.first_name,
            last_name: '',
          };
          this.first_name = mockUser.first_name;
        }
      },
    });
  }

  updateProfile(): void {
    if (!this.userId || !this.first_name.trim()) {
      this.profileError = 'First name is required';
      return;
    }

    this.profileLoading = true;
    this.profileSuccess = null;
    this.profileError = null;

    this.userService.updateProfile(this.userId, this.first_name.trim()).subscribe({
      next: (response) => {
        this.profileLoading = false;
        if (response.success) {
          this.profileSuccess = 'Profile updated successfully';
          if (this.user) {
            this.user.first_name = this.first_name;
          }
          setTimeout(() => {
            this.profileSuccess = null;
          }, 3000);
        }
      },
      error: (err) => {
        this.profileLoading = false;
        this.profileError =
          err.error?.message || 'Failed to update profile. Please try again.';
      },
    });
  }

  logout(): void {
    // Clear user data first
    this.authService.logout();
    this.user = null;
    this.userId = null;
    this.first_name = '';
    // Navigate to home page (landing page)
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}

