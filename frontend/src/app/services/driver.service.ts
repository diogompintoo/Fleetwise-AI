import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver, CreateDriverRequest, UpdateDriverRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/drivers';

  findAll(companyId?: number): Observable<Driver[]> {
    let params = new HttpParams();
    if (companyId != null) {
      params = params.set('companyId', companyId.toString());
    }
    return this.http.get<Driver[]>(this.baseUrl, { params });
  }

  findById(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateDriverRequest): Observable<Driver> {
    return this.http.post<Driver>(this.baseUrl, data);
  }

  update(id: number, data: UpdateDriverRequest): Observable<Driver> {
    return this.http.put<Driver>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

