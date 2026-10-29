import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type Recommendation = 'READY' | 'CHARGE REQUIRED' | 'INSPECT' | 'ISOLATE' | 'MONITOR';
type BatteryColumn = 'id' | 'vehicle' | 'soc' | 'soh' | 'voltage' | 'current' | 'temperature' | 'capacity' | 'faults' | 'updated' | 'readiness';
interface Battery {
  id: string; vehicle: string; location: string; type: string; chemistry: string; soc: number; soh: number;
  voltage: number; current: number; temperature: number; capacity: number; nominal: number; cycles: number;
  faults: number; critical: boolean; faultText: string; updated: string; stale: boolean; swappable: boolean;
  serial: string; platform: string; custody: string; imbalance: number; acknowledged: boolean;
}

@Component({
  selector: 'app-battery-management', standalone: true, imports: [CommonModule],
  templateUrl: './battery-management.component.html', styleUrl: './battery-management.component.scss',
})
export class BatteryManagementComponent {
  readonly batteries: Battery[] = [
    { id:'BAT-2048', vehicle:'EV-042', location:'Depot A · Bay 04', type:'Long range', chemistry:'NMC · 400 V', soc:82, soh:96, voltage:398.4, current:12.6, temperature:28, capacity:72.0, nominal:75, cycles:184, faults:0, critical:false, faultText:'No active faults', updated:'2 min ago', stale:false, swappable:false, serial:'SN-NMC-2048-AX', platform:'Fleet EV · Gen 3', custody:'Vehicle EV-042', imbalance:18, acknowledged:false },
    { id:'BAT-2081', vehicle:'EV-019', location:'Depot A · Bay 02', type:'Standard range', chemistry:'LFP · 400 V', soc:18, soh:91, voltage:352.8, current:0, temperature:31, capacity:58.2, nominal:64, cycles:326, faults:0, critical:false, faultText:'No active faults', updated:'4 min ago', stale:false, swappable:false, serial:'SN-LFP-2081-BQ', platform:'Fleet EV · Gen 2', custody:'Vehicle EV-019', imbalance:24, acknowledged:false },
    { id:'BAT-1937', vehicle:'EV-036', location:'Depot B · Bay 11', type:'Long range', chemistry:'NMC · 400 V', soc:67, soh:78, voltage:387.1, current:-8.2, temperature:34, capacity:58.5, nominal:75, cycles:842, faults:1, critical:false, faultText:'Cell voltage spread above advisory threshold', updated:'3 min ago', stale:false, swappable:false, serial:'SN-NMC-1937-KL', platform:'Fleet EV · Gen 3', custody:'Vehicle EV-036', imbalance:46, acknowledged:false },
    { id:'SWP-017', vehicle:'Unassigned', location:'Depot A · Swap rack 03', type:'Removable pack', chemistry:'LFP · 350 V', soc:94, soh:89, voltage:349.2, current:0, temperature:26, capacity:51.6, nominal:58, cycles:411, faults:0, critical:false, faultText:'No active faults', updated:'1 min ago', stale:false, swappable:true, serial:'SN-LFP-SWP017-QM', platform:'Cargo EV · Swap v2', custody:'Depot A · Technician M. Das', imbalance:21, acknowledged:false },
    { id:'BAT-2104', vehicle:'EV-008', location:'Depot C · Bay 01', type:'Long range', chemistry:'NMC · 400 V', soc:73, soh:94, voltage:401.7, current:3.1, temperature:51, capacity:70.5, nominal:75, cycles:207, faults:2, critical:true, faultText:'Critical: pack temperature sensor exceeded 50 °C', updated:'1 min ago', stale:false, swappable:false, serial:'SN-NMC-2104-RT', platform:'Fleet EV · Gen 3', custody:'Vehicle EV-008', imbalance:57, acknowledged:false },
    { id:'BAT-1982', vehicle:'EV-027', location:'Depot B · Bay 06', type:'Standard range', chemistry:'LFP · 400 V', soc:48, soh:88, voltage:371.6, current:1.4, temperature:27, capacity:56.3, nominal:64, cycles:503, faults:0, critical:false, faultText:'No active faults', updated:'47 min ago', stale:true, swappable:false, serial:'SN-LFP-1982-CW', platform:'Fleet EV · Gen 2', custody:'Vehicle EV-027', imbalance:29, acknowledged:false },
    { id:'BAT-2066', vehicle:'EV-051', location:'Depot A · Bay 07', type:'Long range', chemistry:'NMC · 400 V', soc:88, soh:98, voltage:405.3, current:0, temperature:24, capacity:73.5, nominal:75, cycles:62, faults:0, critical:false, faultText:'No active faults', updated:'5 min ago', stale:false, swappable:false, serial:'SN-NMC-2066-PZ', platform:'Fleet EV · Gen 3', custody:'Vehicle EV-051', imbalance:12, acknowledged:false },
    { id:'SWP-022', vehicle:'EV-014', location:'Depot C · Swap rack 01', type:'Removable pack', chemistry:'LFP · 350 V', soc:61, soh:83, voltage:338.6, current:0, temperature:33, capacity:48.1, nominal:58, cycles:731, faults:1, critical:false, faultText:'Telemetry heartbeat delayed', updated:'31 min ago', stale:true, swappable:true, serial:'SN-LFP-SWP022-ZD', platform:'Cargo EV · Swap v2', custody:'Vehicle EV-014 · Operator K. Rao', imbalance:38, acknowledged:false },
  ];

