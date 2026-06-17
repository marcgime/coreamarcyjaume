import { Component, computed, inject, signal } from '@angular/core';
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
      
      <!-- Carrusel de imágenes -->
      <div class="hero-carousel" (scroll)="onScroll($event)">
        <img *ngFor="let img of imageUrls()" class="hero-img-slide" [src]="img" [alt]="'Fondo de ' + locationService.currentCity()">
      </div>
      
      <!-- Indicadores del carrusel -->
      <div class="carousel-indicators" *ngIf="imageUrls().length > 1">
        <span *ngFor="let img of imageUrls(); let i = index" 
              class="indicator" 
              [class.active]="currentSlide() === i"></span>
      </div>

      <div class="hero-overlay"></div>
      
      <!-- Top-Right Weather Info Badge -->
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
    
    .hero-carousel {
      position: absolute;
      inset: 0;
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none; /* Firefox */
      z-index: 1;
    }
    .hero-carousel::-webkit-scrollbar {
      display: none; /* Safari/Chrome */
    }
    
    .hero-img-slide {
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      scroll-snap-align: center;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .carousel-indicators {
      position: absolute;
      top: 20px;
      left: 20px;
      z-index: 4;
      display: flex;
      gap: 6px;
      background: rgba(0, 0, 0, 0.25);
      padding: 6px 10px;
      border-radius: 12px;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    
    .indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transition: all 0.3s ease;
    }
    
    .indicator.active {
      width: 16px;
      border-radius: 4px;
      background: #ffffff;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.6);
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
      pointer-events: none;
    }
    .hero-content {
      position: relative;
      z-index: 3;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: #ffffff;
      pointer-events: none; /* Permite deslizar sobre el texto */
    }
    .hero-btn {
      pointer-events: auto; /* Reactivar clicks en el botón */
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
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }
    .hero-desc {
      font-size: 15px;
      line-height: 20px;
      opacity: 0.9;
      max-width: 290px;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
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

  currentSlide = signal(0);

  imageUrls = computed(() => {
    const city = this.locationService.currentCity().toLowerCase().trim();
    const cityImages: Record<string, string[]> = {
      'seoul': [
        'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1538485399081-7191373e98fc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583274291882-628d70b7ea17?q=80&w=800&auto=format&fit=crop'
      ],
      'seúl': [
        'https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1538485399081-7191373e98fc?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583274291882-628d70b7ea17?q=80&w=800&auto=format&fit=crop'
      ],
      'busan': [
        'https://images.unsplash.com/photo-1578321278280-e35324c45b85?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598506161821-2e06180a424b?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1612015264353-83ea927d3fa4?q=80&w=800&auto=format&fit=crop'
      ],
      'jeju': [
        'https://images.unsplash.com/photo-1542456488-bd98ec4e1f74?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1634707163884-2396e9526e03?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1611099684175-9b8e21de65ff?q=80&w=800&auto=format&fit=crop'
      ],
      'incheon': [
        'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515091943-9f5c0bba62db?q=80&w=800&auto=format&fit=crop'
      ],
      'gyeongju': [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1615309315582-749e75ebed7c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1613137937402-2eb3ba20d6f3?q=80&w=800&auto=format&fit=crop'
      ],
      'sokcho': [
        'https://images.unsplash.com/photo-1611762295679-0da871583d95?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1591557207622-7935cf1e5bc5?q=80&w=800&auto=format&fit=crop'
      ],
      'daegu': [
        'https://images.unsplash.com/photo-1614863772274-a63e9e38eec4?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1589531584980-0081e7d23d8c?q=80&w=800&auto=format&fit=crop'
      ],
      'jeonju': [
        'https://images.unsplash.com/photo-1605634563852-6d1bb0daabdf?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1614050682855-6b83f0c15d48?q=80&w=800&auto=format&fit=crop'
      ],
      'barcelona': [
        'https://images.unsplash.com/photo-1583422409516-a515ac00ebce?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1539037116271-8b33edef7d6e?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511527661048-7ef732000d68?q=80&w=800&auto=format&fit=crop'
      ],
      'terrassa': [
        'https://images.unsplash.com/photo-1558231518-e38fb50b9875?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596700721245-e117865f121a?q=80&w=800&auto=format&fit=crop'
      ],
      'viladecans': [
        'https://images.unsplash.com/photo-1562916949-a2924376174d?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1576085605731-97b779a1f2da?q=80&w=800&auto=format&fit=crop'
      ]
    };
    
    for (const key of Object.keys(cityImages)) {
      if (city.includes(key)) {
        return cityImages[key];
      }
    }
    
    // Default fallback si la ciudad no está en la lista
    return [
      'https://images.unsplash.com/photo-1515091943-9f5c0bba62db?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526512340742-127e99216b23?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591118128399-5ea06bdcf10f?q=80&w=800&auto=format&fit=crop'
    ];
  });

  onScroll(event: Event) {
    const el = event.target as HTMLElement;
    const slideWidth = el.offsetWidth;
    const scrollPosition = el.scrollLeft;
    // Añadimos un pequeño margen para que el cambio de índice sea fluido
    const index = Math.round(scrollPosition / slideWidth);
    
    if (this.currentSlide() !== index) {
      this.currentSlide.set(index);
    }
  }
}

