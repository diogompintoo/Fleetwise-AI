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
  {
    path: 'drivers',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/drivers/drivers.component').then(m => m.DriversComponent)
  },
  {
    path: 'trips',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/trips/trips.component').then(m => m.TripsComponent)
  },
  {
    path: 'fuelings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/fuelings/fuelings.component').then(m => m.FuelingsComponent)
  },
  {
    path: 'driver-entry',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/driver-entry/driver-entry.component').then(m => m.DriverEntryComponent)
  },
  { path: '**', redirectTo: '' }
];
