import { Component } from '@angular/core';
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
          style({ opacity: 0, transform: 'translateY(16px)' }),
          stagger(50, animate('320ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'none' })))
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent {
  now = new Date();

  stats = [
    { label: 'Total vehicles', value: '48', change: '6%', up: true, sub: 'vs. last 7 days', icon: 'car', color: '#4f8ef7', sparkPoints: '0,18 20,14 40,16 60,10 80,12 100,6' },
    { label: 'Charging stations', value: '12', change: '2%', up: true, sub: 'vs. last 7 days', icon: 'zap', color: '#a855f7', sparkPoints: '0,16 20,18 40,12 60,14 80,10 100,8' },
    { label: 'Energy today', value: '2,450', unit: 'kWh', change: '12%', up: true, sub: 'vs. yesterday', icon: 'battery', color: 'rgb(34 197 151)', sparkPoints: '0,20 20,16 40,18 60,10 80,8 100,4' },
    { label: 'Active alerts', value: '3', change: '50%', up: false, sub: 'vs. last 7 days', icon: 'alert', color: '#ef4444', sparkPoints: '0,4 20,8 40,6 60,12 80,14 100,18' },
  ];

  fleetItems = [
    { label: 'In operation', count: 38, pct: 79, color: 'rgb(34 197 151)' },
    { label: 'Charging',     count: 6,  pct: 13, color: '#4f8ef7' },
    { label: 'Idle',         count: 3,  pct: 6,  color: '#f59e0b' },
    { label: 'Maintenance',  count: 1,  pct: 2,  color: '#ef4444' },
  ];

  batteryHealth = [
    { label: 'Healthy',         count: 42, pct: 87, color: 'rgb(34 197 151)' },
    { label: 'Needs attention', count: 5,  pct: 10, color: '#f59e0b' },
    { label: 'Critical',        count: 1,  pct: 3,  color: '#ef4444' },
  ];

  activity = [
    { dot: '#4f8ef7', title: 'EV-042 started charging',    sub: '2 min ago · Station 3 · 78% → 100%' },
    { dot: '#ef4444', title: 'Battery temperature high',   sub: '12 min ago · EV-018 · 42°C' },
    { dot: '#a855f7', title: 'Trip completed',             sub: '28 min ago · EV-031 · 120 km' },
    { dot: 'rgb(34 197 151)', title: 'Charging session completed', sub: '2 hrs ago · Station 7 · 54 kWh' },
    { dot: '#f59e0b', title: 'Low battery alert',          sub: '3 hrs ago · EV-012 · 18%' },
  ];

  modules = [
    { title: 'Battery Management',  desc: 'Monitor battery health, SoC, temperature and usage.',       icon: 'battery', color: 'rgb(34 197 151)', bg: 'rgba(34,197,151,0.10)',  route: '/battery' },
    { title: 'Charging Management', desc: 'Track charging sessions, station status and energy usage.',  icon: 'zap',     color: '#4f8ef7', bg: 'rgba(79,142,247,0.10)', route: '/charging' },
    { title: 'Fleet Management',    desc: 'Manage vehicles, drivers and trips in real time.',           icon: 'car',     color: '#a855f7', bg: 'rgba(168,85,247,0.10)', route: '/fleet' },
    { title: 'Analytics',           desc: 'Explore insights, reports and trends for better decisions.', icon: 'chart',   color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', route: '/analytics' },
  ];
}
