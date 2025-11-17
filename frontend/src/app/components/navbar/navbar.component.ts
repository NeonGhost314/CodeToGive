import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { COLORS } from '../../shared/constants/colors.constants';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() showSupportButton: boolean = true;
  @Input() showOurMission: boolean = true;
  @Input() showLoginButton: boolean = true;
  colors = COLORS;
  isAuthenticated: boolean = false;
  showUserMenu: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
    // Check auth status periodically to update UI
    setInterval(() => this.checkAuthStatus(), 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-container')) {
      this.showUserMenu = false;
    }
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  toggleUserMenu(event: Event): void {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  goToLogin(): void {
    this.router.navigate(['/auth']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
    this.showUserMenu = false;
  }

  logout(): void {
    this.authService.logout();
    this.isAuthenticated = false;
    this.showUserMenu = false;
    this.router.navigate(['/']);
  }
}
