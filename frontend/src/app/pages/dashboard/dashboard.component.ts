import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { forkJoin, of, catchError } from 'rxjs';
import { CompanyService, VehicleService, TripService, FuelingService } from '../../services';
import { Company, Vehicle, Trip, Fueling } from '../../models';

interface StatCard {
  label: string;
  value: string | number;
  sublabel?: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div>
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold mb-1 text-white">Dashboard</h2>
          <p class="text-gray-400 text-sm">Fleet overview & real-time operational metrics</p>
        </div>
        <button
          (click)="loadDashboardData()"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors flex items-center gap-2"
        >
          <span>↻ Refresh</span>
        </button>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
              <div class="h-4 bg-gray-800 rounded w-1/3 mb-3"></div>
              <div class="h-8 bg-gray-800 rounded w-1/2"></div>
            </div>
          }
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="bg-red-950/60 border border-red-800 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
          <p class="text-sm">{{ errorMessage() }}</p>
          <button (click)="loadDashboardData()" class="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded">
            Retry
          </button>
        </div>
      }

      <!-- Main Metric Cards -->
      @if (!isLoading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          @for (stat of stats(); track stat.label) {
            <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div class="flex items-center justify-between mb-1">
                <p class="text-gray-400 text-sm">{{ stat.label }}</p>
                @if (stat.badge) {
                  <span class="text-xs px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                    {{ stat.badge }}
                  </span>
                }
              </div>
              <p class="text-3xl font-bold text-white">{{ stat.value }}</p>
              @if (stat.sublabel) {
                <p class="text-xs text-gray-500 mt-2">{{ stat.sublabel }}</p>
              }
            </div>
          }
        </div>

        <!-- AI Insights & Architecture Preview (Aligned with Project Vision) -->
        <div class="bg-gradient-to-r from-gray-900 via-gray-900 to-blue-950/40 border border-gray-800 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <h3 class="text-lg font-semibold text-white">AI Fleet Insights</h3>
            </div>
            <span class="text-xs text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-1 rounded-full">
              Phase 8 / 9 Preview
            </span>
          </div>

          <div class="space-y-3 text-sm">
            <div class="bg-gray-950/70 border border-gray-800/80 rounded-lg p-3.5 flex items-start gap-3">
              <span class="text-emerald-400">✓</span>
              <div>
                <p class="text-gray-200 font-medium">Efficiency Baseline</p>
                <p class="text-gray-400 text-xs mt-0.5">
                  Average fleet fuel consumption is currently {{ avgConsumption().toFixed(2) }} L/100km across all registered trips.
                </p>
              </div>
            </div>

            <div class="bg-gray-950/70 border border-gray-800/80 rounded-lg p-3.5 flex items-start gap-3">
              <span class="text-amber-400">ℹ</span>
              <div>
                <p class="text-gray-200 font-medium">Cost Indicator</p>
                <p class="text-gray-400 text-xs mt-0.5">
                  Fleet operational fuel cost is estimated at €{{ costPerKm().toFixed(3) }}/km.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly vehicleService = inject(VehicleService);
  private readonly tripService = inject(TripService);
  private readonly fuelingService = inject(FuelingService);

  // Reactive State Signals
  readonly companies = signal<Company[]>([]);
  readonly vehicles = signal<Vehicle[]>([]);
  readonly trips = signal<Trip[]>([]);
  readonly fuelings = signal<Fueling[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  // Computed Aggregations
  readonly totalKm = computed(() =>
    this.trips().reduce((sum, t) => sum + (t.distance || 0), 0)
  );

  readonly totalFuelCost = computed(() =>
    this.fuelings().reduce((sum, f) => sum + (f.totalCost || 0), 0)
  );

  readonly totalLiters = computed(() =>
    this.fuelings().reduce((sum, f) => sum + (f.liters || 0), 0)
  );

  readonly avgConsumption = computed(() => {
    const km = this.totalKm();
    return km > 0 ? (this.totalLiters() / km) * 100 : 0;
  });

  readonly costPerKm = computed(() => {
    const km = this.totalKm();
    return km > 0 ? this.totalFuelCost() / km : 0;
  });

  readonly stats = computed<StatCard[]>(() => [
    {
      label: 'Companies',
      value: this.companies().length,
      sublabel: 'Active enterprise tenants'
    },
    {
      label: 'Vehicles',
      value: this.vehicles().length,
      sublabel: 'Monitored vehicles'
    },
    {
      label: 'Total KM',
      value: this.totalKm().toLocaleString('en-US', { maximumFractionDigits: 0 }),
      sublabel: 'Calculated via backend odometer rules'
    },
    {
      label: 'Fuel Cost (€)',
      value: `€${this.totalFuelCost().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sublabel: 'Total fuel expenditures'
    },
    {
      label: 'Liters Used',
      value: `${this.totalLiters().toLocaleString('en-US', { maximumFractionDigits: 1 })} L`,
      sublabel: 'Cumulative fuel volume'
    },
    {
      label: 'Trips',
      value: this.trips().length,
      sublabel: 'Completed route dispatches'
    },
  ]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    forkJoin({
      companies: this.companyService.findAll().pipe(catchError(() => of([]))),
      vehicles: this.vehicleService.findAll().pipe(catchError(() => of([]))),
      trips: this.tripService.findAll().pipe(catchError(() => of([]))),
      fuelings: this.fuelingService.findAll().pipe(catchError(() => of([]))),
    }).subscribe({
      next: ({ companies, vehicles, trips, fuelings }) => {
        this.companies.set(companies);
        this.vehicles.set(vehicles);
        this.trips.set(trips);
        this.fuelings.set(fuelings);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to connect to backend API. Please verify that Spring Boot is running on port 8081.');
        this.isLoading.set(false);
      }
    });
  }
}
