import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem('fw_token'));
  private _username = signal<string | null>(localStorage.getItem('fw_username'));
  private _role = signal<string | null>(localStorage.getItem('fw_role'));

  readonly isAuthenticated = computed(() => !!this._token());
  readonly username = computed(() => this._username());
  readonly role = computed(() => this._role());
  readonly token = computed(() => this._token());

  login(username: string, password: string) {
    return this.http.post<AuthResponse>('/api/v1/auth/login', { username, password }).pipe(
      tap(res => {
        this._token.set(res.token);
        this._username.set(res.username);
        this._role.set(res.role);
        localStorage.setItem('fw_token', res.token);
        localStorage.setItem('fw_username', res.username);
        localStorage.setItem('fw_role', res.role);
      })
    );
  }

  logout() {
    this._token.set(null);
    this._username.set(null);
    this._role.set(null);
    localStorage.removeItem('fw_token');
    localStorage.removeItem('fw_username');
    localStorage.removeItem('fw_role');
    this.router.navigate(['/login']);
  }
}