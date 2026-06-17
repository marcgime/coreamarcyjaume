import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
        
        <button class="hero-btn glass-card" (click)="goToItinerary($event)">
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
  router = inject(Router);

  currentSlide = signal(0);

  imageUrls = computed(() => {
    const city = this.locationService.currentCity().toLowerCase().trim();
    const cityImages: Record<string, string[]> = {
      'seoul': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRe2T8pmwA9JsdUZ5i-kdX-FwHQQb4W-z9lwZ9bGvd4h2s-l2_EAwMWsWJBlB_8KFHmonQ2dAmvp25_c1vyEj6Pskk&s=19',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFW3HISUjFSizxFJds_Z1y-HKedXYwKp4xhLMWp_ga3E30WAFiYpH_oRVfSyqtO4DQ8qzPJXZJ4l5_Wt5-tGpnTvoRMghv4XwVgFB8Svi9QAgL0_xo_OkcGx3zYUmw51ddCSJw5hQ=w610-h353-n-k-no',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEOvt-X17lJp1Nx5WhnHM1tub6LqP-8yxkP7f3cKKxHTDYg6KrbFNan_31h5FinS-Eiu2-PQhlpAWmoImcXZsMuMNpc5OaA7bQBxpZ0Ces-wUb7vhkuNgQQB3dAZUCrtLOvqjaF5g=w610-h353-n-k-no'
      ],
      'seúl': [
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFruoXWzrxDn7e4jfhtluEUPdy8QKAS0A4SD2vs5RO9LGmHf_wGcWk-L-inHhnsEQsl0NZ4onYyIFr0WBiTrhCFWpQNhNWcXF8I-lRHZGZPLh-gOpl2944y6SMtPop81NdlmxMhhw=w610-h353-n-k-no',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEWq-ukBbOThM2fP6sosvx_8y-CL7z8JHCdVlUoYXtnjCo5y5rKfdI0BOwW69rfEGLj8nyTX-NV2Gewfc2li0NRrxGiDg_KK8MPWOOoICJq0Go44UZUeQT89OpjIf0vgYWfV_GF=w610-h353-n-k-no',
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRB0bvoEeXPMv0XED1NbQafnjz54PcWP5aUBeb9B0TWC5kQVesFaGlkRKJCWDu1oWGisivzFqtpm7Iu76gfXJwV5NI&s=19'
      ],
      'busan': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRHWTHUI-8VPzFk3TMOyMLdGiGln_hcILZeT5VRX-9-TBK-PUNiSX-Orufb8D-ixG7Cuu1h_KB-703BmjVRJXBRCBI&s=19',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH27VjuFq84pt--DvM1aYTlK2ttwBiGRFGtkRGH7ZMHvr889WmSPQs0jCi2GSVaxWHnDnJEnRK6BgwU8Qt0-kVznrjOHuoUAZtXzycjBeBMNaqeSVZ6DI02DT8Kny8NCfA4KqJMOX1W6aTX=w610-h353-n-k-no',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEEPQ6Vd7nf6wyv5vYb_5A5pJHm-s5NkQV5_FrzzopCQHXtb6g5sd9vxUqc345PZYDS6Wecs5Cc5fXhq4UVBV-IdNAcycw1-y1hJo6LPq6qATttO-5A8Wq1iKXvV7AUGcJal_-FbiEfn45z=w610-h353-n-k-no'
      ],
      'jeju': [
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAG5FqPXZO1RSTTVtWOAoZhndVjBnpewFqsHhDmku9q0bQdwjP0d2c4dsXHHHnSaFIRor5vPb1QWjEUHcJKNmeLiFyoiM_o64C6fLY1Ga-UL8TTwM0w6C3hHIL2V0F-VrnLXEwr2_Q=w610-h353-n-k-no',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAH_xZ_sqXaBbUlpH1j7LKr9H_hL05_wH-HOQE9TYEXKs4F8MHLOsOJFalXOOvs5P9yrbjNtxVsTFrr_rz4-D6HKWKxZAJAb-4YK_acQsQdyrsp9J_DgbdElGFEG1byhncJr2OW9=w610-h353-n-k-no',
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTaukBuCdpMM0k_Gm5paJraaZmXmMdxKIfPNVy55Ii5zD8xbNRbQPrR2KTzWujXQsGqV_VgxaALxiMTON8GbqLQrsQ&s=19'
      ],
      'incheon': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSRWbh6rLKySCWzZIQ8CPElmIUF2reBA7RpW-MtYiFS1CBQlv9mAjlxLvYLaZ76zVI02a8n51ywabCWpsf-2vD5npA&s=19',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAG10Low_yCXhOGQiUyBnz5dIZPikBB6DzG9V5W4sx-vaKBzgHh9PJEJDnSv7FIBtHnppHuonE3obhULgUK8F1Snz8unSSl37FcZd6Y9CW5dS2Ctb64-XaI55zD2WGU3hi0y2Oo=w610-h353-n-k-no'
      ],
      'gyeongju': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTPAlpIxEMf9xIZFnAJ8jVKN8ZG0PY1gwH6soJStEoXsZq0r7jbH0KWLspams9U23cSsgZCt5-oHeLoBZn-Qpn2v9s&s=19',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAFSC7IH5FVGMx3lyPyKHER9c3vqy0UcWmoOM__31JOSE0YPbwPjLauv5u5g8AOMkzmRO3PIgG8zeaHkGvod3FcAyaGgIuhFZuTsi7J0M9MUC3ShFaRyLlnRqyUK55NL9bIeEkOyuQ=w610-h353-n-k-no',
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRRFRaiG6TWSDioK8vkj8Bbt5JC0y9V0w8Ue1KxZgvIWgjf98LtpNnN5i9cvpR-cUH0GnLN6F332TeES_E8sQoDkOa2&s=19'
      ],
      'sokcho': [
        'https://www.google.com/imgres?q=sokcho&imgurl=https%3A%2F%2Fsunnydayswithjuliette.com%2Fwp-content%2Fuploads%2F2024%2F12%2Fsokcho-featured.jpg%3Fw%3D1024&imgrefurl=https%3A%2F%2Fsunnydayswithjuliette.com%2F2024%2F12%2F03%2Fbest-things-sokcho-korea%2F&docid=olQ9sZaazYLF_M&tbnid=-8oXQlc_h-U9UM&vet=12ahUKEwjitbiWvY6VAxXmif0HHc-PO5sQnPAOegQIaBAA..i&w=1024&h=767&hcb=2&ved=2ahUKEwjitbiWvY6VAxXmif0HHc-PO5sQnPAOegQIaBAA',
        'https://www.google.com/imgres?q=sokcho&imgurl=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fnxpteyfv%2Fgoguides%2F2d78cc2e0c588a86126b55607d17914b183b6740-1600x1066.jpg&imgrefurl=https%3A%2F%2Fes.hoteles.com%2Fgo%2Fsouth-korea%2Fsokcho&docid=zNnEDCdY-S3XoM&tbnid=w7k89wbbh01_2M&vet=12ahUKEwjitbiWvY6VAxXmif0HHc-PO5sQnPAOegQINRAA..i&w=1600&h=1066&hcb=2&ved=2ahUKEwjitbiWvY6VAxXmif0HHc-PO5sQnPAOegQINRAA'
      ],
      'daegu': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRYAQLdnBkKF_nAgTG-iruRrvBr5ZiGWVlUl7OL6uCLgqfyCVFZKQXrUVjhLd3URAJOndZI2BRw3NcW3yO487tf0gHq&s=19',
        'https://www.google.com/imgres?q=templo%20haeinsa&imgurl=https%3A%2F%2Fwww.viajeroscallejeros.com%2Fwp-content%2Fuploads%2Ftemplo-haeinsa-corea-del-sur.jpg&imgrefurl=https%3A%2F%2Fwww.viajeroscallejeros.com%2Ftemplo-haeinsa-tripitaka-coreana%2F&docid=Urws7txvxkJlfM&tbnid=BjN_bcc06IZX7M&vet=12ahUKEwi8-tDBvI6VAxWDgP0HHYtWFIIQnPAOegQIXxAA..i&w=800&h=533&hcb=2&ved=2ahUKEwi8-tDBvI6VAxWDgP0HHYtWFIIQnPAOegQIXxAA'
      ],
      'jeonju': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQjmagYbwsgGlXGRhWcu-12zELGSwhCfG7bRM_0xq2QRVJEUKAmp53FSouXYISK55SH-CUdx0bAgaRNOG52Sw11kHs&s=19',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEjDGFzusnhzr8UpsdJnN-tYF9I03CQSuUM3JHa4HMaSyemB0_c74idgmsOSZ30ZRrTSXPq8JJpgsdk4tn0s0PySHVbmePWi9PrTp7OnT2b-x0Lh_WzP_gkIXFv1Go0XlqbNKWK=w610-h353-n-k-no'
      ],
      'barcelona': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTIuWNaQTw3HP6_53A7v3pYYx74iTAWSIWHX-wU76OJyGmqyTkvrOTcJG9pE3SQFWZp9WMKqFQ45Twg6_zJDe_xX_s&s=19',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAHki9F_A7Mi-EgmCZOFwDLJYNkr-st1-CVk2LMTd7ZT0cUhM9QtIbhtcFyOHkD_-Kl64xtTHZm4HHIqBsnLusUhqQWHIwaKHB-QeuaPFObamw_BNWtS_OGMwFHINw1DMv2_Z5aO=w610-h353-n-k-no',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAGnX4CLCNZuvqvbs-HFj77t-qON2aT1PhD0HQKfTBiWHNTWy_1sydyZIWGHMTJbsjcJGACN9PJtd_DKaU-67oOre2pQOvhs_H9ERbAtmaWbVkVCTZsL63Tyl734WuybxZQvn1xJyw=w610-h353-n-k-no'
      ],
      'terrassa': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSqawXHmg8z0Mp-3Ww_Ylcnpr0NsIHBR1AU6G7ds93hE5rr2yjoqPgK1w0WF6sBPNklziZCcjQErMYjbS8m-lBb3LgU&s=19',
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcSs2R9EVvzCgM54ehjPLd2uNAnNJd1SGU5RHi5ZCtdodhQKHX63-RzJhYB4nRMyiWgWJ7TpgDsaHpjtmO78RcjD_3E&s=19'
      ],
      'viladecans': [
        'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcRagf6PKtjj8hSZTGkAvLpSsl_5Q8C_6tqWMHqUo7ymcmojtZDlEuwPLKMyHQX32o_zYcyxzPPoEWj99GFMvsfH7BU&s=19',
        'https://lh3.googleusercontent.com/gps-cs-s/APNQkAEYxJRzmeu07RQ5MvVKF5lXoDBrL_1Dy5F3OoStOKPK99-yShPYig8nDuhtPhMT6kInAKH1ivIkHcBbFz90bnbGoB2VOT7yitaY8qwc6dMxtd4ffxmnYPde5-yvwM7kkr7fS1p50Q=s1360-w1360-h1020-rw'
      ]
    };

    for (const key of Object.keys(cityImages)) {
      if (city.includes(key)) {
        return cityImages[key];
      }
    }

    // Default fallback si la ciudad no está en la lista (imágenes del mundo)
    return [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQ3NxA7EQui-gEBmjFR63WjwdYb-66dAkasoHR5ctLw&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS81uOI8e52Y0fytIwNIJouopdvpyfz1Hv777swcm_2Ww&s=10',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQus_9dXgjqvSTTLhs2Uym5Np1T5vz-C1T9PyRCzc7cTA&s=10'
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

  goToItinerary(event: Event) {
    event.preventDefault();
    this.router.navigate(['/ruta'], { queryParams: { openCurrent: 'true' } });
  }
}

