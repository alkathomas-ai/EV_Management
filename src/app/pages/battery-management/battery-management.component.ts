import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-battery-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './battery-management.component.html',
  styleUrl: './battery-management.component.scss',
  animations: [
    trigger('tabContent', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms cubic-bezier(0.16,1,0.3,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class BatteryManagementComponent {
  activeTab = 'overview';

  tabs = [
    { id: 'overview',    label: 'Overview' },
    { id: 'health',      label: 'Battery Health' },
    { id: 'soc',         label: 'State of Charge' },
    { id: 'temperature', label: 'Temperature' },
    { id: 'alerts',      label: 'Alerts', badge: 3 },
  ];

  batteries = [
    { id: 'EV-001', vehicle: 'Tesla Model 3', soc: 87, health: 'Healthy', temp: 28, voltage: 396, status: 'In Operation', statusColor: '#22c55e' },
    { id: 'EV-002', vehicle: 'Nissan Leaf',   soc: 62, health: 'Healthy', temp: 31, voltage: 388, status: 'Charging',     statusColor: '#4f8ef7' },
    { id: 'EV-003', vehicle: 'Chevy Bolt',    soc: 45, health: 'Needs Attention', temp: 38, voltage: 372, status: 'Idle', statusColor: '#f59e0b' },
    { id: 'EV-004', vehicle: 'BMW i3',        soc: 18, health: 'Critical', temp: 42, voltage: 351, status: 'Maintenance', statusColor: '#ef4444' },
    { id: 'EV-005', vehicle: 'Hyundai Ioniq', soc: 95, health: 'Healthy', temp: 26, voltage: 402, status: 'In Operation', statusColor: '#22c55e' },
    { id: 'EV-006', vehicle: 'Kia EV6',       soc: 73, health: 'Healthy', temp: 29, voltage: 391, status: 'Charging',     statusColor: '#4f8ef7' },
  ];

  alerts = [
    { id: 'EV-018', msg: 'Battery temperature high (42°C)', severity: 'critical', time: '12 min ago' },
    { id: 'EV-012', msg: 'Low battery alert (18%)',         severity: 'warning',  time: '3 hrs ago' },
    { id: 'EV-031', msg: 'Voltage drop detected',           severity: 'warning',  time: '5 hrs ago' },
  ];

  healthStats = [
    { label: 'Healthy',         count: 42, pct: 87, color: '#22c55e' },
    { label: 'Needs Attention', count: 5,  pct: 10, color: '#f59e0b' },
    { label: 'Critical',        count: 1,  pct: 3,  color: '#ef4444' },
  ];

  setTab(id: string) { this.activeTab = id; }

  socColor(soc: number) {
    if (soc >= 60) return '#22c55e';
    if (soc >= 30) return '#f59e0b';
    return '#ef4444';
  }
  tempColor(t: number) {
    if (t <= 30) return '#22c55e';
    if (t <= 38) return '#f59e0b';
    return '#ef4444';
  }
  healthColor(h: string) {
    if (h === 'Healthy') return '#22c55e';
    if (h === 'Needs Attention') return '#f59e0b';
    return '#ef4444';
  }
}
