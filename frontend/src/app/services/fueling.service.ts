import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fueling, CreateFuelingRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class FuelingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/fuelings';

  findAll(vehicleId?: number): Observable<Fueling[]> {
    let params = new HttpParams();
    if (vehicleId != null) {
      params = params.set('vehicleId', vehicleId.toString());
    }
    return this.http.get<Fueling[]>(this.baseUrl, { params });
  }

  findByVehicle(vehicleId: number): Observable<Fueling[]> {
    return this.findAll(vehicleId);
  }

  create(data: CreateFuelingRequest): Observable<Fueling> {
    return this.http.post<Fueling>(this.baseUrl, data);
  }
}

