import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FuelingService, VehicleService, AuthService } from '../../services';
import { Fueling, Vehicle, CreateFuelingRequest } from '../../models';

@Component({
  selector: 'app-fuelings',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Fuelings</h2>
          <p class="text-gray-400 text-sm">Fuel refuel events, expenditures, and consumption telemetry</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          @if (auth.isManagerOrAdmin()) {
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              (click)="openCreate()">
              + New Fueling
            </button>
          }

          <button
            (click)="loadFuelings()"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors">
            ↻ Refresh
          </button>

          <select
            [(ngModel)]="filterVehicleId"
            (ngModelChange)="onFilterChange()"
            class="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200">
            <option [ngValue]="null">All vehicles</option>
            @for (v of vehicles(); track v.id) {
              <option [ngValue]="v.id">{{ v.licensePlate }} ({{ v.brand }})</option>
            }
          </select>
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
          <button (click)="loadFuelings()" class="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded">
            Retry
          </button>
        </div>
      }

      @if (!isLoading() && !errorMessage()) {
        @if (fuelings().length === 0) {
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p class="text-gray-400 text-sm">No fueling records found.</p>
          </div>
        } @else {
          <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-gray-400 border-b border-gray-800 bg-gray-900/80">
                  <th class="px-6 py-4 font-medium">Date</th>
                  <th class="px-6 py-4 font-medium">Vehicle</th>
                  <th class="px-6 py-4 font-medium">Odometer</th>
                  <th class="px-6 py-4 font-medium">Liters</th>
                  <th class="px-6 py-4 font-medium">Price / L</th>
                  <th class="px-6 py-4 font-medium">Total Cost</th>
                  <th class="px-6 py-4 font-medium">Station</th>
                  @if (auth.isManagerOrAdmin()) {
                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                @for (f of fuelings(); track f.id) {
                  <tr class="hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 text-gray-300 font-mono">
                      {{ f.date | date: 'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 font-medium text-white">
                      {{ f.vehiclePlate || ('Vehicle #' + f.vehicleId) }}
                    </td>
                    <td class="px-6 py-4 font-mono text-gray-300">
                      {{ f.odometer }} km
                    </td>
                    <td class="px-6 py-4 font-semibold text-gray-200">
                      {{ f.liters }} L
                    </td>
                    <td class="px-6 py-4 text-gray-300 font-mono">
                      € {{ f.pricePerLiter }}
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-bold text-emerald-400">
                        € {{ f.totalCost }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-400 text-xs">
                      {{ f.fuelStation || '—' }}
                    </td>
                    @if (auth.isManagerOrAdmin()) {
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="openEdit(f)"
                            class="px-2.5 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors">
                            Edit
                          </button>
                          <button
                            (click)="deleteFueling(f)"
                            class="px-2.5 py-1 text-xs font-medium rounded border border-red-900/60 bg-red-950/40 hover:bg-red-900/60 text-red-300 transition-colors">
                            Delete
                          </button>
                        </div>
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
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div class="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <h3 class="mb-4 text-lg font-semibold text-white">
              {{ editingId() ? 'Edit Fueling' : 'New Fueling' }}
            </h3>

            <form (ngSubmit)="save()" class="space-y-4">
              @if (!editingId()) {
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Vehicle *</label>
                  <select [(ngModel)]="formVehicleId" name="vehicleId" required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
                    @for (v of vehicles(); track v.id) {
                      <option [ngValue]="v.id">{{ v.licensePlate }} ({{ v.brand }})</option>
                    }
                  </select>
                </div>
              }

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Date *</label>
                  <input type="date" [(ngModel)]="formDate" name="date" required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Current Odometer (km) *</label>
                  <input type="number" [(ngModel)]="formOdometer" name="odometer" required min="0"
                    placeholder="e.g. 45200"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Liters (L) *</label>
                  <input type="number" [(ngModel)]="formLiters" name="liters" required step="0.01" min="0.1"
                    placeholder="e.g. 45.5"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Price / Liter (€/L) *</label>
                  <input type="number" [(ngModel)]="formPricePerLiter" name="pricePerLiter" required step="0.001" min="0.1"
                    placeholder="e.g. 1.649"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div class="p-3 rounded-lg bg-gray-950 border border-gray-800 flex justify-between items-center text-xs">
                <span class="text-gray-400">Calculated Total Cost:</span>
                <span class="font-bold text-emerald-400 text-sm">€ {{ computedTotalCost }}</span>
              </div>

              <div>
                <label class="mb-1 block text-xs text-gray-400">Fuel Station / Posto</label>
                <input type="text" [(ngModel)]="formFuelStation" name="fuelStation" maxlength="200"
                  placeholder="e.g. Galp Lisboa, Repsol Faro"
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
              </div>

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
export class FuelingsComponent implements OnInit {
  private readonly fuelingService = inject(FuelingService);
  private readonly vehicleService = inject(VehicleService);
  readonly auth = inject(AuthService);

  readonly fuelings = signal<Fueling[]>([]);
  readonly vehicles = signal<Vehicle[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  filterVehicleId: number | null = null;

  readonly showForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  formVehicleId: number | null = null;
  formDate = new Date().toISOString().slice(0, 10);
  formOdometer: number | null = null;
  formLiters: number | null = null;
  formPricePerLiter: number | null = null;
  formFuelStation = '';

  get computedTotalCost(): string {
    const l = Number(this.formLiters) || 0;
    const p = Number(this.formPricePerLiter) || 0;
    return (l * p).toFixed(2);
  }

  ngOnInit(): void {
    this.loadFuelings();
    this.vehicleService.findAll().subscribe({
      next: (v) => this.vehicles.set(v || [])
    });
  }

  onFilterChange(): void {
    this.loadFuelings();
  }

  loadFuelings(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.fuelingService.findAll(this.filterVehicleId ?? undefined).subscribe({
      next: (data) => {
        this.fuelings.set((data || []).slice().reverse());
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading fuelings from API.');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.formVehicleId = this.vehicles()[0]?.id ?? null;
    this.formDate = new Date().toISOString().slice(0, 10);
    this.formOdometer = null;
    this.formLiters = null;
    this.formPricePerLiter = null;
    this.formFuelStation = '';
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(fueling: Fueling): void {
    this.editingId.set(fueling.id);
    this.formVehicleId = fueling.vehicleId;
    this.formDate = fueling.date;
    this.formOdometer = fueling.odometer;
    this.formLiters = fueling.liters;
    this.formPricePerLiter = fueling.pricePerLiter;
    this.formFuelStation = fueling.fuelStation || '';
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formError.set(null);
  }

  save(): void {
    const odo = Number(this.formOdometer);
    const lit = Number(this.formLiters);
    const prc = Number(this.formPricePerLiter);

    if (!this.formDate || this.formOdometer == null || !this.formLiters || !this.formPricePerLiter) {
      this.formError.set('Please fill in all required fields.');
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    const editId = this.editingId();
    if (editId) {
      const payload = {
        date: this.formDate,
        odometer: odo,
        liters: lit,
        pricePerLiter: prc,
        fuelStation: this.formFuelStation?.trim() || undefined
      };

      this.fuelingService.update(editId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.loadFuelings();
        },
        error: (err) => {
          this.saving.set(false);
          this.formError.set(err?.error?.detail || err?.error?.message || 'Error updating fueling.');
        }
      });
    } else {
      if (!this.formVehicleId) {
        this.formError.set('Vehicle is required.');
        this.saving.set(false);
        return;
      }

      const payload: CreateFuelingRequest = {
        vehicleId: this.formVehicleId,
        date: this.formDate,
        odometer: odo,
        liters: lit,
        pricePerLiter: prc,
        fuelStation: this.formFuelStation?.trim() || undefined
      };

      this.fuelingService.create(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.loadFuelings();
        },
        error: (err) => {
          this.saving.set(false);
          this.formError.set(err?.error?.detail || err?.error?.message || 'Error creating fueling.');
        }
      });
    }
  }

  deleteFueling(fueling: Fueling): void {
    if (!confirm(`Are you sure you want to delete fueling of ${fueling.liters}L (${fueling.date})?`)) {
      return;
    }

    this.fuelingService.delete(fueling.id).subscribe({
      next: () => this.loadFuelings(),
      error: (err) => {
        alert(err?.error?.detail || err?.error?.message || 'Error deleting fueling.');
      }
    });
  }
}
