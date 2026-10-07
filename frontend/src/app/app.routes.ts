import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'companies',
    loadComponent: () =>
      import('./pages/companies/companies.component').then((m) => m.CompaniesComponent),
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./pages/vehicles/vehicles.component').then((m) => m.VehiclesComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
