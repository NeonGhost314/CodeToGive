import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthFormComponent } from '../../components/auth-form/auth-form.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, AuthFormComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
})
export class AuthComponent {
  mode: 'login' | 'register' = 'login';
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error = null;
  }

  onFormSubmit(data: {
    email: string;
    password: string;
    first_name?: string;
  }): void {
    this.loading = true;
    this.error = null;

    if (this.mode === 'login') {
      this.authService.login(data.email, data.password).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.loading = false;
          this.error =
            err.error?.error || 'Invalid email or password. Please try again.';
        },
      });
    } else {
      // Register mode
      if (!data.first_name) {
        this.error = 'First name is required';
        this.loading = false;
        return;
      }

      this.authService
        .register(data.email, data.password, data.first_name)
        .subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.loading = false;
            this.error =
              err.error?.error ||
              'Failed to create account. Please try again.';
          },
        });
    }
  }
}

