import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  // Contact information
  organizationName = 'Shield of Athena';
  address = 'Montreal, Quebec, Canada';
  phone = '514-873-9010';
  emailContact = 'info@bouclierdathena.com';
  facebookUrl = 'https://www.facebook.com/bouclierdathena';
  
  // Newsletter
  email: string = '';
  selectedLanguage: string = 'en';
  emailError: string = '';
  isSubmitting: boolean = false;
  isSubscribed: boolean = false;
  
  get currentYear(): number {
    return new Date().getFullYear();
  }

  constructor(private newsletterService: NewsletterService) {}

  get isFormValid(): boolean {
    return this.newsletterService.validateEmail(this.email) && !this.emailError;
  }

  onEmailChange(): void {
    if (this.emailError) {
      this.emailError = '';
    }
    if (this.email && !this.newsletterService.validateEmail(this.email)) {
      this.emailError = 'Please enter a valid email address.';
    }
  }

  onSubscribe(): void {
    if (!this.isFormValid || this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;
    this.emailError = '';

    this.newsletterService.subscribe({
      email: this.email.trim(),
      language: this.selectedLanguage
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSubscribed = true;
        this.email = '';
        
        // Set flag for badge unlock
        localStorage.setItem('newsletterSubscribed', 'true');
        
        // Broadcast the event globally for badge update
        window.dispatchEvent(new CustomEvent('newsletterSubscribed'));
      },
      error: (error) => {
        this.isSubmitting = false;
        this.emailError = error.message || 'Subscription failed. Please try again.';
      }
    });
  }

  onCallPhone(): void {
    window.open(`tel:${this.phone}`);
  }

  onSendEmail(): void {
    window.open(`mailto:${this.emailContact}`);
  }

  onFacebookClick(): void {
    window.open(this.facebookUrl, '_blank');
  }
}

