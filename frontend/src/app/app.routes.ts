import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/companies/companies.component').then(m => m.CompaniesComponent)
  },
  {
    path: 'vehicles',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/vehicles/vehicles.component').then(m => m.VehiclesComponent)
  },
  { path: '**', redirectTo: '' }
];
