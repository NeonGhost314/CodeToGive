import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';
  error: string = '';
  isSubmitting: boolean = false;

  @Output() loginSuccess = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isSubmitting = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.setUserId(response.user_id);
        this.isSubmitting = false;
        this.loginSuccess.emit();
        
        // Vérifier s'il y a une URL de retour (pour rediriger vers la page de paiement)
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigate([returnUrl]);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = error.message || 'Login failed. Please try again.';
      }
    });
  }
}

