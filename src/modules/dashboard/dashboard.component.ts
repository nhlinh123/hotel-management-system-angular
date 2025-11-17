import { Component, OnInit, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IDashboardService } from '../../app/interfaces/dashboard.interface';
import { DashboardStats } from '../../app/interfaces/dashboard.interface';
import { DASHBOARD_SERVICE_TOKEN } from '../../app/injection-tokens/injection-token';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    @Inject(DASHBOARD_SERVICE_TOKEN) private dashboardService: IDashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.loading.set(true);
    this.error.set(null);
    this.dashboardService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load dashboard stats');
        this.loading.set(false);
        console.error('Dashboard error:', err);
      }
    });
  }

  navigateToAddHotel(): void {
    this.router.navigate([NAVIGATION_ROUTES.HOTELS], { queryParams: { action: 'add' } });
  }

  navigateToAddRoom(): void {
    this.router.navigate([NAVIGATION_ROUTES.ROOMS], { queryParams: { action: 'add' } });
  }

  navigateToHotels(): void {
    this.router.navigate([NAVIGATION_ROUTES.HOTELS]);
  }

  navigateToRooms(): void {
    this.router.navigate([NAVIGATION_ROUTES.ROOMS]);
  }

  navigateToHotelDetail(hotelId: number): void {
    this.router.navigate([NAVIGATION_ROUTES.HOTELS, hotelId]);
  }
}
