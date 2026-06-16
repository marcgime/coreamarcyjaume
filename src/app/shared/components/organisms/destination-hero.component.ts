import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../../core/services/location.service';
import { WeatherService } from '../../../core/services/weather.service';
import { BadgeComponent } from '../atoms/badge.component';
import { IconComponent } from '../atoms/icon.component';

@Component({
  selector: 'app-destination-hero',
  standalone: true,
  imports: [CommonModule, BadgeComponent, IconComponent],
  template: `
    <section class="hero-card" id="destination-hero">
      <img id="hero-bg-image" class="hero-img" [src]="imageUrl()" [alt]="'Fondo de ' + locationService.currentCity()">
      <div class="hero-overlay"></div>
      
      <!-- Top-Right Weather Info Badge (Moved to top as requested) -->
      <div id="weather-top-badge" class="weather-hero-badge">
        <app-icon [name]="weatherService.icon()" size="20px" color="#ffb7c5"></app-icon>
        <span>{{ weatherService.temp() }}°C {{ weatherService.condition() }}</span>
      </div>
      
      <!-- Bottom Card Content -->
      <div class="hero-content">
        <div class="badge-row">
          <app-badge>
            <app-icon name="location_on" size="14px" color="#ffffff"></app-icon>
            <span>Destino Actual</span>
          </app-badge>
          
          <!-- GPS badge if geolocation succeeded -->
          <app-badge *ngIf="locationService.isGpsActive()" type="gps">
            <app-icon name="my_location" size="14px" color="#ffffff"></app-icon>
            <span>Ubicación Actual</span>
          </app-badge>
        </div>
        
        <h2 class="hero-title">{{ locationService.currentCity() }}, {{ locationService.countryCode() }}</h2>
        <p class="hero-desc">Explora el corazón tecnológico y tradicional de la península coreana.</p>
        
        <button class="hero-btn glass-card" (click)="$event.preventDefault()">
          <div class="shimmer"></div>
          <span>Ver Itinerario</span>
          <app-icon name="arrow_forward" size="18px" color="#ffffff"></app-icon>
        </button>
      </div>
    </section>
  `,
  styles: [`
    .hero-card {
      position: relative;
      height: 420px;
      border-radius: 32px;
      overflow: hidden;
      box-shadow: 0 20px 40px 0 rgba(26, 35, 126, 0.15);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .hero-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1;
    }
    .hero-card:hover .hero-img {
      transform: scale(1.04);
    }
    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0.3) 50%,
        rgba(26, 35, 126, 0.85) 100%
      );
      z-index: 2;
    }
    .hero-content {
      position: relative;
      z-index: 3;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: #ffffff;
    }
    .weather-hero-badge {
      position: absolute;
      top: 20px;
      right: 20px;
      z-index: 3;
      padding: 10px 16px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #ffffff;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      font-size: 14px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(0, 0, 0, 0.35);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .badge-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 4px;
    }
    .hero-title {
      font-size: 30px;
      font-weight: 700;
      line-height: 36px;
      letter-spacing: -0.01em;
    }
    .hero-desc {
      font-size: 15px;
      line-height: 20px;
      opacity: 0.9;
      max-w: 290px;
    }
    .hero-btn {
      margin-top: 12px;
      padding: 12px 20px;
      border-radius: 12px;
      color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: max-content;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.3);
      position: relative;
      overflow: hidden;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .hero-btn:hover {
      transform: translateY(-2px);
    }
    .hero-btn:active {
      transform: translateY(0);
    }
    .shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        95deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0) 100%
      );
      background-size: 200% 100%;
      animation: shimmer-effect 3s infinite;
    }
    @keyframes shimmer-effect {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class DestinationHeroComponent {
  locationService = inject(LocationService);
  weatherService = inject(WeatherService);

  imageUrl = computed(() => {
    const city = this.locationService.currentCity().toLowerCase().trim();
    const cityImages: Record<string, string> = {
      'seoul': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1200&auto=format&fit=crop',
      'seúl': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1200&auto=format&fit=crop',
      'busan': 'https://images.unsplash.com/photo-1578321278280-e35324c45b85?q=80&w=1200&auto=format&fit=crop',
      'jeju': 'https://images.unsplash.com/photo-1542456488-bd98ec4e1f74?q=80&w=1200&auto=format&fit=crop',
      'incheon': 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1200&auto=format&fit=crop',
      'gyeongju': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop'
    };
    
    for (const key of Object.keys(cityImages)) {
      if (city.includes(key)) {
        return cityImages[key];
      }
    }
    return `https://images.unsplash.com/featured/?${encodeURIComponent(this.locationService.currentCity())},travel&q=80&w=1200&auto=format&fit=crop`;
  });
}
