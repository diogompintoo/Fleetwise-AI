import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Insight {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  category: string;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private http = inject(HttpClient);
  private base = '/api/v1/analytics';

  getInsights(from: string, to: string): Observable<Insight[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<Insight[]>(`${this.base}/insights`, { params });
  }
}