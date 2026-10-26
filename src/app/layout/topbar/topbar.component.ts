import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  notifications = 3;
  pageTitle = 'Home';

  private titleMap: Record<string, string> = {
    '/home': 'Home',
    '/battery': 'Battery Management',
    '/charging': 'Charging Management',
    '/fleet': 'Fleet Management',
    '/analytics': 'Analytics',
  };

  constructor(public theme: ThemeService, private router: Router) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.pageTitle = this.titleMap[e.urlAfterRedirects] ?? 'EV Operations';
    });
  }
}
