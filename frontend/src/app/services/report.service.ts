import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/reports/fleet';

  downloadFleetPdf(from: string, to: string, companyId?: number): Observable<Blob> {
    let params = new HttpParams()
      .set('from', from)
      .set('to', to);

    if (companyId != null) {
      params = params.set('companyId', companyId.toString());
    }

    return this.http.get(`${this.baseUrl}/pdf`, {
      params,
      responseType: 'blob'
    });
  }

  downloadFleetCsv(from: string, to: string, companyId?: number): Observable<Blob> {
    let params = new HttpParams()
      .set('from', from)
      .set('to', to);

    if (companyId != null) {
      params = params.set('companyId', companyId.toString());
    }

    return this.http.get(`${this.baseUrl}/csv`, {
      params,
      responseType: 'blob'
    });
  }

  saveBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}

