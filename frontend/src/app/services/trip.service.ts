import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Trip, CreateTripRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/trips';

  findAll(vehicleId?: number): Observable<Trip[]> {
    let params = new HttpParams();
    if (vehicleId != null) {
      params = params.set('vehicleId', vehicleId.toString());
    }
    return this.http.get<Trip[]>(this.baseUrl, { params });
  }

  findByVehicle(vehicleId: number): Observable<Trip[]> {
    return this.findAll(vehicleId);
  }

  create(data: CreateTripRequest): Observable<Trip> {
    return this.http.post<Trip>(this.baseUrl, data);
  }
}

