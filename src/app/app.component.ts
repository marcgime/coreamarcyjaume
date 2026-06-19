import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BottomNavComponent } from './shared/components/organisms/bottom-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BottomNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'corea-app';

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const windowFn = window as any;
      if (typeof windowFn.gtag === 'function') {
        windowFn.gtag('config', 'G-S7HJP3NGYH', {
          page_path: event.urlAfterRedirects,
          page_title: document.title || 'Korea Voyage Hub'
        });
      }
    });
  }
}
