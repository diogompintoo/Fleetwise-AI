import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { forkJoin, of, catchError } from 'rxjs';
import { CompanyService, VehicleService, TripService, FuelingService, ReportService, AuthService } from '../../services';
import { Company, Vehicle, Trip, Fueling } from '../../models';
import { AnalyticsService, Insight, AnomalyDetection, ClusterStats } from '../../services/analytics.service';

interface StatCard {
  label: string;
  value: string | number;
  sublabel?: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe],
  template: `
    <div>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl font-bold mb-1 text-white">Dashboard</h2>
          <p class="text-gray-400 text-sm">Fleet overview & real-time operational metrics</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          @if (auth.isManagerOrAdmin()) {
            <button
              type="button"
              (click)="exportPdf()"
              [disabled]="isExportingPdf()"
              class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              <span>📄</span>
              <span>{{ isExportingPdf() ? 'Generating PDF...' : 'Export PDF' }}</span>
            </button>
            <button
              type="button"
              (click)="exportCsv()"
              [disabled]="isExportingCsv()"
              class="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
            >
              <span>📊</span>
              <span>{{ isExportingCsv() ? 'Exporting...' : 'Export CSV' }}</span>
            </button>
          }
          <button
            type="button"
            (click)="loadDashboardData()"
            class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm rounded-lg border border-gray-700 transition-colors flex items-center gap-2"
          >
            <span>↻ Refresh</span>
          </button>
        </div>
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

        <!-- AI Fleet Insights -->
        <div class="bg-gradient-to-r from-gray-900 via-gray-900 to-blue-950/40 border border-gray-800 rounded-xl p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <h3 class="text-lg font-semibold text-white">AI Fleet Insights</h3>
            </div>
            <span class="text-xs text-blue-400 bg-blue-950 border border-blue-800 px-2.5 py-1 rounded-full">
              Phase 8+9 · Statistical ML
            </span>
          </div>

          @if (insightsLoading()) {
            <div class="space-y-3 animate-pulse">
              <div class="h-16 bg-gray-950/70 border border-gray-800 rounded-lg"></div>
              <div class="h-16 bg-gray-950/70 border border-gray-800 rounded-lg"></div>
            </div>
          } @else if (insights().length === 0) {
            <p class="text-gray-400 text-sm">No insights available for the current period.</p>
          } @else {
            <div class="space-y-3 text-sm">
              @for (insight of insights(); track insight.title) {
                <div class="bg-gray-950/70 border border-gray-800/80 rounded-lg p-3.5 flex items-start gap-3">
                  <span [class]="severityIconClass(insight.severity)">
                    {{ severityIcon(insight.severity) }}
                  </span>
                  <div>
                    <p class="text-gray-200 font-medium">{{ insight.title }}</p>
                    <p class="text-gray-400 text-xs mt-0.5">{{ insight.message }}</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Phase 9: Statistical Anomaly Detection Panel -->
        @if (auth.isManagerOrAdmin()) {
          <div class="bg-gradient-to-r from-gray-900 via-gray-900 to-red-950/20 border border-gray-800 rounded-xl p-6 mt-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <h3 class="text-lg font-semibold text-white">Smart Anomaly Detection</h3>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs text-red-400 bg-red-950/60 border border-red-800/60 px-2.5 py-1 rounded-full">
                  AI-Powered
                </span>
              </div>
            </div>

            @if (anomaliesLoading()) {
              <div class="space-y-2 animate-pulse">
                <div class="h-14 bg-gray-950/70 border border-gray-800 rounded-lg"></div>
                <div class="h-14 bg-gray-950/70 border border-gray-800 rounded-lg"></div>
              </div>
            } @else if (anomalies().length === 0) {
              <div class="flex items-center gap-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg p-3.5">
                <span class="text-emerald-400 text-lg">✓</span>
                <div>
                  <p class="text-emerald-300 font-medium text-sm">Fleet Operating Normally</p>
                  <p class="text-emerald-500 text-xs mt-0.5">No unusual patterns detected for this period.</p>
                </div>
              </div>
            } @else {
              <div class="space-y-3 text-sm">
                @for (anomaly of anomalies(); track anomaly.vehicleId) {
                  <div [class]="anomalyCardClass(anomaly.severity)">
                    <div class="flex items-start justify-between gap-3">
                      <div class="flex items-start gap-3 flex-1 min-w-0">
                        <span [class]="anomalySeverityBadgeClass(anomaly.severity)" class="text-xs font-bold px-2 py-0.5 rounded shrink-0 mt-0.5">
                          {{ anomaly.severity }}
                        </span>
                        <div class="min-w-0">
                          <div class="flex items-center gap-2 flex-wrap">
                            <p class="text-white font-semibold">{{ anomaly.licensePlate }}</p>
                            <span class="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{{ anomaly.peerGroup }}</span>
                            <span class="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">{{ anomaly.detectionMethod }}</span>
                            @if (anomaly.zScore !== null) {
                              <span class="text-xs text-orange-400 bg-orange-950/40 border border-orange-800/40 px-1.5 py-0.5 rounded">
                                Z={{ anomaly.zScore | number:'1.1-1' }}σ
                              </span>
                            }
                          </div>
                          <p class="text-gray-300 text-xs mt-1">
                            <span class="font-medium">{{ anomaly.currentValue | number:'1.1-1' }} L/100km</span>
                            @if (anomaly.baselineValue) {
                              <span class="text-gray-500"> vs {{ anomaly.baselineValue | number:'1.1-1' }} L/100km peer avg</span>
                            }
                            @if (anomaly.variationPercent !== null) {
                              <span [class]="anomaly.variationPercent > 0 ? 'text-red-400' : 'text-emerald-400'" class="ml-1 font-medium">
                                ({{ anomaly.variationPercent > 0 ? '+' : '' }}{{ anomaly.variationPercent | number:'1.0-0' }}%)
                              </span>
                            }
                          </p>
                          @if (anomaly.rootCauseHypothesis) {
                            <p class="text-gray-400 text-xs mt-1.5 leading-relaxed">{{ anomaly.rootCauseHypothesis }}</p>
                          }
                        </div>
                      </div>
                      <span class="text-xs text-gray-600 shrink-0 mt-0.5">{{ (anomaly.confidenceScore * 100) | number:'1.0-0' }}% conf.</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Cluster Stats Summary -->
              @if (clusterStats().length > 0) {
                <div class="mt-4 pt-4 border-t border-gray-800">
                  <p class="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Peer Group Baselines</p>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                    @for (cluster of clusterStats(); track cluster.peerGroup) {
                      <div class="bg-gray-950/60 border border-gray-800 rounded-lg p-2.5">
                        <p class="text-xs text-gray-500 font-medium">{{ cluster.peerGroup }}</p>
                        <p class="text-sm font-bold text-white">{{ cluster.mean | number:'1.1-1' }} <span class="text-xs font-normal text-gray-500">L/100km</span></p>
                        <p class="text-xs text-gray-600">σ={{ cluster.standardDeviation | number:'1.2-2' }} · n={{ cluster.sampleSize }}</p>
                      </div>
                    }
                  </div>
                </div>
              }
            }
          </div>
        }
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private readonly companyService = inject(CompanyService);
  private readonly vehicleService = inject(VehicleService);
  private readonly tripService = inject(TripService);
  private readonly fuelingService = inject(FuelingService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly reportService = inject(ReportService);
  readonly auth = inject(AuthService);

  // Reactive State Signals
  readonly isExportingPdf = signal(false);
  readonly isExportingCsv = signal(false);
  readonly companies = signal<Company[]>([]);
  readonly vehicles = signal<Vehicle[]>([]);
  readonly trips = signal<Trip[]>([]);
  readonly fuelings = signal<Fueling[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);
  readonly insights = signal<Insight[]>([]);
  readonly insightsLoading = signal(false);
  readonly anomalies = signal<AnomalyDetection[]>([]);
  readonly anomaliesLoading = signal(false);
  readonly clusterStats = signal<ClusterStats[]>([]);

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
    this.loadInsights();
    this.loadAnomalies();

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

  private getPeriodStrings(): { fromStr: string; toStr: string } {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    return {
      fromStr: from.toISOString().slice(0, 10),
      toStr: to.toISOString().slice(0, 10)
    };
  }

  private loadInsights(): void {
    const { fromStr, toStr } = this.getPeriodStrings();
    this.insightsLoading.set(true);
    this.analyticsService.getInsights(fromStr, toStr).subscribe({
      next: (data) => {
        this.insights.set(data || []);
        this.insightsLoading.set(false);
      },
      error: () => {
        this.insights.set([]);
        this.insightsLoading.set(false);
      }
    });
  }

  private loadAnomalies(): void {
    const { fromStr, toStr } = this.getPeriodStrings();
    this.anomaliesLoading.set(true);
    this.analyticsService.getAnomalies(fromStr, toStr).subscribe({
      next: (data) => {
        this.anomalies.set(data || []);
        this.anomaliesLoading.set(false);
      },
      error: () => {
        this.anomalies.set([]);
        this.anomaliesLoading.set(false);
      }
    });
    this.analyticsService.getClusterStats(fromStr, toStr).subscribe({
      next: (data) => this.clusterStats.set(data || []),
      error: () => this.clusterStats.set([])
    });
  }

  severityIcon(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return '⚠';
      case 'WARNING':  return 'ℹ';
      default:         return '✓';
    }
  }

  severityIconClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'text-red-400';
      case 'WARNING':  return 'text-amber-400';
      default:         return 'text-emerald-400';
    }
  }

  anomalyCardClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-950/30 border border-red-800/50 rounded-lg p-3.5';
      case 'WARNING':  return 'bg-amber-950/30 border border-amber-800/50 rounded-lg p-3.5';
      default:         return 'bg-gray-950/60 border border-gray-800 rounded-lg p-3.5';
    }
  }

  anomalySeverityBadgeClass(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-900/70 text-red-300 border border-red-700/60';
      case 'WARNING':  return 'bg-amber-900/70 text-amber-300 border border-amber-700/60';
      default:         return 'bg-gray-800 text-gray-300 border border-gray-700';
    }
  }

  exportPdf(): void {
    const to = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    this.isExportingPdf.set(true);
    this.reportService.downloadFleetPdf(from, to).subscribe({
      next: (blob) => {
        this.reportService.saveBlob(blob, `fleetwise-executive-report-${from}-to-${to}.pdf`);
        this.isExportingPdf.set(false);
      },
      error: () => {
        this.isExportingPdf.set(false);
      }
    });
  }

  exportCsv(): void {
    const to = new Date().toISOString().slice(0, 10);
    const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    this.isExportingCsv.set(true);
    this.reportService.downloadFleetCsv(from, to).subscribe({
      next: (blob) => {
        this.reportService.saveBlob(blob, `fleetwise-fleet-data-${from}-to-${to}.csv`);
        this.isExportingCsv.set(false);
      },
      error: () => {
        this.isExportingCsv.set(false);
      }
    });
  }
}
