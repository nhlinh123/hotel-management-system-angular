import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HotelsService } from '../../app/services/hotels.service';
import { Hotel } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

// Ant Design Imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-hotels-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzIconModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzAlertModule
  ],
  templateUrl: './hotels-list.component.html',
  styleUrl: './hotels-list.component.scss'
})
export class HotelsListComponent implements OnInit {
  hotels = signal<Hotel[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Modal & Form
  isVisible = false;
  isConfirmLoading = false;
  hotelForm: FormGroup;
  isEditMode = false;
  currentHotelId: number | null = null;

  constructor(
    private hotelsService: HotelsService,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.hotelForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

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

  showModal(): void {
    this.isVisible = true;
    this.isEditMode = false;
    this.currentHotelId = null;
    this.hotelForm.reset();
  }

  editHotel(hotel: Hotel): void {
    this.isVisible = true;
    this.isEditMode = true;
    this.currentHotelId = hotel.id;
    this.hotelForm.patchValue({
      name: hotel.name,
      address: hotel.address,
      city: hotel.city,
      country: hotel.country
    });
  }

  handleOk(): void {
    if (this.hotelForm.valid) {
      this.isConfirmLoading = true;
      const hotelData = this.hotelForm.value;

      if (this.isEditMode && this.currentHotelId) {
        this.hotelsService.updateHotel(this.currentHotelId, hotelData).subscribe({
          next: () => {
            this.message.success('Hotel updated successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadHotels();
          },
          error: (err) => {
            this.message.error('Failed to update hotel');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      } else {
        this.hotelsService.createHotel(hotelData).subscribe({
          next: () => {
            this.message.success('Hotel created successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadHotels();
          },
          error: (err) => {
            this.message.error('Failed to create hotel');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      }
    } else {
      Object.values(this.hotelForm.controls).forEach(control => {
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

  deleteHotel(id: number): void {
    this.hotelsService.deleteHotel(id).subscribe({
      next: () => {
        this.message.success('Hotel deleted successfully');
        this.loadHotels();
      },
      error: (err) => {
        this.message.error('Failed to delete hotel');
        console.error('Error:', err);
      }
    });
  }
}
