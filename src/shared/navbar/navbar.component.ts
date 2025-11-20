import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NAVIGATION_MENU, NAVIGATION_ROUTES } from '../../app/config/navigation.config';
import { AuthenticationService } from '../../app/services/authentication.service';

// Ant Design Imports
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    NzAvatarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  navigationMenu = NAVIGATION_MENU;
  navigationRoutes = NAVIGATION_ROUTES;
  mobileMenuOpen = signal(false);
  username = signal<string | null>(null);

  constructor(
    public router: Router,
    private authService: AuthenticationService
  ) { }

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

  getIcon(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      'dashboard': 'dashboard',
      'hotel': 'home',
      'door_front': 'appstore',
      'calendar_month': 'calendar',
      'people': 'team'
    };
    return iconMap[iconName] || 'appstore';
  }
}
