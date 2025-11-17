import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NAVIGATION_MENU, NAVIGATION_ROUTES } from '../../app/config/navigation.config';
import { AuthenticationService } from '../../app/services/authentication.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  navigationMenu = NAVIGATION_MENU;
  navigationRoutes = NAVIGATION_ROUTES;
  mobileMenuOpen = signal(false);
  username = signal<string | null>(null);

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username.set(user.username || 'User');
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  navigate(route: string): void {
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate([NAVIGATION_ROUTES.LOGIN]);
  }
}
