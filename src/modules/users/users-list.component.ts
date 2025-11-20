import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../app/services/users.service';
import { User } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

// Ant Design Imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzIconModule,
    NzPopconfirmModule,
    NzTagModule,
    NzSpinModule,
    NzAlertModule
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // Modal & Form
  isVisible = false;
  isConfirmLoading = false;
  userForm: FormGroup;
  isEditMode = false;
  currentUserId: number | null = null;

  constructor(
    private usersService: UsersService,
    private router: Router,
    private fb: FormBuilder,
    private message: NzMessageService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]], // Password required for creation, maybe optional for edit? Logic might need adjustment but keeping simple for now
      roles: ['USER', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.error.set(null);
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load users');
        this.loading.set(false);
        console.error('Error:', err);
      }
    });
  }

  viewUser(id: number): void {
    this.router.navigate([NAVIGATION_ROUTES.USERS, id]);
  }

  showModal(): void {
    this.isVisible = true;
    this.isEditMode = false;
    this.currentUserId = null;
    this.userForm.reset({
      roles: 'USER'
    });
    this.userForm.get('password')?.addValidators(Validators.required);
  }

  editUser(user: User): void {
    this.isVisible = true;
    this.isEditMode = true;
    this.currentUserId = user.id;
    this.userForm.patchValue({
      username: user.username,
      roles: user.roles
    });
    // Password might not be editable directly or optional here. 
    // For now, let's make password optional during edit or just not show it?
    // Usually admin resets password. Let's assume we can update it if provided.
    this.userForm.get('password')?.removeValidators(Validators.required);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  handleOk(): void {
    if (this.userForm.valid) {
      this.isConfirmLoading = true;
      const userData = this.userForm.value;

      if (this.isEditMode && this.currentUserId) {
        // If password is empty during edit, remove it from payload if backend supports partial update
        if (!userData.password) {
          delete userData.password;
        }

        this.usersService.updateUser(this.currentUserId, userData).subscribe({
          next: () => {
            this.message.success('User updated successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadUsers();
          },
          error: (err) => {
            this.message.error('Failed to update user');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      } else {
        this.usersService.createUser(userData).subscribe({
          next: () => {
            this.message.success('User created successfully');
            this.isVisible = false;
            this.isConfirmLoading = false;
            this.loadUsers();
          },
          error: (err) => {
            this.message.error('Failed to create user');
            this.isConfirmLoading = false;
            console.error(err);
          }
        });
      }
    } else {
      Object.values(this.userForm.controls).forEach(control => {
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

  deleteUser(id: number): void {
    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.message.success('User deleted successfully');
        this.loadUsers();
      },
      error: (err) => {
        this.message.error('Failed to delete user');
        console.error('Error:', err);
      }
    });
  }
}
