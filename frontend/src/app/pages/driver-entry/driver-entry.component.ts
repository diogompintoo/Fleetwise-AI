import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { VehicleService, DriverService, FuelingService, TripService, AuthService } from '../../services';
import { Vehicle, Driver, Fueling, Trip, CreateFuelingRequest, CreateTripRequest } from '../../models';

@Component({
  selector: 'app-driver-entry',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>🚚</span> Driver Portal & Log
          </h2>
          <p class="text-sm text-gray-400 mt-1">
            Quick data entry for fuelings and daily trips/odometer records
          </p>
        </div>

        <!-- Mode Switcher Tabs -->
        <div class="inline-flex rounded-lg bg-gray-900 p-1 border border-gray-800">
          <button
            type="button"
            (click)="activeTab.set('fueling')"
            [class.bg-blue-600]="activeTab() === 'fueling'"
            [class.text-white]="activeTab() === 'fueling'"
            [class.text-gray-400]="activeTab() !== 'fueling'"
            class="px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2">
            <span>⛽</span> Fueling Log
          </button>
          <button
            type="button"
            (click)="activeTab.set('trip')"
            [class.bg-blue-600]="activeTab() === 'trip'"
            [class.text-white]="activeTab() === 'trip'"
            [class.text-gray-400]="activeTab() !== 'trip'"
            class="px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2">
            <span>🚗</span> Trip & Mileage
          </button>
        </div>
      </div>

      <!-- Feedback Banners -->
      @if (successMessage()) {
        <div class="rounded-xl border border-emerald-800/80 bg-emerald-950/60 p-4 text-sm text-emerald-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span>✓</span>
            <span>{{ successMessage() }}</span>
          </div>
          <button (click)="successMessage.set(null)" class="text-emerald-400 hover:text-emerald-200">✕</button>
        </div>
      }

      @if (errorMessage()) {
        <div class="rounded-xl border border-red-800/80 bg-red-950/60 p-4 text-sm text-red-300 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span>⚠</span>
            <span>{{ errorMessage() }}</span>
          </div>
          <button (click)="errorMessage.set(null)" class="text-red-400 hover:text-red-200">✕</button>
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Main Form Column (7 cols) -->
        <div class="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
          @if (activeTab() === 'fueling') {
            <!-- FUELING FORM -->
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>⛽</span> New Fueling Record
            </h3>
            <form (ngSubmit)="submitFueling()" class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1">Vehicle *</label>
                <select
                  [(ngModel)]="fuelingVehicleId"
                  name="fuelingVehicleId"
                  required
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                  <option [ngValue]="null" disabled>Select vehicle...</option>
                  @for (v of vehicles(); track v.id) {
                    <option [ngValue]="v.id">
                      {{ v.licensePlate }} — {{ v.brand }} {{ v.model }} ({{ v.fuelType }})
                    </option>
                  }
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Date *</label>
                  <input
                    type="date"
                    [(ngModel)]="fuelingDate"
                    name="fuelingDate"
                    required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Current Odometer (km) *</label>
                  <input
                    type="number"
                    [(ngModel)]="fuelingOdometer"
                    name="fuelingOdometer"
                    required
                    min="0"
                    placeholder="e.g. 45200"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Liters (L) *</label>
                  <input
                    type="number"
                    [(ngModel)]="fuelingLiters"
                    name="fuelingLiters"
                    required
                    step="0.01"
                    min="0.1"
                    placeholder="e.g. 45.50"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Price per Liter (€/L) *</label>
                  <input
                    type="number"
                    [(ngModel)]="fuelingPricePerLiter"
                    name="fuelingPricePerLiter"
                    required
                    step="0.001"
                    min="0.1"
                    placeholder="e.g. 1.649"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <!-- Estimated Total Cost Live Pill -->
              <div class="rounded-lg bg-gray-950/80 border border-gray-800 p-3.5 flex items-center justify-between text-sm">
                <span class="text-gray-400">Estimated Total Cost:</span>
                <span class="font-semibold text-emerald-400 text-base">
                  € {{ computedTotalCost() }}
                </span>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1">Gas Station / Posto</label>
                <input
                  type="text"
                  [(ngModel)]="fuelingStation"
                  name="fuelingStation"
                  placeholder="e.g. Galp Lisboa, Repsol Porto, BP"
                  maxlength="200"
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div class="pt-2">
                <button
                  type="submit"
                  [disabled]="isSubmitting() || !fuelingVehicleId"
                  class="w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50">
                  {{ isSubmitting() ? 'Saving fueling...' : 'Register Fueling' }}
                </button>
              </div>
            </form>
          } @else {
            <!-- TRIP FORM -->
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🚗</span> Log Trip & Mileage
            </h3>
            <form (ngSubmit)="submitTrip()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Vehicle *</label>
                  <select
                    [(ngModel)]="tripVehicleId"
                    name="tripVehicleId"
                    required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                    <option [ngValue]="null" disabled>Select vehicle...</option>
                    @for (v of vehicles(); track v.id) {
                      <option [ngValue]="v.id">
                        {{ v.licensePlate }} ({{ v.brand }})
                      </option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Driver *</label>
                  <select
                    [(ngModel)]="tripDriverId"
                    name="tripDriverId"
                    required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                    <option [ngValue]="null" disabled>Select driver...</option>
                    @for (d of drivers(); track d.id) {
                      <option [ngValue]="d.id">
                        {{ d.name }} ({{ d.license }})
                      </option>
                    }
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1">Date *</label>
                <input
                  type="date"
                  [(ngModel)]="tripDate"
                  name="tripDate"
                  required
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Start Location (Origem) *</label>
                  <input
                    type="text"
                    [(ngModel)]="tripStartLocation"
                    name="tripStartLocation"
                    required
                    placeholder="e.g. Lisboa"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">End Location (Destino) *</label>
                  <input
                    type="text"
                    [(ngModel)]="tripEndLocation"
                    name="tripEndLocation"
                    required
                    placeholder="e.g. Porto"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">Start Mileage (km) *</label>
                  <input
                    type="number"
                    [(ngModel)]="tripStartMileage"
                    name="tripStartMileage"
                    required
                    min="0"
                    placeholder="e.g. 45000"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-400 mb-1">End Mileage (km) *</label>
                  <input
                    type="number"
                    [(ngModel)]="tripEndMileage"
                    name="tripEndMileage"
                    required
                    min="0"
                    placeholder="e.g. 45310"
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
                </div>
              </div>

              <!-- Computed Distance Live Pill -->
              <div class="rounded-lg bg-gray-950/80 border border-gray-800 p-3.5 flex items-center justify-between text-sm">
                <span class="text-gray-400">Calculated Distance:</span>
                <span class="font-semibold text-blue-400 text-base">
                  {{ computedDistance() }} km
                </span>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-400 mb-1">Purpose / Motivo (Optional)</label>
                <input
                  type="text"
                  [(ngModel)]="tripPurpose"
                  name="tripPurpose"
                  placeholder="e.g. Client delivery, Regional inspection"
                  maxlength="500"
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div class="pt-2">
                <button
                  type="submit"
                  [disabled]="isSubmitting() || !tripVehicleId || !tripDriverId"
                  class="w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-3 text-sm font-medium text-white transition-colors disabled:opacity-50">
                  {{ isSubmitting() ? 'Saving trip...' : 'Register Trip' }}
                </button>
              </div>
            </form>
          }
        </div>

        <!-- Recent Records Sidebar (5 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4 flex items-center justify-between">
              <span>Recent Activity</span>
              <button (click)="loadRecent()" class="text-xs font-normal text-blue-400 hover:text-blue-300">↻ Refresh</button>
            </h3>

            @if (isLoadingRecent()) {
              <p class="text-xs text-gray-500">Loading recent records...</p>
            } @else {
              @if (activeTab() === 'fueling') {
                <div class="space-y-3">
                  @for (f of recentFuelings().slice(0, 6); track f.id) {
                    <div class="p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-xs flex justify-between items-center">
                      <div>
                        <div class="font-medium text-gray-200">
                          {{ getVehiclePlate(f.vehicleId) }}
                        </div>
                        <div class="text-gray-500 mt-0.5">
                          {{ f.date }} • {{ f.fuelStation || 'Station N/A' }}
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="font-semibold text-emerald-400">€ {{ f.totalCost }}</div>
                        <div class="text-gray-500">{{ f.liters }} L • {{ f.odometer }} km</div>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-xs text-gray-500">No fuelings logged yet.</p>
                  }
                </div>
              } @else {
                <div class="space-y-3">
                  @for (t of recentTrips().slice(0, 6); track t.id) {
                    <div class="p-3 rounded-lg bg-gray-950/60 border border-gray-800 text-xs flex justify-between items-center">
                      <div>
                        <div class="font-medium text-gray-200">
                          {{ getVehiclePlate(t.vehicleId) }}
                        </div>
                        <div class="text-gray-500 mt-0.5">
                          {{ t.startLocation }} → {{ t.endLocation }}
                        </div>
                      </div>
                      <div class="text-right">
                        <div class="font-semibold text-blue-400">{{ t.distance }} km</div>
                        <div class="text-gray-500">{{ t.date }}</div>
                      </div>
                    </div>
                  } @empty {
                    <p class="text-xs text-gray-500">No trips logged yet.</p>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class DriverEntryComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly driverService = inject(DriverService);
  private readonly fuelingService = inject(FuelingService);
  private readonly tripService = inject(TripService);
  readonly auth = inject(AuthService);

  readonly activeTab = signal<'fueling' | 'trip'>('fueling');
  readonly vehicles = signal<Vehicle[]>([]);
  readonly drivers = signal<Driver[]>([]);
  readonly recentFuelings = signal<Fueling[]>([]);
  readonly recentTrips = signal<Trip[]>([]);

  readonly isLoadingRecent = signal(false);
  readonly isSubmitting = signal(false);
  readonly successMessage = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  // Fueling form inputs
  fuelingVehicleId: number | null = null;
  fuelingDate = new Date().toISOString().split('T')[0];
  fuelingOdometer: number | null = null;
  fuelingLiters: number | null = null;
  fuelingPricePerLiter: number | null = null;
  fuelingStation = '';

  // Trip form inputs
  tripVehicleId: number | null = null;
  tripDriverId: number | null = null;
  tripDate = new Date().toISOString().split('T')[0];
  tripStartLocation = '';
  tripEndLocation = '';
  tripStartMileage: number | null = null;
  tripEndMileage: number | null = null;
  tripPurpose = '';

  computedTotalCost = computed(() => {
    const l = this.fuelingLiters || 0;
    const p = this.fuelingPricePerLiter || 0;
    return (l * p).toFixed(2);
  });

  computedDistance = computed(() => {
    const start = this.tripStartMileage || 0;
    const end = this.tripEndMileage || 0;
    return end >= start ? end - start : 0;
  });

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    forkJoin({
      vehicles: this.vehicleService.findAll(),
      drivers: this.driverService.findAll()
    }).subscribe({
      next: ({ vehicles, drivers }) => {
        this.vehicles.set(vehicles || []);
        this.drivers.set(drivers || []);
        if (vehicles && vehicles.length > 0) {
          this.fuelingVehicleId = vehicles[0].id;
          this.tripVehicleId = vehicles[0].id;
        }
        if (drivers && drivers.length > 0) {
          this.tripDriverId = drivers[0].id;
        }
        this.loadRecent();
      },
      error: () => {
        this.errorMessage.set('Failed to load vehicles or drivers catalogue.');
      }
    });
  }

  loadRecent(): void {
    this.isLoadingRecent.set(true);
    forkJoin({
      fuelings: this.fuelingService.findAll(),
      trips: this.tripService.findAll()
    }).subscribe({
      next: ({ fuelings, trips }) => {
        this.recentFuelings.set((fuelings || []).slice().reverse());
        this.recentTrips.set((trips || []).slice().reverse());
        this.isLoadingRecent.set(false);
      },
      error: () => {
        this.isLoadingRecent.set(false);
      }
    });
  }

  getVehiclePlate(id: number): string {
    const v = this.vehicles().find(x => x.id === id);
    return v ? `${v.licensePlate} (${v.brand})` : `Vehicle #${id}`;
  }

  submitFueling(): void {
    if (!this.fuelingVehicleId || !this.fuelingDate || this.fuelingOdometer == null || !this.fuelingLiters || !this.fuelingPricePerLiter) {
      this.errorMessage.set('Please fill in all required fueling fields.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload: CreateFuelingRequest = {
      vehicleId: this.fuelingVehicleId,
      date: this.fuelingDate,
      odometer: Number(this.fuelingOdometer),
      liters: Number(this.fuelingLiters),
      pricePerLiter: Number(this.fuelingPricePerLiter),
      fuelStation: this.fuelingStation?.trim() || undefined
    };

    this.fuelingService.create(payload).subscribe({
      next: (saved) => {
        this.isSubmitting.set(false);
        this.successMessage.set(`Fueling of ${saved.liters}L (€${saved.totalCost}) recorded successfully!`);
        this.fuelingLiters = null;
        this.fuelingPricePerLiter = null;
        this.fuelingStation = '';
        this.loadRecent();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.error?.detail || err?.error?.message || 'Error saving fueling record.');
      }
    });
  }

  submitTrip(): void {
    if (!this.tripVehicleId || !this.tripDriverId || !this.tripDate || !this.tripStartLocation.trim() || !this.tripEndLocation.trim() || this.tripStartMileage == null || this.tripEndMileage == null) {
      this.errorMessage.set('Please fill in all required trip fields.');
      return;
    }

    if (this.tripEndMileage < this.tripStartMileage) {
      this.errorMessage.set('End mileage cannot be less than start mileage.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const payload: CreateTripRequest = {
      vehicleId: this.tripVehicleId,
      driverId: this.tripDriverId,
      date: this.tripDate,
      startLocation: this.tripStartLocation.trim(),
      endLocation: this.tripEndLocation.trim(),
      startMileage: Number(this.tripStartMileage),
      endMileage: Number(this.tripEndMileage),
      purpose: this.tripPurpose?.trim() || undefined
    };

    this.tripService.create(payload).subscribe({
      next: (saved) => {
        this.isSubmitting.set(false);
        this.successMessage.set(`Trip of ${saved.distance} km (${saved.startLocation} → ${saved.endLocation}) recorded successfully!`);
        this.tripStartLocation = '';
        this.tripEndLocation = '';
        this.tripStartMileage = this.tripEndMileage; // next trip starts at current end
        this.tripEndMileage = null;
        this.tripPurpose = '';
        this.loadRecent();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.error?.detail || err?.error?.message || 'Error saving trip record.');
      }
    });
  }
}

