import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CompanyService } from '../../services';
import { Company } from '../../models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [DatePipe],
  template: `
    <div>
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-white mb-1">Companies</h2>
          <p class="text-gray-400 text-sm">Tenant companies registered in the fleet platform</p>
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
            (click)="loadCompanies()"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors">
            ↻ Refresh
          </button>
        </div>
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
          <button (click)="loadCompanies()" class="text-xs bg-red-900 hover:bg-red-800 px-3 py-1 rounded">
            Retry
          </button>
        </div>
      }

      <!-- Table View -->
      @if (!isLoading() && !errorMessage()) {
        @if (companies().length === 0) {
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
            <p class="text-gray-400 text-sm">No companies registered yet.</p>
          </div>
        } @else {
          <div class="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900/50">
            <table class="w-full text-sm text-left">
              <thead>
                <tr class="text-gray-400 border-b border-gray-800 bg-gray-900/80">
                  <th class="px-6 py-4 font-medium">Name</th>
                  <th class="px-6 py-4 font-medium">Tax Number (NIF)</th>
                  <th class="px-6 py-4 font-medium">Created At</th>
                  @if (auth.isManagerOrAdmin()) {
                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-800">
                @for (company of companies(); track company.id) {
                  <tr class="hover:bg-gray-800/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-white">{{ company.name }}</td>
                    <td class="px-6 py-4 font-mono text-gray-300">{{ company.taxNumber }}</td>
                    <td class="px-6 py-4 text-gray-400">
                      {{ company.createdAt | date: 'mediumDate' }}
                    </td>

                    @if (auth.isManagerOrAdmin()) {
                      <td class="px-6 py-4 text-right space-x-3">
                        <button
                          (click)="edit(company)"
                          class="text-blue-400 hover:text-blue-300 text-sm">
                          Edit
                        </button>
                        <button
                          (click)="remove(company.id)"
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
    </div>
  `
})
export class CompaniesComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  readonly auth = inject(AuthService);

  readonly companies = signal<Company[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.companyService.findAll().subscribe({
      next: (data) => {
        this.companies.set(data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Error loading companies from API.');
        this.isLoading.set(false);
      }
    });
  }

  openCreate(): void {
    console.log('Open create company modal');
    // TODO
  }

  edit(company: Company): void {
    console.log('Edit company', company);
    // TODO
  }

  remove(id: number): void {
    if (!confirm('Are you sure you want to delete this company?')) return;

    this.companyService.delete(id).subscribe({
      next: () => this.loadCompanies(),
      error: () => alert('Failed to delete company')
    });
  }
}