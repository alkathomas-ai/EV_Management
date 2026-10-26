import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BatteryManagementComponent } from './pages/battery-management/battery-management.component';
import { ChargingManagementComponent } from './pages/charging-management/charging-management.component';
import { FleetManagementComponent } from './pages/fleet-management/fleet-management.component';
import { AnalyticsComponent } from './pages/analytics/analytics.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'battery', component: BatteryManagementComponent },
  { path: 'charging', component: ChargingManagementComponent },
  { path: 'fleet', component: FleetManagementComponent },
  { path: 'analytics', component: AnalyticsComponent },
];
