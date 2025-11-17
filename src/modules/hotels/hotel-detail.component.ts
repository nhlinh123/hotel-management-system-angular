import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelsService } from '../../app/services/hotels.service';
import { RoomsService } from '../../app/services/rooms.service';
import { Hotel, Room } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.scss'
})
export class HotelDetailComponent implements OnInit {
  form!: FormGroup;
  hotel = signal<Hotel | null>(null);
  rooms = signal<Room[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  isEditing = signal(false);
  hotelId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private hotelsService: HotelsService,
    private roomsService: RoomsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.hotelId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    const action = this.activatedRoute.snapshot.queryParamMap.get('action');

    if (this.hotelId && !isNaN(this.hotelId)) {
      this.loadHotel();
    } else if (action === 'add') {
      this.isEditing.set(true);
      this.loading.set(false);
    }
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  loadHotel(): void {
    if (!this.hotelId) return;

    this.loading.set(true);
    this.hotelsService.getHotelById(this.hotelId).subscribe({
      next: (hotel) => {
        this.hotel.set(hotel);
        this.form.patchValue(hotel);
        this.loadHotelRooms();
      },
      error: (err) => {
        this.error.set('Failed to load hotel details');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  loadHotelRooms(): void {
    if (!this.hotelId) return;

    this.roomsService.getRoomsByHotelId(this.hotelId).subscribe({
      next: (rooms) => {
        this.rooms.set(rooms);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading rooms:', err);
        this.loading.set(false);
      }
    });
  }

  toggleEdit(): void {
    this.isEditing.update(v => !v);
    if (!this.isEditing()) {
      this.loadHotel();
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set(null);

    if (this.hotelId) {
      this.hotelsService.updateHotel(this.hotelId, this.form.value).subscribe({
        next: () => {
          this.isEditing.set(false);
          this.loadHotel();
        },
        error: (err) => {
          this.error.set('Failed to update hotel');
          this.loading.set(false);
          console.error('Error:', err);
        }
      });
    } else {
      this.hotelsService.createHotel(this.form.value).subscribe({
        next: (hotel) => {
          this.router.navigate([NAVIGATION_ROUTES.HOTELS, hotel.id]);
        },
        error: (err) => {
          this.error.set('Failed to create hotel');
          this.loading.set(false);
          console.error('Error:', err);
        }
      });
    }
  }

  deleteHotel(): void {
    if (!this.hotelId || !confirm('Are you sure?')) return;

    this.loading.set(true);
    this.hotelsService.deleteHotel(this.hotelId).subscribe({
      next: () => {
        this.router.navigate([NAVIGATION_ROUTES.HOTELS]);
      },
      error: (err) => {
        this.error.set('Failed to delete hotel');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  viewRoom(roomId: number): void {
    this.router.navigate([NAVIGATION_ROUTES.ROOMS, roomId]);
  }

  goBack(): void {
    this.router.navigate([NAVIGATION_ROUTES.HOTELS]);
  }
}
