import { Routes } from '@angular/router';
import { LoginComponent } from '../modules/login/login.component';
import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { HotelsListComponent } from '../modules/hotels/hotels-list.component';
import { HotelDetailComponent } from '../modules/hotels/hotel-detail.component';
import { RoomsListComponent } from '../modules/rooms/rooms-list.component';
import { RoomDetailComponent } from '../modules/rooms/room-detail.component';
import { UsersListComponent } from '../modules/users/users-list.component';
import { BookingsListComponent } from '../modules/bookings/bookings-list.component';
import { authGuard } from './services/auth.guard';
import { NAVIGATION_ROUTES } from './config/navigation.config';

export const routes: Routes = [
  {
    path: NAVIGATION_ROUTES.LOGIN.substring(1),
    component: LoginComponent
  },
  {
    path: NAVIGATION_ROUTES.DASHBOARD.substring(1),
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: NAVIGATION_ROUTES.HOTELS.substring(1),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: HotelsListComponent
      },
      {
        path: ':id',
        component: HotelDetailComponent
      }
    ]
  },
  {
    path: NAVIGATION_ROUTES.ROOMS.substring(1),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: RoomsListComponent
      },
      {
        path: ':id',
        component: RoomDetailComponent
      }
    ]
  },
  {
    path: NAVIGATION_ROUTES.USERS.substring(1),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: UsersListComponent
      }
    ]
  },
  {
    path: NAVIGATION_ROUTES.BOOKINGS.substring(1),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: BookingsListComponent
      }
    ]
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: NAVIGATION_ROUTES.DASHBOARD.substring(1),
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: NAVIGATION_ROUTES.LOGIN
  }
];
