import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomsService } from '../../app/services/rooms.service';
import { BookingsService } from '../../app/services/bookings.service';
import { Room, Booking } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss'
})
export class RoomDetailComponent implements OnInit {
  form!: FormGroup;
  room = signal<Room | null>(null);
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  isEditing = signal(false);
  roomId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private roomsService: RoomsService,
    private bookingsService: BookingsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.roomId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    const action = this.activatedRoute.snapshot.queryParamMap.get('action');

    if (this.roomId && !isNaN(this.roomId)) {
      this.loadRoom();
    } else if (action === 'add') {
      this.isEditing.set(true);
      this.loading.set(false);
    }
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      roomNumber: ['', [Validators.required, Validators.minLength(1)]],
      type: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0)]],
      available: [true],
      hotelId: ['', [Validators.required]]
    });
  }

  loadRoom(): void {
    if (!this.roomId) return;

    this.loading.set(true);
    this.roomsService.getRoomById(this.roomId).subscribe({
      next: (room) => {
        this.room.set(room);
        this.form.patchValue(room);
        this.loadRoomBookings();
      },
      error: (err) => {
        this.error.set('Failed to load room details');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  loadRoomBookings(): void {
    if (!this.roomId) return;

    this.bookingsService.getBookingsByRoomId(this.roomId).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.loading.set(false);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) {
      this.loadRoom();
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    if (this.roomId) {
      this.roomsService.updateRoom(this.roomId, this.form.value).subscribe({
        next: () => {
          this.isEditing.set(false);
          this.loadRoom();
        },
        error: (err) => {
          this.error.set('Failed to update room');
          this.loading.set(false);
          console.error('Error:', err);
        }
      });
    } else {
      this.roomsService.createRoom(this.form.value).subscribe({
        next: (room) => {
          this.router.navigate([NAVIGATION_ROUTES.ROOMS, room.id]);
        },
        error: (err) => {
          this.error.set('Failed to create room');
          this.loading.set(false);
          console.error('Error:', err);
        }
      });
    }
  }

  deleteRoom(): void {
    if (!this.roomId || !confirm('Are you sure?')) return;

    this.loading.set(true);
    this.roomsService.deleteRoom(this.roomId).subscribe({
      next: () => {
        this.router.navigate([NAVIGATION_ROUTES.ROOMS]);
      },
      error: (err) => {
        this.error.set('Failed to delete room');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  viewBooking(bookingId: number): void {
    this.router.navigate([NAVIGATION_ROUTES.BOOKINGS, bookingId]);
  }

  goBack(): void {
    this.router.navigate([NAVIGATION_ROUTES.ROOMS]);
  }
}
