import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HotelsService } from '../../app/services/hotels.service';
import { Hotel } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

@Component({
  selector: 'app-hotels-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotels-list.component.html',
  styleUrl: './hotels-list.component.scss'
})
export class HotelsListComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private hotelsService: HotelsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHotels();
  }

  loadHotels(): void {
    this.loading.set(true);
    this.error.set(null);
    this.hotelsService.getHotels().subscribe({
      next: (data) => {
        this.hotels.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load hotels');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  viewHotel(id: number): void {
    this.router.navigate([NAVIGATION_ROUTES.HOTELS, id]);
  }

  editHotel(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([NAVIGATION_ROUTES.HOTELS, id], { queryParams: { action: 'edit' } });
  }

  deleteHotel(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this hotel?')) {
      this.hotelsService.deleteHotel(id).subscribe({
        next: () => {
          this.loadHotels();
        },
        error: (err) => {
          this.error.set('Failed to delete hotel');
          console.error('Error:', err);
        }
      });
    }
  }

  addHotel(): void {
    this.router.navigate([NAVIGATION_ROUTES.HOTELS], { queryParams: { action: 'add' } });
  }
}
