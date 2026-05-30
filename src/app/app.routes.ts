import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register')
      .then(m => m.Register)
  },
  {
    path: 'marketplace',
    loadComponent: () => import('./marketplace/home/home')
      .then(m => m.Home),
    canActivate: [() => {
      const token = localStorage.getItem('foodie_token');
      if (token) return true;
      window.location.href = '/login';
      return false;
    }]
  },
  {
    path: 'farmer/dashboard',
    loadComponent: () => import('./farmer/dashboard/dashboard')
      .then(m => m.Dashboard),
    canActivate: [() => {
      const token = localStorage.getItem('foodie_token');
      const user = localStorage.getItem('foodie_user');
      const role = user ? JSON.parse(user).role : null;
      if (token && role === 'FARMER') return true;
      window.location.href = '/login';
      return false;
    }]
  },
  { path: '**', redirectTo: 'login' }
];