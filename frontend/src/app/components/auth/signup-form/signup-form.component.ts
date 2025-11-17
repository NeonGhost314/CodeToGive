import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-form.component.html',
  styleUrl: './signup-form.component.scss'
})
export class SignupFormComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  error: string = '';
  isSubmitting: boolean = false;

  @Output() signupSuccess = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Vérifier si c'est une inscription post-donation
    if (this.authService.isPostDonationSignup()) {
      const donorInfo = this.authService.getDonorInfo();
      if (donorInfo) {
        // Pré-remplir l'email
        this.email = donorInfo.email;
        
        // Extraire et pré-remplir le prénom et nom du nom sur la carte
        const names = this.authService.extractNamesFromCardName(donorInfo.cardName);
        this.firstName = names.firstName;
        this.lastName = names.lastName;
      }
    }
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    return password.length >= 6;
  }

  onSubmit(): void {
    this.error = '';

    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.error = 'Please enter a valid email address';
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.error = 'Password must be at least 6 characters long';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.isSubmitting = true;

    this.authService.signup(this.firstName, this.lastName, this.email, this.password).subscribe({
      next: (response) => {
        this.authService.setUserId(response.user_id);
        this.isSubmitting = false;
        this.signupSuccess.emit();
        
        // Si c'est une inscription post-donation, rediriger avec le flag spécial
        if (this.authService.isPostDonationSignup()) {
          // NE PAS nettoyer les données ici - elles seront nettoyées après le chargement du dashboard
          sessionStorage.setItem('skipDefaultData', 'true');
          this.router.navigate(['/dashboard']);
        } else {
          // Inscription normale - rediriger vers le dashboard
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.error = error.message || 'Signup failed. Please try again.';
      }
    });
  }
}

