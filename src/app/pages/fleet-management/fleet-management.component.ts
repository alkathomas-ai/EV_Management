import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fleet-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Fleet Management</h1>
          <p class="sub">Manage vehicles, drivers and trips in real time.</p>
        </div>
      </div>
      <div class="stats-row">
        <div class="card stat" *ngFor="let s of stats">
          <span class="stat-label">{{ s.label }}</span>
          <span class="stat-val" [style.color]="s.color">{{ s.value }}</span>
        </div>
      </div>
      <div class="card">
        <div class="card-title" style="margin-bottom:16px">Vehicle Fleet</div>
        <table class="data-table">
          <thead><tr><th>Vehicle ID</th><th>Model</th><th>Driver</th><th>Status</th><th>SoC</th><th>Location</th></tr></thead>
          <tbody>
            <tr *ngFor="let v of vehicles" class="table-row">
              <td><span class="vid">{{ v.id }}</span></td>
              <td>{{ v.model }}</td>
              <td>{{ v.driver }}</td>
              <td><span class="pill" [style.background]="v.color+'22'" [style.color]="v.color">{{ v.status }}</span></td>
              <td><span [style.color]="socColor(v.soc)">{{ v.soc }}%</span></td>
              <td>{{ v.location }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:20px; }
    .page-header h1 { font-size:22px; font-weight:700; }
    .sub { color:var(--text-muted); font-size:13px; margin-top:2px; }
    .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
    .stat { display:flex; flex-direction:column; gap:4px; }
    .stat-label { font-size:11px; color:var(--text-muted); }
    .stat-val { font-size:26px; font-weight:700; }
    .card-title { font-size:14px; font-weight:600; }
    .data-table { width:100%; border-collapse:collapse; }
    .data-table th { text-align:left; font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:.05em; padding:8px 12px; border-bottom:1px solid var(--border); }
    .data-table td { padding:12px; border-bottom:1px solid var(--border); font-size:13px; }
    .table-row:hover { background:var(--surface2); }
    .table-row:last-child td { border-bottom:none; }
    .vid { font-weight:600; color:var(--primary); font-size:12px; }
    .pill { display:inline-block; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:600; }
  `]
})
export class FleetManagementComponent {
  stats = [
    { label: 'Total Vehicles',  value: '48', color: '#4f8ef7' },
    { label: 'In Operation',    value: '38', color: '#22c55e' },
    { label: 'Active Drivers',  value: '35', color: '#a855f7' },
    { label: 'Trips Today',     value: '124', color: '#14b8a6' },
  ];
  vehicles = [
    { id: 'EV-022', model: 'Tesla Model 3',  driver: 'John Smith',   status: 'In Operation', color: '#22c55e', soc: 78, location: 'Kochi' },
    { id: 'EV-017', model: 'Nissan Leaf',    driver: 'Sara Lee',     status: 'Charging',     color: '#4f8ef7', soc: 62, location: 'Station 3' },
    { id: 'EV-031', model: 'Chevy Bolt',     driver: 'Mike Brown',   status: 'In Operation', color: '#22c55e', soc: 54, location: 'Ernakulam' },
    { id: 'EV-018', model: 'BMW i3',         driver: 'Priya Nair',   status: 'Maintenance',  color: '#ef4444', soc: 22, location: 'Depot A' },
    { id: 'EV-045', model: 'Hyundai Ioniq',  driver: 'Raj Kumar',    status: 'In Operation', color: '#22c55e', soc: 81, location: 'Thrissur' },
  ];
  socColor(s: number) { return s >= 60 ? '#22c55e' : s >= 30 ? '#f59e0b' : '#ef4444'; }
}
