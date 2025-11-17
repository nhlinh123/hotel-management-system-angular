import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../app/services/users.service';
import { User } from '../../app/models';
import { NAVIGATION_ROUTES } from '../../app/config/navigation.config';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

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

  editUser(id: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate([NAVIGATION_ROUTES.USERS, id], { queryParams: { action: 'edit' } });
  }

  deleteUser(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => {
          this.error.set('Failed to delete user');
          console.error('Error:', err);
        }
      });
    }
  }

  addUser(): void {
    this.router.navigate([NAVIGATION_ROUTES.USERS], { queryParams: { action: 'add' } });
  }
}
