import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoomsService } from '../../app/services/rooms.service';
import { HotelsService } from '../../app/services/hotels.service';
import { Room, Hotel } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss'
})
export class RoomsListComponent implements OnInit {
  rooms = signal<Room[]>([]);
  hotels = signal<Hotel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  filterHotelId = signal<number | null>(null);

  constructor(
    private roomsService: RoomsService,
    private hotelsService: HotelsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHotels();
    this.loadRooms();
  }

  loadHotels(): void {
    this.hotelsService.getHotels().subscribe({
      next: (data) => {
        this.hotels.set(data);
      },
      error: (err) => {
        console.error('Error loading hotels:', err);
      }
    });
  }

  loadRooms(): void {
    this.loading.set(true);
    this.error.set(null);
    this.roomsService.getRooms().subscribe({
      next: (data) => {
        this.rooms.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load rooms');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  get filteredRooms() {
    const filtered = this.filterHotelId() 
      ? this.rooms().filter(r => r.hotelId === this.filterHotelId())
      : this.rooms();
    return filtered;
  }

  getHotelName(hotelId: number): string {
    return this.hotels().find(h => h.id === hotelId)?.name || 'Unknown';
  }

  viewRoom(id: number): void {
    this.router.navigate([NAVIGATION_ROUTES.ROOMS, id]);
  }

  editRoom(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([NAVIGATION_ROUTES.ROOMS, id], { queryParams: { action: 'edit' } });
  }

  deleteRoom(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this room?')) {
      this.roomsService.deleteRoom(id).subscribe({
        next: () => {
          this.loadRooms();
        },
        error: (err) => {
          this.error.set('Failed to delete room');
          console.error('Error:', err);
        }
      });
    }
  }

  addRoom(): void {
    this.router.navigate([NAVIGATION_ROUTES.ROOMS], { queryParams: { action: 'add' } });
  }

  setFilter(hotelId: number | null): void {
    this.filterHotelId.set(hotelId);
  }
}
