import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserApiService } from '../api-proxy/user-api.service';
import { IUsersService } from '../interfaces/users.interface';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements IUsersService {
  constructor(private userApi: UserApiService) {}

  getUsers(): Observable<User[]> {
    return this.userApi.getAll();
  }

  getUserById(id: number): Observable<User> {
    return this.userApi.getById(id);
  }

  createUser(user: any): Observable<User> {
    return this.userApi.create(user);
  }

  updateUser(id: number, user: any): Observable<User> {
    return this.userApi.update(id, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.userApi.delete(id);
  }
}
