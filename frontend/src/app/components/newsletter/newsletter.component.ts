import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NewsletterService, NewsletterSubscription } from '../../services/newsletter.service';
import { NotificationComponent, NotificationType } from '../notification/notification.component';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

@Component({
  selector: 'app-newsletter',
  imports: [FormsModule, NotificationComponent],
  templateUrl: './newsletter.component.html',
  styleUrl: './newsletter.component.scss'
})
export class NewsletterComponent {
  email: string = '';
  selectedLanguage: string = 'en';
  emailError: string = '';
  isSubmitting: boolean = false;
  notifications: Notification[] = [];
  private notificationCounter = 0;

  constructor(private newsletterService: NewsletterService) {}

  get isFormValid(): boolean {
    return this.newsletterService.validateEmail(this.email) && !this.emailError;
  }

  onEmailChange(): void {
    // Clear previous error when user starts typing
    if (this.emailError) {
      this.emailError = '';
    }
    
    // Validate email format if not empty
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

    const subscription: NewsletterSubscription = {
      email: this.email.trim(),
      language: this.selectedLanguage
    };

    this.newsletterService.subscribe(subscription).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.showNotification('success', response.message);
        
        // Reset form after successful submission
        this.email = '';
        this.selectedLanguage = 'en';
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        this.showNotification('error', errorMessage);
      }
    });
  }

  private showNotification(type: NotificationType, message: string): void {
    const notification: Notification = {
      id: ++this.notificationCounter,
      type,
      message
    };
    
    this.notifications.push(notification);
  }

  removeNotification(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}
