import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VehicleService, CompanyService } from '../../services';
import { Vehicle, Company } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Vehicles</h2>
          <p class="text-gray-400 text-sm">Fleet vehicle inventory, specifications and operational status</p>
        </div>

        <div class="flex items-center gap-3">
          @if (auth.isManagerOrAdmin()) {
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              (click)="openCreate()">
              + New
            </button>
          }

          <button
            (click)="loadVehicles()"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors">
            ↻ Refresh
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <div class="space-y-3 animate-pulse">
          <div class="h-10 bg-gray-900 border border-gray-800 rounded-lg"></div>
          <div class="h-14 bg-gray-900/60 border border-gray-800 rounded-lg"></div>
          <div class="h-14 bg-gray-900/60 border border-gray-800 rounded-lg"></div>
        </div>
      }

      @if (errorMessage()) {
        <div class="bg-red-950/60 border border-red-800 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
          <p class="text-sm">{{ errorMessage() }}</p>
          <button (click)="loadVehicles()" class="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded">
            Retry
          </button>
        </div>
      }

      @if (!isLoading() && !errorMessage()) {
        @if (vehicles().length === 0) {
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p class="text-gray-400 text-sm">No vehicles registered yet.</p>
          </div>
        } @else {
          <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-gray-400 border-b border-gray-800 bg-gray-900/80">
                  <th class="px-6 py-4 font-medium">License Plate</th>
                  <th class="px-6 py-4 font-medium">Brand</th>
                  <th class="px-6 py-4 font-medium">Model</th>
                  <th class="px-6 py-4 font-medium">Year</th>
                  <th class="px-6 py-4 font-medium">Fuel Type</th>
                  <th class="px-6 py-4 font-medium">Status</th>
                  @if (auth.isManagerOrAdmin()) {
                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                @for (vehicle of vehicles(); track vehicle.id) {
                  <tr class="hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 font-mono font-semibold text-blue-300">
                      {{ vehicle.licensePlate }}
                    </td>
                    <td class="px-6 py-4 text-white">{{ vehicle.brand }}</td>
                    <td class="px-6 py-4 text-gray-300">{{ vehicle.model }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ vehicle.manufactureYear }}</td>
                    <td class="px-6 py-4 text-gray-300">
                      <span class="px-2.5 py-1 rounded-md text-xs bg-gray-800 border border-gray-700 text-gray-300">
                        {{ vehicle.fuelType }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      @if (vehicle.active) {
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          Active
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-red-950 text-red-400 border border-red-800/60">
                          Inactive
                        </span>
                      }
                    </td>

                    @if (auth.isManagerOrAdmin()) {
                      <td class="px-6 py-4 text-right space-x-3">
                        <button
                          (click)="openEdit(vehicle)"
                          class="text-blue-400 hover:text-blue-300 text-sm">
                          Edit
                        </button>
                        <button
                          (click)="remove(vehicle.id)"
                          class="text-red-400 hover:text-red-300 text-sm">
                          Delete
                        </button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }

      <!-- Modal Create / Edit -->
      @if (showForm()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div class="w-full max-w-lg rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 class="mb-4 text-lg font-semibold text-white">
              {{ editingId() ? 'Edit Vehicle' : 'New Vehicle' }}
            </h3>

            <form (ngSubmit)="save()" class="space-y-3">
              @if (!editingId()) {
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Company</label>
                  <select
                    [(ngModel)]="formCompanyId"
                    name="companyId"
                    required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
                    <option [ngValue]="null" disabled>Select company</option>
                    @for (c of companies(); track c.id) {
                      <option [ngValue]="c.id">{{ c.name }}</option>
                    }
                  </select>
                </div>
              }

              <div>
                <label class="mb-1 block text-xs text-gray-400">License Plate</label>
                <input type="text" [(ngModel)]="formLicensePlate" name="licensePlate" required maxlength="20"
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Brand</label>
                  <input type="text" [(ngModel)]="formBrand" name="brand" required maxlength="100"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Model</label>
                  <input type="text" [(ngModel)]="formModel" name="model" required maxlength="100"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Year</label>
                  <input type="number" [(ngModel)]="formYear" name="year" required min="1980" max="2030"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Fuel Type</label>
                  <select [(ngModel)]="formFuelType" name="fuelType" required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
                    <option value="DIESEL">DIESEL</option>
                    <option value="GASOLINE">GASOLINE</option>
                    <option value="HYBRID">HYBRID</option>
                    <option value="ELECTRIC">ELECTRIC</option>
                  </select>
                </div>
              </div>

              @if (!editingId()) {
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Initial Mileage</label>
                  <input type="number" [(ngModel)]="formInitialMileage" name="initialMileage" required min="0"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              }

              @if (editingId()) {
                <div class="flex items-center gap-2">
                  <input type="checkbox" [(ngModel)]="formActive" name="active" id="active"
                    class="rounded border-gray-600" />
                  <label for="active" class="text-sm text-gray-300">Active</label>
                </div>
              }

              @if (formError()) {
                <p class="text-sm text-red-400">{{ formError() }}</p>
              }

              <div class="flex justify-end gap-3 pt-2">
                <button type="button" (click)="closeForm()"
                  class="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800">
                  Cancel
                </button>
                <button type="submit" [disabled]="saving()"
                  class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50">
                  {{ saving() ? 'Saving...' : 'Save' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly companyService = inject(CompanyService);
  readonly auth = inject(AuthService);

  readonly vehicles = signal<Vehicle[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly showForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  formCompanyId: number | null = null;
  formLicensePlate = '';
  formBrand = '';
  formModel = '';
  formYear = new Date().getFullYear();
  formFuelType = 'DIESEL';
  formInitialMileage = 0;
  formActive = true;

  ngOnInit(): void {
    this.loadVehicles();
    this.companyService.findAll().subscribe({
      next: (data) => this.companies.set(data || [])
    });
  }

  loadVehicles(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.vehicleService.findAll().subscribe({
      next: (data) => {
        this.vehicles.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading vehicles from API.');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.formCompanyId = this.companies()[0]?.id ?? null;
    this.formLicensePlate = '';
    this.formBrand = '';
    this.formModel = '';
    this.formYear = new Date().getFullYear();
    this.formFuelType = 'DIESEL';
    this.formInitialMileage = 0;
    this.formActive = true;
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(vehicle: Vehicle): void {
    this.editingId.set(vehicle.id);
    this.formCompanyId = vehicle.companyId;
    this.formLicensePlate = vehicle.licensePlate;
    this.formBrand = vehicle.brand;
    this.formModel = vehicle.model;
    this.formYear = vehicle.manufactureYear;
    this.formFuelType = vehicle.fuelType;
    this.formActive = vehicle.active;
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formError.set(null);
  }

  save(): void {
    const licensePlate = this.formLicensePlate.trim();
    const brand = this.formBrand.trim();
    const model = this.formModel.trim();
    const fuelType = this.formFuelType.trim();
    const year = Number(this.formYear);

    if (!licensePlate || !brand || !model || !fuelType || !year) {
      this.formError.set('Please fill all required fields.');
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    const id = this.editingId();

    if (id) {
      this.vehicleService.update(id, {
        licensePlate,
        brand,
        model,
        manufactureYear: year,
        fuelType,
        active: this.formActive
      }).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.loadVehicles();
        },
        error: (err) => {
          this.saving.set(false);
          this.formError.set(err?.error?.detail || err?.error?.title || 'Failed to update vehicle.');
        }
      });
      return;
    }

    if (this.formCompanyId == null) {
      this.saving.set(false);
      this.formError.set('Company is required.');
      return;
    }

    this.vehicleService.create({
      companyId: this.formCompanyId,
      licensePlate,
      brand,
      model,
      manufactureYear: year,
      fuelType,
      initialMileage: Number(this.formInitialMileage) || 0
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.closeForm();
        this.loadVehicles();
      },
      error: (err) => {
        this.saving.set(false);
        this.formError.set(err?.error?.detail || err?.error?.title || 'Failed to create vehicle.');
      }
    });
  }

  remove(id: number): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    this.vehicleService.delete(id).subscribe({
      next: () => this.loadVehicles(),
      error: () => alert('Failed to delete vehicle')
    });
  }
}