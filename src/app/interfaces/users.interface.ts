import { Observable } from 'rxjs';
import { User } from '../models';

export interface IUsersService {
  getUsers(): Observable<User[]>;
  getUserById(id: number): Observable<User>;
  createUser(user: any): Observable<User>;
  updateUser(id: number, user: any): Observable<User>;
  deleteUser(id: number): Observable<void>;
}
