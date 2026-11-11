import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Insight {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  category: string;
  title: string;
  message: string;
}

export interface AnomalyDetection {
  vehicleId: number;
  licensePlate: string;
  metric: string;
  currentValue: number | null;
  baselineValue: number | null;
  variationPercent: number | null;
  thresholdPercent: number;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  detectionMethod: string;    // Z_SCORE, IQR, TEMPORAL_DELTA, RULE_BASED
  peerGroup: string;          // DIESEL, GASOLINE, HYBRID, FLEET_WIDE, etc.
  zScore: number | null;
  confidenceScore: number;
  rootCauseHypothesis: string | null;
}

export interface ClusterStats {
  peerGroup: string;
  sampleSize: number;
  mean: number | null;
  median: number | null;
  standardDeviation: number | null;
  q1: number | null;
  q3: number | null;
  iqr: number | null;
  upperWarningFence: number | null;
  upperCriticalFence: number | null;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private base = '/api/v1/analytics';

  getInsights(from: string, to: string): Observable<Insight[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<Insight[]>(`${this.base}/insights`, { params });
  }

  getAnomalies(from: string, to: string, method = 'STATISTICAL'): Observable<AnomalyDetection[]> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('method', method);
    return this.http.get<AnomalyDetection[]>(`${this.base}/anomalies`, { params });
  }

  getClusterStats(from: string, to: string): Observable<ClusterStats[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<ClusterStats[]>(`${this.base}/anomalies/clusters`, { params });
  }
}
