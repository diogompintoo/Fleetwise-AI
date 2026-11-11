import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DriverService, CompanyService, AuthService } from '../../services';
import { Driver, Company, CreateDriverRequest, UpdateDriverRequest } from '../../models';

@Component({
  selector: 'app-drivers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Drivers</h2>
          <p class="text-gray-400 text-sm">Fleet drivers registered across enterprise tenants</p>
        </div>

        <div class="flex items-center gap-3">
          @if (auth.isManagerOrAdmin()) {
            <button
              class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              (click)="openCreate()">
              + New Driver
            </button>
          }

          <button
            (click)="loadDrivers()"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors">
            ↻ Refresh
          </button>

          <select
            [(ngModel)]="filterCompanyId"
            (ngModelChange)="onFilterChange()"
            class="rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-gray-200">
            <option [ngValue]="null">All companies</option>
            @for (c of companies(); track c.id) {
              <option [ngValue]="c.id">{{ c.name }}</option>
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
          <button (click)="loadDrivers()" class="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded">
            Retry
          </button>
        </div>
      }

      @if (!isLoading() && !errorMessage()) {
        @if (drivers().length === 0) {
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p class="text-gray-400 text-sm">No drivers found.</p>
          </div>
        } @else {
          <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-gray-400 border-b border-gray-800 bg-gray-900/80">
                  <th class="px-6 py-4 font-medium">Name</th>
                  <th class="px-6 py-4 font-medium">Driver License</th>
                  <th class="px-6 py-4 font-medium">Company</th>
                  <th class="px-6 py-4 font-medium">Status</th>
                  @if (auth.isManagerOrAdmin()) {
                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                @for (driver of drivers(); track driver.id) {
                  <tr class="hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-white flex items-center gap-2">
                      <span class="w-8 h-8 rounded-full bg-blue-900/60 border border-blue-700/50 flex items-center justify-center text-xs font-semibold text-blue-300">
                        {{ driver.name.charAt(0) }}
                      </span>
                      <span>{{ driver.name }}</span>
                    </td>
                    <td class="px-6 py-4 font-mono text-gray-300">{{ driver.license }}</td>
                    <td class="px-6 py-4 text-gray-300">
                      {{ driver.companyName || 'N/A' }}
                    </td>
                    <td class="px-6 py-4">
                      @if (driver.active) {
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          Active
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
                          Inactive
                        </span>
                      }
                    </td>
                    @if (auth.isManagerOrAdmin()) {
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <button
                            (click)="openEdit(driver)"
                            class="px-2.5 py-1 text-xs font-medium rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors">
                            Edit
                          </button>
                          <button
                            (click)="deleteDriver(driver)"
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
          <div class="w-full max-w-md rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl">
            <h3 class="mb-4 text-lg font-semibold text-white">
              {{ editingId() ? 'Edit Driver' : 'New Driver' }}
            </h3>

            <form (ngSubmit)="save()" class="space-y-4">
              @if (!editingId()) {
                <div>
                  <label class="mb-1 block text-xs text-gray-400">Company *</label>
                  <select [(ngModel)]="formCompanyId" name="companyId" required
                    class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500">
                    @for (c of companies(); track c.id) {
                      <option [ngValue]="c.id">{{ c.name }}</option>
                    }
                  </select>
                </div>
              }

              <div>
                <label class="mb-1 block text-xs text-gray-400">Full Name *</label>
                <input type="text" [(ngModel)]="formName" name="name" required maxlength="200"
                  placeholder="e.g. João Silva"
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div>
                <label class="mb-1 block text-xs text-gray-400">Driver License Number *</label>
                <input type="text" [(ngModel)]="formLicense" name="license" required maxlength="50"
                  placeholder="e.g. P-1234567"
                  class="w-full rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 font-mono" />
              </div>

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
export class DriversComponent implements OnInit {
  private readonly driverService = inject(DriverService);
  private readonly companyService = inject(CompanyService);
  readonly auth = inject(AuthService);

  readonly drivers = signal<Driver[]>([]);
  readonly companies = signal<Company[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  filterCompanyId: number | null = null;

  readonly showForm = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  formCompanyId: number | null = null;
  formName = '';
  formLicense = '';
  formActive = true;

  ngOnInit(): void {
    this.loadDrivers();
    this.companyService.findAll().subscribe({
      next: (data) => this.companies.set(data || [])
    });
  }

  onFilterChange(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.driverService.findAll(this.filterCompanyId ?? undefined).subscribe({
      next: (data) => {
        this.drivers.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading drivers from API.');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editingId.set(null);
    this.formCompanyId = this.companies()[0]?.id ?? null;
    this.formName = '';
    this.formLicense = '';
    this.formActive = true;
    this.formError.set(null);
    this.showForm.set(true);
  }

  openEdit(driver: Driver): void {
    this.editingId.set(driver.id);
    this.formCompanyId = driver.companyId;
    this.formName = driver.name;
    this.formLicense = driver.license;
    this.formActive = driver.active;
    this.formError.set(null);
    this.showForm.set(true);
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formError.set(null);
  }

  save(): void {
    const name = this.formName.trim();
    const license = this.formLicense.trim().toUpperCase();

    if (!name || !license) {
      this.formError.set('Name and license are required.');
      return;
    }

    this.saving.set(true);
    this.formError.set(null);

    const editId = this.editingId();
    if (editId) {
      const payload: UpdateDriverRequest = {
        name,
        license,
        active: this.formActive
      };

      this.driverService.update(editId, payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.loadDrivers();
        },
        error: (err) => {
          this.saving.set(false);
          this.formError.set(err?.error?.detail || err?.error?.message || 'Error updating driver.');
        }
      });
    } else {
      if (!this.formCompanyId) {
        this.formError.set('Please select a company.');
        this.saving.set(false);
        return;
      }

      const payload: CreateDriverRequest = {
        companyId: this.formCompanyId,
        name,
        license
      };

      this.driverService.create(payload).subscribe({
        next: () => {
          this.saving.set(false);
          this.closeForm();
          this.loadDrivers();
        },
        error: (err) => {
          this.saving.set(false);
          this.formError.set(err?.error?.detail || err?.error?.message || 'Error creating driver.');
        }
      });
    }
  }

  deleteDriver(driver: Driver): void {
    if (!confirm(`Are you sure you want to delete driver "${driver.name}" (${driver.license})?`)) {
      return;
    }

    this.driverService.delete(driver.id).subscribe({
      next: () => this.loadDrivers(),
      error: (err) => {
        alert(err?.error?.detail || err?.error?.message || 'Error deleting driver.');
      }
    });
  }
}
