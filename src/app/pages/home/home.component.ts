import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        query('.anim-item', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(60, animate('350ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'none' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  now = new Date();

  modules = [
    { title: 'Battery Management', desc: 'Monitor battery health, SoC, temperature and usage.', icon: 'battery', color: '#22c55e', route: '/battery' },
    { title: 'Charging Management', desc: 'Track charging sessions, station status and energy usage.', icon: 'zap', color: '#4f8ef7', route: '/charging' },
    { title: 'Fleet Management', desc: 'Manage vehicles, drivers and trips in real time.', icon: 'car', color: '#a855f7', route: '/fleet' },
    { title: 'Analytics', desc: 'Explore insights, reports and trends for better decisions.', icon: 'chart', color: '#14b8a6', route: '/analytics' },
  ];

  stats = [
    { label: 'Total Vehicles', value: '48', change: '+6%', up: true, sub: 'vs. last 7 days', icon: 'car', color: '#4f8ef7' },
    { label: 'Charging Stations', value: '12', change: '+2%', up: true, sub: 'vs. last 7 days', icon: 'zap', color: '#a855f7' },
    { label: 'Total Energy (Today)', value: '2,450 kWh', change: '+12%', up: true, sub: 'vs. yesterday', icon: 'bolt', color: '#22c55e' },
    { label: 'Active Alerts', value: '3', change: '-50%', up: false, sub: 'vs. last 7 days', icon: 'alert', color: '#ef4444' },
  ];

  fleetItems = [
    { label: 'In Operation', count: 38, pct: 79, color: '#22c55e' },
    { label: 'Charging', count: 6, pct: 13, color: '#4f8ef7' },
    { label: 'Idle', count: 3, pct: 6, color: '#f59e0b' },
    { label: 'Maintenance', count: 1, pct: 2, color: '#ef4444' },
  ];

  batteryHealth = [
    { label: 'Healthy', count: 42, pct: 87, color: '#22c55e', icon: '✓' },
    { label: 'Needs Attention', count: 5, pct: 10, color: '#f59e0b', icon: '!' },
    { label: 'Critical', count: 1, pct: 3, color: '#ef4444', icon: '✕' },
  ];

  activity = [
    { icon: 'zap', color: '#4f8ef7', title: 'Vehicle EV-042 started charging', sub: '2 minutes ago · Station 3 · 78% → 100%', type: 'info' },
    { icon: 'alert', color: '#ef4444', title: 'Battery temperature high', sub: '12 minutes ago · Vehicle EV-018 · 42°C', type: 'error' },
    { icon: 'car', color: '#a855f7', title: 'Trip completed', sub: '28 minutes ago · Vehicle EV-031 · 120 km', type: 'info' },
    { icon: 'plus', color: '#22c55e', title: 'New vehicle added', sub: '1 hour ago · EV-056 · Fleet', type: 'success' },
    { icon: 'check', color: '#22c55e', title: 'Charging session completed', sub: '2 hours ago · Station 7 · 54 kWh', type: 'success' },
    { icon: 'alert', color: '#f59e0b', title: 'Low battery alert', sub: '3 hours ago · Vehicle EV-012 · 18%', type: 'warn' },
  ];

  ngOnInit() {}

  getFleetDashArray(pct: number) {
    const r = 54; const c = 2 * Math.PI * r;
    return `${(pct / 100) * c} ${c}`;
  }
}
