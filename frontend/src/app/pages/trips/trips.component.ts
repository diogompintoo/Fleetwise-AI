import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripService, VehicleService, DriverService, AuthService } from '../../services';
import { Trip, Vehicle, Driver, CreateTripRequest } from '../../models';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [DatePipe, FormsModule],
  template: `
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Trips & Mileage</h2>
          <p class="text-gray-400 text-sm">Dispatches, route logs, and mileage telemetry</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          @if (auth.isManagerOrAdmin()) {
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              (click)="openCreate()">
              + New Trip
            </button>
          }

          <button
            (click)="loadTrips()"
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
          <button (click)="loadTrips()" class="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded">
            Retry
          </button>
        </div>
      }

      @if (!isLoading() && !errorMessage()) {
        @if (trips().length === 0) {
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p class="text-gray-400 text-sm">No trips recorded yet.</p>
          </div>
        } @else {
          <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-gray-400 border-b border-gray-800 bg-gray-900/80">
                  <th class="px-6 py-4 font-medium">Date</th>
                  <th class="px-6 py-4 font-medium">Vehicle</th>
                  <th class="px-6 py-4 font-medium">Driver</th>
                  <th class="px-6 py-4 font-medium">Route</th>
                  <th class="px-6 py-4 font-medium">Odometer</th>
                  <th class="px-6 py-4 font-medium">Distance</th>
                  <th class="px-6 py-4 font-medium">Purpose</th>
                  @if (auth.isManagerOrAdmin()) {
                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                @for (trip of trips(); track trip.id) {
                  <tr class="hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 text-gray-300 font-mono">
                      {{ trip.date | date: 'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 font-medium text-white">
                      {{ trip.vehiclePlate || ('Vehicle #' + trip.vehicleId) }}
                    </td>
                    <td class="px-6 py-4 text-gray-300">
                      {{ trip.driverName || ('Driver #' + trip.driverId) }}
                    </td>
                    <td class="px-6 py-4 text-gray-200">
                      <span class="text-gray-400">{{ trip.startLocation }}</span>
                      <span class="text-blue-400 mx-1.5">→</span>
                      <span>{{ trip.endLocation }}</span>
                    </td>
                    <td class="px-6 py-4 font-mono text-xs text-gray-400">
                      {{ trip.startMileage }} → {{ trip.endMileage }} km
                    </td>
                    <td class="px-6 py-4">
                      <span class="font-semibold text-blue-400">
                        {{ trip.distance }} km
                      </span>
                    </td>
                    <td class="px-6 py-4 text-gray-400 text-xs max-w-xs truncate">
                      {{ trip.purpose || '—' }}
                    </td>
                    @if (auth.isManagerOrAdmin()) {
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="openEdit(trip)"
                            class="px-2.5 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors">
                            Edit
                          </button>
                          <button
                            (click)="deleteTrip(trip)"
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
              {{ editingId() ? 'Edit Trip' : 'New Trip' }}
            </h3>

            <form (ngSubmit)="save()" class="space-y-4">
              @if (!editingId()) {
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="mb-1 block text-xs text-gray-400">Vehicle *</label>
                    <select [(ngModel)]="formVehicleId" name="vehicleId" required
                      class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
                      @for (v of vehicles(); track v.id) {
                        <option [ngValue]="v.id">{{ v.licensePlate }} ({{ v.brand }})</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="mb-1 block text-xs text-gray-400">Driver *</label>
                    <select [(ngModel)]="formDriverId" name="driverId" required
                      class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
                      @for (d of drivers(); track d.id) {
                        <option [ngValue]="d.id">{{ d.name }}</option>
                      }
                    </select>
                  </div>
                </div>
              }

              <div>
                <label class="mb-1 block text-xs text-gray-400">Date *</label>
                <input type="date" [(ngModel)]="formDate" name="date" required
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Start Location (Origem) *</label>
                  <input type="text" [(ngModel)]="formStartLocation" name="startLocation" required maxlength="255"
                    placeholder="e.g. Lisboa"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-gray-400">End Location (Destino) *</label>
                  <input type="text" [(ngModel)]="formEndLocation" name="endLocation" required maxlength="255"
                    placeholder="e.g. Porto"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Start Mileage (km) *</label>
                  <input type="number" [(ngModel)]="formStartMileage" name="startMileage" required min="0"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="mb-1 block text-xs text-gray-400">End Mileage (km) *</label>
                  <input type="number" [(ngModel)]="formEndMileage" name="endMileage" required min="0"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div class="p-3 rounded-lg bg-gray-950 border border-gray-800 flex justify-between items-center text-xs">
                <span class="text-gray-400">Calculated Distance:</span>
                <span class="font-semibold text-blue-400 text-sm">{{ computedDistance }} km</span>
              </div>

              <div>
                <label class="mb-1 block text-xs text-gray-400">Purpose / Notes</label>
                <input type="text" [(ngModel)]="formPurpose" name="purpose" maxlength="500"
                  placeholder="e.g. Regular client delivery"
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
export class TripsComponent implements OnInit {
  private readonly tripService = inject(TripService);
  private readonly vehicleService = inject(VehicleService);
  private readonly driverService = inject(DriverService);
  readonly auth = inject(AuthService);

  readonly trips = signal<Trip[]>([]);
  readonly vehicles = signal<Vehicle[]>([]);
  readonly drivers = signal<Driver[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  filterVehicleId: number | null = null;

  readonly showForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  formVehicleId: number | null = null;
  formDriverId: number | null = null;
  formDate = new Date().toISOString().slice(0, 10);
  formStartLocation = '';
  formEndLocation = '';
  formStartMileage: number | null = null;
  formEndMileage: number | null = null;
  formPurpose = '';

  get computedDistance(): number {
    const s = Number(this.formStartMileage) || 0;
    const e = Number(this.formEndMileage) || 0;
    return e >= s ? e - s : 0;
  }

  ngOnInit(): void {
    this.loadTrips();
    this.vehicleService.findAll().subscribe({
      next: (v) => this.vehicles.set(v || [])
    });
    this.driverService.findAll().subscribe({
      next: (d) => this.drivers.set(d || [])
    });
  }

  onFilterChange(): void {
    this.loadTrips();
  }

  loadTrips(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.tripService.findAll(this.filterVehicleId ?? undefined).subscribe({
      next: (data) => {
        this.trips.set((data || []).slice().reverse());
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading trips from API.');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.formVehicleId = this.vehicles()[0]?.id ?? null;
    this.formDriverId = this.drivers()[0]?.id ?? null;
    this.formDate = new Date().toISOString().slice(0, 10);
    this.formStartLocation = '';
    this.formEndLocation = '';
    this.formStartMileage = null;
    this.formEndMileage = null;
    this.formPurpose = '';
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(trip: Trip): void {
    this.editingId.set(trip.id);
    this.formVehicleId = trip.vehicleId;
    this.formDriverId = trip.driverId;
    this.formDate = trip.date;
    this.formStartLocation = trip.startLocation;
    this.formEndLocation = trip.endLocation;
    this.formStartMileage = trip.startMileage;
    this.formEndMileage = trip.endMileage;
    this.formPurpose = trip.purpose || '';
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formError.set(null);
  }

  save(): void {
    const startLoc = this.formStartLocation.trim();
    const endLoc = this.formEndLocation.trim();
    const sMileage = Number(this.formStartMileage);
    const eMileage = Number(this.formEndMileage);

    if (!this.formDate || !startLoc || !endLoc || this.formStartMileage == null || this.formEndMileage == null) {
      this.formError.set('Please fill in all required fields.');
      return;
    }

    if (eMileage < sMileage) {
      this.formError.set('End mileage cannot be less than start mileage.');
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    const editId = this.editingId();
    if (editId) {
      const payload = {
        date: this.formDate,
        startLocation: startLoc,
        endLocation: endLoc,
        startMileage: sMileage,
        endMileage: eMileage,
        purpose: this.formPurpose?.trim() || undefined
      };

      this.tripService.update(editId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.loadTrips();
        },
        error: (err) => {
          this.saving.set(false);
          this.formError.set(err?.error?.detail || err?.error?.message || 'Error updating trip.');
        }
      });
    } else {
      if (!this.formVehicleId || !this.formDriverId) {
        this.formError.set('Vehicle and Driver are required.');
        this.saving.set(false);
        return;
      }

      const payload: CreateTripRequest = {
        vehicleId: this.formVehicleId,
        driverId: this.formDriverId,
        date: this.formDate,
        startLocation: startLoc,
        endLocation: endLoc,
        startMileage: sMileage,
        endMileage: eMileage,
        purpose: this.formPurpose?.trim() || undefined
      };

      this.tripService.create(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.loadTrips();
        },
        error: (err) => {
          this.saving.set(false);
          this.formError.set(err?.error?.detail || err?.error?.message || 'Error creating trip.');
        }
      });
    }
  }

  deleteTrip(trip: Trip): void {
    if (!confirm(`Are you sure you want to delete trip ${trip.startLocation} → ${trip.endLocation} (${trip.date})?`)) {
      return;
    }

    this.tripService.delete(trip.id).subscribe({
      next: () => this.loadTrips(),
      error: (err) => {
        alert(err?.error?.detail || err?.error?.message || 'Error deleting trip.');
      }
    });
  }
}
