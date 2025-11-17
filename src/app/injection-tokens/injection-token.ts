import {InjectionToken} from '@angular/core';
import {IAuthentication} from '../interfaces/authentication.interface';
import {IDashboardService} from '../interfaces/dashboard.interface';
import {IHotelsService} from '../interfaces/hotels.interface';
import {IRoomsService} from '../interfaces/rooms.interface';
import {IUsersService} from '../interfaces/users.interface';
import {IBookingsService} from '../interfaces/bookings.interface';

export const AUTHENTICATION_SERVICE_TOKEN = new InjectionToken<IAuthentication>('AUTHENTICATION_SERVICE_TOKEN');
export const DASHBOARD_SERVICE_TOKEN = new InjectionToken<IDashboardService>('DASHBOARD_SERVICE_TOKEN');
export const HOTELS_SERVICE_TOKEN = new InjectionToken<IHotelsService>('HOTELS_SERVICE_TOKEN');
export const ROOMS_SERVICE_TOKEN = new InjectionToken<IRoomsService>('ROOMS_SERVICE_TOKEN');
export const USERS_SERVICE_TOKEN = new InjectionToken<IUsersService>('USERS_SERVICE_TOKEN');
export const BOOKINGS_SERVICE_TOKEN = new InjectionToken<IBookingsService>('BOOKINGS_SERVICE_TOKEN');
