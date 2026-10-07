import { Component, OnInit, inject, signal } from '@angular/core';
import { VehicleService } from '../../services';
import { Vehicle } from '../../models';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Vehicles</h2>
          <p class="text-gray-400 text-sm">Fleet vehicle inventory, specifications and operational status</p>
        </div>
        <button
          (click)="loadVehicles()"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="space-y-3 animate-pulse">
          <div class="h-10 bg-gray-900 border border-gray-800 rounded-lg"></div>
          <div class="h-14 bg-gray-900/60 border border-gray-800 rounded-lg"></div>
          <div class="h-14 bg-gray-900/60 border border-gray-800 rounded-lg"></div>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="bg-red-950/60 border border-red-800 text-red-200 px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
          <p class="text-sm">{{ errorMessage() }}</p>
          <button (click)="loadVehicles()" class="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded">
            Retry
          </button>
        </div>
      }

      <!-- Table View -->
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
                    <td class="px-6 py-4 text-gray-400">{{ vehicle.year }}</td>
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
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);

  readonly vehicles = signal<Vehicle[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadVehicles();
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
}
