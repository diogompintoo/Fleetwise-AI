import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-gray-950 text-white">
      <!-- Sidebar -->
      <aside class="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6">
        <div class="mb-8">
          <h1 class="text-xl font-bold text-blue-400">FleetWise AI</h1>
          <p class="text-xs text-gray-500 mt-1">Fleet Management</p>
        </div>
        <nav class="space-y-1">
          <a
            routerLink="/"
            routerLinkActive="bg-blue-600 text-white"
            [routerLinkActiveOptions]="{ exact: true }"
            class="block px-4 py-2 rounded-lg text-sm transition-colors text-gray-400 hover:bg-gray-800"
          >
            Dashboard
          </a>
          <a
            routerLink="/companies"
            routerLinkActive="bg-blue-600 text-white"
            class="block px-4 py-2 rounded-lg text-sm transition-colors text-gray-400 hover:bg-gray-800"
          >
            Companies
          </a>
          <a
            routerLink="/vehicles"
            routerLinkActive="bg-blue-600 text-white"
            class="block px-4 py-2 rounded-lg text-sm transition-colors text-gray-400 hover:bg-gray-800"
          >
            Vehicles
          </a>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="ml-64 p-8">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [],
})
export class App {}
