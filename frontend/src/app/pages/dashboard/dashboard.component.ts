import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div>
      <h2 class="text-2xl font-bold mb-2">Dashboard</h2>
      <p class="text-gray-400 mb-8">Fleet overview — real-time data</p>
    </div>
  `
})
export class DashboardComponent {}

