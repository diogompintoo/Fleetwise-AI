import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-950 flex items-center justify-center">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-sm">
        
        <div class="mb-8 text-center">
          <h1 class="text-2xl font-bold text-blue-400">FleetWise AI</h1>
          <p class="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        @if (error()) {
          <div class="bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
            {{ error() }}
          </div>
        }

        <div class="space-y-4">
          <div>
            <label class="block text-sm text-gray-400 mb-1">Username</label>
            <input
              [(ngModel)]="username"
              type="text"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="admin"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-1">Password</label>
            <input
              [(ngModel)]="password"
              type="password"
              class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            (click)="login()"
            [disabled]="loading()"
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
          >
            {{ loading() ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>

        <div class="mt-6 pt-6 border-t border-gray-800">
          <p class="text-xs text-gray-600 text-center mb-2">Demo credentials</p>
          <div class="space-y-1 text-xs text-gray-500 text-center">
            <p>admin / admin123 — ADMIN</p>
            <p>manager / manager123 — FLEET_MANAGER</p>
            <p>driver / driver123 — DRIVER</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  login() {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.error.set('Invalid username or password.');
        this.loading.set(false);
      }
    });
  }
}