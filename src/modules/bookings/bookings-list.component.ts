import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingsService } from '../../app/services/bookings.service';
import { RoomsService } from '../../app/services/rooms.service';
import { Booking, Room } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.scss'
})
export class BookingsListComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  rooms = signal<Room[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  filterStatus = signal<string | null>(null);

  constructor(
    private bookingsService: BookingsService,
    private roomsService: RoomsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadBookings();
  }

  loadRooms(): void {
    this.roomsService.getRooms().subscribe({
      next: (data) => {
        this.rooms.set(data);
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
      }
    });
  }

  loadBookings(): void {
    this.loading.set(true);
    this.error.set(null);
    this.bookingsService.getBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load bookings');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  get filteredBookings() {
    return this.filterStatus() 
      ? this.bookings().filter(b => b.status === this.filterStatus())
      : this.bookings();
  }

  getRoomNumber(roomId: number): string {
    return this.rooms().find(r => r.id === roomId)?.roomNumber || 'Unknown';
  }

  viewBooking(id: number): void {
    this.router.navigate([NAVIGATION_ROUTES.BOOKINGS, id]);
  }

  editBooking(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([NAVIGATION_ROUTES.BOOKINGS, id], { queryParams: { action: 'edit' } });
  }

  deleteBooking(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingsService.deleteBooking(id).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (err) => {
          this.error.set('Failed to delete booking');
          console.error('Error:', err);
        }
      });
    }
  }

  addBooking(): void {
    this.router.navigate([NAVIGATION_ROUTES.BOOKINGS], { queryParams: { action: 'add' } });
  }

  setFilter(status: string | null): void {
    this.filterStatus.set(status);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'pending',
      'CONFIRMED': 'confirmed',
      'CHECKED_IN': 'checked-in',
      'CHECKED_OUT': 'checked-out',
      'CANCELLED': 'cancelled'
    };
    return colors[status] || 'pending';
  }
}
