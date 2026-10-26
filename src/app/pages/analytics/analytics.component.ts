import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Analytics</h1>
          <p class="sub">Explore insights, reports and trends for better decisions.</p>
        </div>
      </div>
      <div class="charts-grid">
        <div class="card">
          <div class="card-title">Energy Usage (Last 7 Days)</div>
          <canvas #energyChart></canvas>
        </div>
        <div class="card">
          <div class="card-title">Fleet Status Distribution</div>
          <canvas #fleetChart></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Battery Health Trend</div>
        <canvas #healthChart></canvas>
      </div>
    </div>
  `,
  styles: [`
    .page { display:flex; flex-direction:column; gap:20px; }
    .page-header h1 { font-size:22px; font-weight:700; }
    .sub { color:var(--text-muted); font-size:13px; margin-top:2px; }
    .charts-grid { display:grid; grid-template-columns:2fr 1fr; gap:14px; }
    .card-title { font-size:14px; font-weight:600; margin-bottom:16px; }
    canvas { max-height:260px; }
  `]
})
export class AnalyticsComponent implements AfterViewInit {
  @ViewChild('energyChart') energyRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fleetChart')  fleetRef!:  ElementRef<HTMLCanvasElement>;
  @ViewChild('healthChart') healthRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const labels = ['14 Oct','15 Oct','16 Oct','17 Oct','18 Oct','19 Oct','20 Oct'];
    const gridColor = 'rgba(255,255,255,0.05)';
    const tickColor = '#8b92a9';

    new Chart(this.energyRef.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'Total Energy (kWh)', data: [1200,1450,1100,1600,1350,1800,2000], borderColor: '#4f8ef7', backgroundColor: 'rgba(79,142,247,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#4f8ef7' },
          { label: 'Charging Energy (kWh)', data: [800,950,700,1100,900,1200,1400], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', tension: 0.4, fill: true, pointBackgroundColor: '#22c55e' },
        ]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: tickColor } } }, scales: { x: { ticks: { color: tickColor }, grid: { color: gridColor } }, y: { ticks: { color: tickColor }, grid: { color: gridColor } } } }
    });

    new Chart(this.fleetRef.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['In Operation','Charging','Idle','Maintenance'],
        datasets: [{ data: [38,6,3,1], backgroundColor: ['#22c55e','#4f8ef7','#f59e0b','#ef4444'], borderWidth: 0, hoverOffset: 6 }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: tickColor, padding: 16 } } }, cutout: '65%' }
    });

    new Chart(this.healthRef.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Healthy',         data: [40,41,42,41,42,42,42], backgroundColor: '#22c55e' },
          { label: 'Needs Attention', data: [5,5,4,5,5,5,5],        backgroundColor: '#f59e0b' },
          { label: 'Critical',        data: [1,1,2,1,1,1,1],        backgroundColor: '#ef4444' },
        ]
      },
      options: { responsive: true, plugins: { legend: { labels: { color: tickColor } } }, scales: { x: { stacked: true, ticks: { color: tickColor }, grid: { color: gridColor } }, y: { stacked: true, ticks: { color: tickColor }, grid: { color: gridColor } } } }
    });
  }
}
