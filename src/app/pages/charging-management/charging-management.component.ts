import { Component, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PortStatus = 'available' | 'charging' | 'occupied' | 'fault' | 'offline' | 'attention';
export type ViewLevel = 'network' | 'site' | 'station' | 'port';

export interface ChargingSession {
  vehicleId: string;
  batteryId: string;
  startTime: Date;
  energyDelivered: number;
  currentPower: number;
  soc: number;
  targetSoc: number;
  voltage: number;
  current: number;
}

export interface Port {
  id: string;
  status: PortStatus;
  connectorType: string;
  maxPower: number;
  session?: ChargingSession;
}

export interface Station {
  id: string;
  name: string;
  x: number; y: number;
  online: boolean;
  ports: Port[];
  totalPower: number;
}

export interface Site {
  id: string;
  name: string;
  location: string;
  x: number; y: number;
  stations: Station[];
  online: boolean;
}

@Component({
  selector: 'app-charging-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './charging-management.component.html',
  styleUrl: './charging-management.component.scss'
})
export class ChargingManagementComponent implements OnInit, OnDestroy {
  viewLevel = signal<ViewLevel>('network');
  selectedSite = signal<Site | null>(null);
  selectedStation = signal<Station | null>(null);
  selectedPort = signal<Port | null>(null);
  hoveredStation = signal<Station | null>(null);
  zoom = signal(1);
  private timer: any;
  private flowTick = signal(0);

  sites: Site[] = [
    {
      id: 'SITE-A', name: 'Depot Alpha', location: 'North Hub', x: 25, y: 30, online: true,
      stations: [
        { id: 'ST-01', name: 'Station 01', x: 20, y: 35, online: true, totalPower: 350,
          ports: [
            { id: 'P01', status: 'charging', connectorType: 'CCS2', maxPower: 150, session: { vehicleId: 'EV-042', batteryId: 'BAT-018', startTime: new Date(Date.now()-3600000), energyDelivered: 38.4, currentPower: 142, soc: 73, targetSoc: 100, voltage: 820, current: 173 } },
            { id: 'P02', status: 'available', connectorType: 'CCS2', maxPower: 150 },
            { id: 'P03', status: 'charging', connectorType: 'CHAdeMO', maxPower: 50, session: { vehicleId: 'EV-031', batteryId: 'BAT-007', startTime: new Date(Date.now()-1800000), energyDelivered: 12.1, currentPower: 48, soc: 55, targetSoc: 90, voltage: 400, current: 120 } },
            { id: 'P04', status: 'fault', connectorType: 'AC Type 2', maxPower: 22 },
          ]
        },
        { id: 'ST-02', name: 'Station 02', x: 60, y: 35, online: true, totalPower: 200,
          ports: [
            { id: 'P01', status: 'available', connectorType: 'CCS2', maxPower: 150 },
            { id: 'P02', status: 'occupied', connectorType: 'CCS2', maxPower: 150 },
            { id: 'P03', status: 'available', connectorType: 'AC Type 2', maxPower: 22 },
            { id: 'P04', status: 'offline', connectorType: 'AC Type 2', maxPower: 22 },
          ]
        },
        { id: 'ST-03', name: 'Station 03', x: 20, y: 70, online: true, totalPower: 100,
          ports: [
            { id: 'P01', status: 'charging', connectorType: 'CCS2', maxPower: 50, session: { vehicleId: 'EV-019', batteryId: 'BAT-022', startTime: new Date(Date.now()-900000), energyDelivered: 8.2, currentPower: 49, soc: 42, targetSoc: 80, voltage: 400, current: 122 } },
            { id: 'P02', status: 'attention', connectorType: 'CCS2', maxPower: 50 },
          ]
        },
        { id: 'ST-04', name: 'Station 04', x: 60, y: 70, online: false, totalPower: 0,
          ports: [
            { id: 'P01', status: 'offline', connectorType: 'CCS2', maxPower: 150 },
            { id: 'P02', status: 'offline', connectorType: 'CCS2', maxPower: 150 },
          ]
        },
      ]
    },
    {
      id: 'SITE-B', name: 'Depot Beta', location: 'South Hub', x: 70, y: 30, online: true,
      stations: [
        { id: 'ST-01', name: 'Station 01', x: 20, y: 40, online: true, totalPower: 280,
          ports: [
            { id: 'P01', status: 'charging', connectorType: 'CCS2', maxPower: 150, session: { vehicleId: 'EV-055', batteryId: 'BAT-031', startTime: new Date(Date.now()-2700000), energyDelivered: 52.1, currentPower: 138, soc: 88, targetSoc: 100, voltage: 800, current: 172 } },
            { id: 'P02', status: 'available', connectorType: 'CCS2', maxPower: 150 },
          ]
        },
        { id: 'ST-02', name: 'Station 02', x: 60, y: 40, online: true, totalPower: 44,
          ports: [
            { id: 'P01', status: 'available', connectorType: 'AC Type 2', maxPower: 22 },
            { id: 'P02', status: 'charging', connectorType: 'AC Type 2', maxPower: 22, session: { vehicleId: 'EV-011', batteryId: 'BAT-004', startTime: new Date(Date.now()-7200000), energyDelivered: 18.9, currentPower: 22, soc: 91, targetSoc: 100, voltage: 230, current: 32 } },
          ]
        },
      ]
    },
    {
      id: 'SITE-C', name: 'Depot Gamma', location: 'East Hub', x: 25, y: 70, online: true,
      stations: [
        { id: 'ST-01', name: 'Station 01', x: 40, y: 40, online: true, totalPower: 75,
          ports: [
            { id: 'P01', status: 'available', connectorType: 'CCS2', maxPower: 75 },
            { id: 'P02', status: 'fault', connectorType: 'CCS2', maxPower: 75 },
          ]
        },
      ]
    },
    {
      id: 'SITE-D', name: 'Depot Delta', location: 'West Hub', x: 70, y: 70, online: false,
      stations: [
        { id: 'ST-01', name: 'Station 01', x: 40, y: 40, online: false, totalPower: 0,
          ports: [
            { id: 'P01', status: 'offline', connectorType: 'CCS2', maxPower: 150 },
            { id: 'P02', status: 'offline', connectorType: 'CCS2', maxPower: 150 },
          ]
        },
      ]
    },
  ];

  networkStats = computed(() => {
    const allPorts = this.sites.flatMap(s => s.stations.flatMap(st => st.ports));
    return {
      sites: this.sites.length,
      stations: this.sites.reduce((a, s) => a + s.stations.length, 0),
      totalPorts: allPorts.length,
      available: allPorts.filter(p => p.status === 'available').length,
      charging: allPorts.filter(p => p.status === 'charging').length,
      occupied: allPorts.filter(p => p.status === 'occupied').length,
      faults: allPorts.filter(p => p.status === 'fault').length,
      offline: allPorts.filter(p => p.status === 'offline').length,
      totalPower: this.sites.reduce((a, s) => a + s.stations.reduce((b, st) => b + st.totalPower, 0), 0),
      energyToday: 284.6,
      health: 94,
    };
  });

  siteStats(site: Site) {
    const ports = site.stations.flatMap(st => st.ports);
    return {
      total: ports.length,
      available: ports.filter(p => p.status === 'available').length,
      charging: ports.filter(p => p.status === 'charging').length,
      faults: ports.filter(p => p.status === 'fault').length,
      power: site.stations.reduce((a, st) => a + st.totalPower, 0),
    };
  }

  stationStats(st: Station) {
    return {
      available: st.ports.filter(p => p.status === 'available').length,
      charging: st.ports.filter(p => p.status === 'charging').length,
      faults: st.ports.filter(p => p.status === 'fault').length,
    };
  }

  get breadcrumb() {
    const crumbs: { label: string; level: ViewLevel }[] = [{ label: 'Network', level: 'network' }];
    if (this.selectedSite()) crumbs.push({ label: this.selectedSite()!.name, level: 'site' });
    if (this.selectedStation()) crumbs.push({ label: this.selectedStation()!.name, level: 'station' });
    if (this.selectedPort()) crumbs.push({ label: this.selectedPort()!.id, level: 'port' });
    return crumbs;
  }

  drillSite(site: Site) {
    this.selectedSite.set(site);
    this.selectedStation.set(null);
    this.selectedPort.set(null);
    this.viewLevel.set('site');
  }

  drillStation(st: Station) {
    this.selectedStation.set(st);
    this.selectedPort.set(null);
    this.viewLevel.set('station');
  }

  drillPort(port: Port) {
    this.selectedPort.set(port);
    this.viewLevel.set('port');
  }

  navigateTo(level: ViewLevel) {
    this.viewLevel.set(level);
    if (level === 'network') { this.selectedSite.set(null); this.selectedStation.set(null); this.selectedPort.set(null); }
    if (level === 'site') { this.selectedStation.set(null); this.selectedPort.set(null); }
    if (level === 'station') { this.selectedPort.set(null); }
  }

  portColor(status: PortStatus): string {
    const m: Record<PortStatus, string> = { available: '#34d399', charging: '#818cf8', occupied: '#c084fc', fault: '#f87171', offline: '#64748b', attention: '#fb923c' };
    return m[status];
  }
  portLabel(status: PortStatus): string {
    const m: Record<PortStatus, string> = { available: 'Available', charging: 'Charging', occupied: 'Occupied', fault: 'Fault', offline: 'Offline', attention: 'Attention' };
    return m[status];
  }
  portIcon(status: PortStatus): string {
    const m: Record<PortStatus, string> = { available: '✓', charging: '⚡', occupied: '●', fault: '✕', offline: '○', attention: '!' };
    return m[status];
  }

  sessionDuration(session: ChargingSession): string {
    const mins = Math.floor((Date.now() - session.startTime.getTime()) / 60000);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  estCompletion(session: ChargingSession): string {
    const remaining = session.targetSoc - session.soc;
    if (remaining <= 0) return 'Complete';
    const kwhNeeded = (remaining / 100) * 80;
    const mins = Math.round((kwhNeeded / session.currentPower) * 60);
    return `~${mins}m`;
  }

  fillHeight(soc: number): number { return Math.round((soc / 100) * 35); }
  fillY(soc: number): number { return 42 - this.fillHeight(soc); }

  readonly segments = [0, 1, 2, 3];
  segY(i: number): number { return 42 - 6 - i * 8; }
  segOpacity(i: number, soc: number): number {
    const lit = Math.ceil((soc / 100) * 4);
    return i < lit ? 1 : 0.15;
  }

  ngOnInit() {
    this.timer = setInterval(() => {
      this.flowTick.update(v => (v + 1) % 100);
      this.sites.forEach(site => site.stations.forEach(st => st.ports.forEach(p => {
        if (p.session && p.status === 'charging') {
          p.session.energyDelivered = +(p.session.energyDelivered + p.session.currentPower / 3600).toFixed(2);
          if (p.session.soc < p.session.targetSoc) p.session.soc = Math.min(p.session.targetSoc, +(p.session.soc + 0.01).toFixed(2));
        }
      })));
    }, 1000);
  }
  ngOnDestroy() { clearInterval(this.timer); }
}
