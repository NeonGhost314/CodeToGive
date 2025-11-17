import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';

export interface NewsletterSubscription {
  email: string;
  language: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor() { }

  /**
   * Validates email format using a comprehensive regex
   */
  validateEmail(email: string): boolean {
    if (!email) return false;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Subscribes user to newsletter
   * This is a mock implementation that simulates backend API call
   */
  subscribe(subscription: NewsletterSubscription): Observable<NewsletterResponse> {
    // Validate email
    if (!this.validateEmail(subscription.email)) {
      return throwError(() => ({ 
        success: false, 
        message: 'Please enter a valid email address.' 
      }));
    }

    // Simulate API call with delay
    // In production, this would be an HTTP call to your backend
    return of({
      success: true,
      message: 'Thank you for subscribing! You\'ll receive a confirmation email shortly.'
    }).pipe(delay(1000)); // Simulate network delay
  }

  /**
   * Check if email is already subscribed (mock implementation)
   */
  isEmailSubscribed(email: string): Observable<boolean> {
    // This would typically check against your backend database
    const mockSubscribedEmails = ['test@example.com', 'existing@user.com'];
    return of(mockSubscribedEmails.includes(email.toLowerCase())).pipe(delay(500));
  }
}
