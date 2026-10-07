import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, CreateVehicleRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/vehicles';

  findAll(companyId?: number): Observable<Vehicle[]> {
    let params = new HttpParams();
    if (companyId != null) {
      params = params.set('companyId', companyId.toString());
    }
    return this.http.get<Vehicle[]>(this.baseUrl, { params });
  }

  findById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  findByCompany(companyId: number): Observable<Vehicle[]> {
    return this.findAll(companyId);
  }

  create(data: CreateVehicleRequest): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

