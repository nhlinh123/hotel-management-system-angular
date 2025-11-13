import { Routes } from '@angular/router';
import { LoginComponent } from '../modules/login/login.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      // Add your app routes here that require authentication
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
