import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { TopbarComponent } from './layout/topbar/topbar.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="shell">
      <app-sidebar />
      <div class="main-area">
        <app-topbar />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; }
    .shell { display: flex; height: 100vh; overflow: hidden; background: var(--bg); }
    .main-area { flex: 1; min-width: 0; height: 100vh; display: flex; flex-direction: column; overflow-y: auto; }
    .content { flex: 1; min-width: 0; padding:0 20px; }
    @media (max-width: 760px) { .content { padding: 22px 16px 32px; } }
  `]
})
export class AppComponent implements OnInit {
  constructor(private theme: ThemeService) {}
  ngOnInit() { this.theme.init(); }
}
