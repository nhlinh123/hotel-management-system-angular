import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RoomsService } from '../../app/services/rooms.service';
import { HotelsService } from '../../app/services/hotels.service';
import { Room, Hotel } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

// Ant Design Imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-rooms-list',
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
    NzSwitchModule,
    NzIconModule,
    NzPopconfirmModule,
    NzTagModule,
    NzSpinModule,
    NzAlertModule
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss'
})
export class RoomsListComponent implements OnInit {
  rooms = signal<Room[]>([]);
  hotels = signal<Hotel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  filterHotelId = signal<number | null>(null);

  // Modal & Form
  isVisible = false;
  isConfirmLoading = false;
  roomForm: FormGroup;
  isEditMode = false;
  currentRoomId: number | null = null;

  constructor(
    private roomsService: RoomsService,
    private hotelsService: HotelsService,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.roomForm = this.fb.group({
      roomNumber: ['', [Validators.required]],
      type: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      available: [true],
      hotelId: [null, [Validators.required]]
    });
  }

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

  showModal(): void {
    this.isVisible = true;
    this.isEditMode = false;
    this.currentRoomId = null;
    this.roomForm.reset({
      available: true,
      price: 0
    });
  }

  editRoom(room: Room): void {
    this.isVisible = true;
    this.isEditMode = true;
    this.currentRoomId = room.id;
    this.roomForm.patchValue({
      roomNumber: room.roomNumber,
      type: room.type,
      price: room.price,
      available: room.available,
      hotelId: room.hotelId
    });
  }

  handleOk(): void {
    if (this.roomForm.valid) {
      this.isConfirmLoading = true;
      const roomData = this.roomForm.value;

      if (this.isEditMode && this.currentRoomId) {
        this.roomsService.updateRoom(this.currentRoomId, roomData).subscribe({
          next: () => {
            this.message.success('Room updated successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadRooms();
          },
          error: (err) => {
            this.message.error('Failed to update room');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      } else {
        this.roomsService.createRoom(roomData).subscribe({
          next: () => {
            this.message.success('Room created successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadRooms();
          },
          error: (err) => {
            this.message.error('Failed to create room');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      }
    } else {
      Object.values(this.roomForm.controls).forEach(control => {
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

  deleteRoom(id: number): void {
    this.roomsService.deleteRoom(id).subscribe({
      next: () => {
        this.message.success('Room deleted successfully');
        this.loadRooms();
      },
      error: (err) => {
        this.message.error('Failed to delete room');
        console.error('Error:', err);
      }
    });
  }

  setFilter(hotelId: number | null): void {
    this.filterHotelId.set(hotelId);
  }
}
