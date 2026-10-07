import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company, CreateCompanyRequest, UpdateCompanyRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/companies';

  findAll(): Observable<Company[]> {
    return this.http.get<Company[]>(this.baseUrl);
  }

  findById(id: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/${id}`);
  }

  create(data: CreateCompanyRequest): Observable<Company> {
    return this.http.post<Company>(this.baseUrl, data);
  }

  update(id: number, data: UpdateCompanyRequest): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

