import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-950 text-white">

      @if (isAuthenticated()) {
        <aside class="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6">
          <div class="mb-8">
            <h1 class="text-xl font-bold text-blue-400">FleetWise AI</h1>
            <p class="text-xs text-gray-500 mt-1">{{ username() }}</p>
          </div>
          <nav class="space-y-1">
            <a routerLink="/" routerLinkActive="bg-blue-600 text-white"
              [routerLinkActiveOptions]="{ exact: true }"
              class="block px-4 py-2 rounded-lg text-sm transition-colors text-gray-400 hover:bg-gray-800">
              Dashboard
            </a>
            <a routerLink="/companies" routerLinkActive="bg-blue-600 text-white"
              class="block px-4 py-2 rounded-lg text-sm transition-colors text-gray-400 hover:bg-gray-800">
              Companies
            </a>
            <a routerLink="/vehicles" routerLinkActive="bg-blue-600 text-white"
              class="block px-4 py-2 rounded-lg text-sm transition-colors text-gray-400 hover:bg-gray-800">
              Vehicles
            </a>
          </nav>
          <div class="absolute bottom-6 left-6 right-6">
            <button (click)="logout()"
              class="w-full px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors text-left">
              Sign out
            </button>
          </div>
        </aside>
        <main class="ml-64 p-8">
          <router-outlet />
        </main>
      } @else {
        <router-outlet />
      }

    </div>
  `
})
export class App {
  private auth = inject(AuthService);
  isAuthenticated = computed(() => this.auth.isAuthenticated());
  username = computed(() => this.auth.username());

  logout() {
    this.auth.logout();
  }
}