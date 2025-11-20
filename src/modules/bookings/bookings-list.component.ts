import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BookingsService } from '../../app/services/bookings.service';
import { RoomsService } from '../../app/services/rooms.service';
import { Booking, Room } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

// Ant Design Imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-bookings-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzIconModule,
    NzPopconfirmModule,
    NzTagModule,
    NzDividerModule,
    NzSpinModule,
    NzAlertModule
  ],
  templateUrl: './bookings-list.component.html',
  styleUrl: './bookings-list.component.scss'
})
export class BookingsListComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  rooms = signal<Room[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  filterStatus = signal<string | null>(null);

  // Modal & Form
  isVisible = false;
  isConfirmLoading = false;
  bookingForm: FormGroup;
  isEditMode = false;
  currentBookingId: number | null = null;

  constructor(
    private bookingsService: BookingsService,
    private roomsService: RoomsService,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.bookingForm = this.fb.group({
      roomId: [null, [Validators.required]],
      userId: [null, [Validators.required]], // Assuming we select user by ID for now, or maybe just input ID
      checkInDate: [null, [Validators.required]],
      checkOutDate: [null, [Validators.required]],
      status: ['PENDING', [Validators.required]],
      guestName: [''],
      guestEmail: ['', [Validators.email]],
      guestPhone: ['']
    });
  }

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

  showModal(): void {
    this.isVisible = true;
    this.isEditMode = false;
    this.currentBookingId = null;
    this.bookingForm.reset({
      status: 'PENDING'
    });
  }

  editBooking(booking: Booking): void {
    this.isVisible = true;
    this.isEditMode = true;
    this.currentBookingId = booking.id;
    this.bookingForm.patchValue({
      roomId: booking.roomId,
      userId: booking.userId,
      checkInDate: booking.checkInDate, // Date handling might need adjustment depending on format
      checkOutDate: booking.checkOutDate,
      status: booking.status,
      guestName: booking.guestName,
      guestEmail: booking.guestEmail,
      guestPhone: booking.guestPhone
    });
  }

  handleOk(): void {
    if (this.bookingForm.valid) {
      this.isConfirmLoading = true;
      const bookingData = this.bookingForm.value;

      // Format dates if they are Date objects
      // Assuming backend expects string YYYY-MM-DD or ISO
      // For simplicity, let's assume the form value is compatible or handled by service/interceptor

      if (this.isEditMode && this.currentBookingId) {
        this.bookingsService.updateBooking(this.currentBookingId, bookingData).subscribe({
          next: () => {
            this.message.success('Booking updated successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadBookings();
          },
          error: (err) => {
            this.message.error('Failed to update booking');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      } else {
        this.bookingsService.createBooking(bookingData).subscribe({
          next: () => {
            this.message.success('Booking created successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadBookings();
          },
          error: (err) => {
            this.message.error('Failed to create booking');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      }
    } else {
      Object.values(this.bookingForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  deleteBooking(id: number): void {
    this.bookingsService.deleteBooking(id).subscribe({
      next: () => {
        this.message.success('Booking deleted successfully');
        this.loadBookings();
      },
      error: (err) => {
        this.message.error('Failed to delete booking');
        console.error('Error:', err);
      }
    });
  }

  setFilter(status: string | null): void {
    this.filterStatus.set(status);
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'gold',
      'CONFIRMED': 'blue',
      'CHECKED_IN': 'green',
      'CHECKED_OUT': 'default',
      'CANCELLED': 'red'
    };
    return colors[status] || 'default';
  }
}
