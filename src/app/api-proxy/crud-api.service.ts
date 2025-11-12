import { Observable } from 'rxjs';
import { IApiService } from './api.service';

export interface ICrudApiService<T, ID = any> extends IApiService {
  
  getAll(): Observable<T[]>;
  
  getById(id: ID): Observable<T>;
  
  create(entity: Partial<T>): Observable<T>;
  
  update(id: ID, entity: Partial<T>): Observable<T>;
  
  delete(id: ID): Observable<void>;
}
