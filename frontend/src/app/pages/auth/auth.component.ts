import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginFormComponent } from '../../components/auth/login-form/login-form.component';
import { SignupFormComponent } from '../../components/auth/signup-form/signup-form.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, SignupFormComponent, NavbarComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  isSignupMode: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Check route to determine if we're in signup mode
    this.route.url.subscribe(url => {
      this.isSignupMode = url.some(segment => segment.path === 'signup');
    });
  }

  switchToLogin(): void {
    this.isSignupMode = false;
    this.router.navigate(['/auth']);
  }

  switchToSignup(): void {
    this.isSignupMode = true;
    this.router.navigate(['/auth/signup']);
  }

  onLoginSuccess(): void {
    // Navigation handled by login form component
  }

  onSignupSuccess(): void {
    // Navigation handled by signup form component
  }
}

