import { Provider, InjectionToken, Injector } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { HotelsService } from '../services/hotels.service';
import { RoomsService } from '../services/rooms.service';
import { UsersService } from '../services/users.service';
import { BookingsService } from '../services/bookings.service';
import {
  DASHBOARD_SERVICE_TOKEN,
  HOTELS_SERVICE_TOKEN,
  ROOMS_SERVICE_TOKEN,
  USERS_SERVICE_TOKEN,
  BOOKINGS_SERVICE_TOKEN
} from './injection-token';

// Factory functions
export function dashboardServiceFactory(injector: Injector) {
  return injector.get(DashboardService);
}

export function hotelsServiceFactory(injector: Injector) {
  return injector.get(HotelsService);
}

export function roomsServiceFactory(injector: Injector) {
  return injector.get(RoomsService);
}

export function usersServiceFactory(injector: Injector) {
  return injector.get(UsersService);
}

export function bookingsServiceFactory(injector: Injector) {
  return injector.get(BookingsService);
}

// Providers for DI
export const SERVICE_PROVIDERS: Provider[] = [
  {
    provide: DASHBOARD_SERVICE_TOKEN,
    useFactory: dashboardServiceFactory,
    deps: [Injector]
  },
  {
    provide: HOTELS_SERVICE_TOKEN,
    useFactory: hotelsServiceFactory,
    deps: [Injector]
  },
  {
    provide: ROOMS_SERVICE_TOKEN,
    useFactory: roomsServiceFactory,
    deps: [Injector]
  },
  {
    provide: USERS_SERVICE_TOKEN,
    useFactory: usersServiceFactory,
    deps: [Injector]
  },
  {
    provide: BOOKINGS_SERVICE_TOKEN,
    useFactory: bookingsServiceFactory,
    deps: [Injector]
  }
];