  selectedId = signal<string | null>(null);
  query = signal(''); statusFilter = signal('all'); page = signal(0);
  sortKey = signal<BatteryColumn>('id'); sortDirection = signal<'asc' | 'desc'>('asc');
  columns: {key: BatteryColumn; label: string}[] = [
    {key:'id',label:'Battery / pack ID'}, {key:'vehicle',label:'Assigned vehicle'}, {key:'soc',label:'SOC'}, {key:'soh',label:'SOH'},
    {key:'voltage',label:'Voltage'}, {key:'current',label:'Current'}, {key:'temperature',label:'Temp'}, {key:'capacity',label:'Capacity'},
    {key:'faults',label:'Faults'}, {key:'updated',label:'Last updated'}, {key:'readiness',label:'Readiness'},
  ];
  visibleColumns = signal<BatteryColumn[]>(['id','vehicle','soc','soh','voltage','current','temperature','capacity','faults','updated','readiness']);
  selectedBattery = computed(() => this.batteries.find(b => b.id === this.selectedId()) ?? null);
  filteredBatteries = computed(() => {
    const q = this.query().trim().toLowerCase(); const status = this.statusFilter();
    return this.batteries.filter(b => (!q || `${b.id} ${b.vehicle} ${b.location} ${b.chemistry}`.toLowerCase().includes(q)) && (status === 'all' || this.recommendation(b) === status))
      .sort((a,b) => { const av = (a as any)[this.sortKey()]; const bv = (b as any)[this.sortKey()]; const cmp = typeof av === 'number' ? av-bv : String(av).localeCompare(String(bv)); return this.sortDirection()==='asc'?cmp:-cmp; });
  });
  pageCount = computed(() => Math.max(1, Math.ceil(this.filteredBatteries().length/6)));
  pagedBatteries = computed(() => this.filteredBatteries().slice(this.page()*6, this.page()*6+6));
  displayedColumns = computed(() => this.columns.filter(c => this.visibleColumns().includes(c.key)));
  pageStart = computed(() => this.filteredBatteries().length ? this.page()*6+1 : 0);
  pageEnd = computed(() => Math.min(this.page()*6+6, this.filteredBatteries().length));
  summary = [
    {label:'Total battery packs',value:'128',note:'Across 3 depots',icon:'▰',tone:'teal'},
    {label:'Healthy packs',value:'109',note:'85% of inventory',icon:'✓',tone:'green'},
    {label:'Requiring attention',value:'14',note:'Inspect or charge',icon:'!',tone:'amber'},
    {label:'Active critical faults',value:'2',note:'Isolation required',icon:'!',tone:'red'},
    {label:'Average SOH',value:'92.4%',note:'Fleet weighted average',icon:'↗',tone:'blue'},
    {label:'Stale telemetry',value:'3',note:'No update in 15+ min',icon:'◷',tone:'slate'},
  ];

  recommendation(b: Battery): Recommendation {
    if (b.critical) return 'ISOLATE';
    if (b.stale) return 'MONITOR';
    if (b.faults || b.temperature >= 45 || b.soh < 80 || b.imbalance > 40) return 'INSPECT';
    if (b.soc < 25) return 'CHARGE REQUIRED';
    return 'READY';
  }
  recommendationReason(b: Battery) {
    if (b.critical) return 'Critical safety telemetry is active. Keep the pack out of service until a qualified inspection is complete.';
    if (b.stale) return 'Fresh telemetry is unavailable. Readiness cannot be confirmed until a current BMS report is received.';
    if (b.faults || b.temperature >= 45 || b.soh < 80 || b.imbalance > 40) return 'A battery health or operating value needs technician review before the next dispatch.';
    if (b.soc < 25) return 'State of charge is below the 25% reserve threshold. Charge before dispatch.';
    return 'Recent telemetry is current, no critical faults are active and operating values are within configured limits.';
  }
  statusClass(status: Recommendation) { return status.toLowerCase().replace(' ', '-'); }
  previousPage() { this.page.update(p => Math.max(0, p - 1)); }
  nextPage() { this.page.update(p => Math.min(this.pageCount() - 1, p + 1)); }
  sortBy(key: BatteryColumn) { if (key === 'readiness') return; if(this.sortKey()===key) this.sortDirection.update(d=>d==='asc'?'desc':'asc'); else { this.sortKey.set(key); this.sortDirection.set('asc'); } }
  toggleColumn(key: BatteryColumn) { this.visibleColumns.update(cols=>cols.includes(key)?(cols.length>1?cols.filter(c=>c!==key):cols):[...cols,key]); }
  acknowledge(b: Battery) { if (b.critical) b.acknowledged = true; }
  downloadReport() {
    const rows = [['Battery ID','Vehicle','Chemistry','SOC','SOH','Voltage V','Current A','Temperature C','Usable capacity kWh','Active faults','Updated','Readiness'], ...this.batteries.map(b=>[b.id,b.vehicle,b.chemistry,String(b.soc),String(b.soh),String(b.voltage),String(b.current),String(b.temperature),String(b.capacity),String(b.faults),b.updated,this.recommendation(b)])];
    const csv = rows.map(row=>row.map(value=>`"${value.replaceAll('"','""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); const link=document.createElement('a'); link.href=url; link.download='battery-inventory.csv'; link.click(); URL.revokeObjectURL(url);
  }
}
