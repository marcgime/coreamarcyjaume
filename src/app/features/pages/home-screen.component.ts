import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../../core/services/trip.service';
import { LocationService } from '../../core/services/location.service';
import { WeatherService } from '../../core/services/weather.service';
import { ExchangeService } from '../../core/services/exchange.service';
import { DestinationHeroComponent } from '../../shared/components/organisms/destination-hero.component';
import { QuickActionsComponent } from '../../shared/components/organisms/quick-actions.component';
import { ActivityCardComponent } from '../../shared/components/molecules/activity-card.component';
import { CurrencyModalComponent } from '../../shared/components/organisms/currency-modal.component';
import { EmergencyModalComponent } from '../../shared/components/organisms/emergency-modal.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
    CommonModule,
    DestinationHeroComponent,
    QuickActionsComponent,
    ActivityCardComponent,
    CurrencyModalComponent,
    EmergencyModalComponent
  ],
  template: `
    <!-- Main Scrollable Content -->
    <main class="content-area">
      <!-- Large Header Title -->
      <div>
        <h1 class="header-title">Corea Agosto 2026</h1>
      </div>

      <!-- Hero Destination Card (Weather & City) -->
      <app-destination-hero></app-destination-hero>

      <!-- Bento Grid Action Buttons -->
      <app-quick-actions
        (openCurrency)="isCurrencyOpen.set(true)"
        (openEmergency)="isEmergencyOpen.set(true)">
      </app-quick-actions>

      <!-- Upcoming Events Timeline -->
      <section class="events-section">
        <div class="section-header">
          <h2 class="section-title">Próximos Eventos</h2>
          <button class="section-link">VER TODO</button>
        </div>
        
        <div class="activities-list">
          @if (tripService.activeTrip(); as trip) {
            @for (stop of trip.stops; track stop.id) {
              <app-activity-card [stop]="stop"></app-activity-card>
            } @empty {
              <div class="glass-card empty-card">
                No hay actividades planificadas para hoy.
              </div>
            }
          } @else {
            <!-- Skeletons Loader State -->
            <div class="glass-card activity-card skeleton-card">
              <div class="skeleton img-skeleton"></div>
              <div class="info-skeleton">
                <div class="skeleton line-1"></div>
                <div class="skeleton line-2"></div>
              </div>
            </div>
            <div class="glass-card activity-card skeleton-card opacity-50">
              <div class="skeleton img-skeleton"></div>
              <div class="info-skeleton">
                <div class="skeleton line-1"></div>
                <div class="skeleton line-2"></div>
              </div>
            </div>
          }
        </div>
      </section>
    </main>

    <!-- Modals -->
    <app-currency-modal 
      [isOpen]="isCurrencyOpen()" 
      (close)="isCurrencyOpen.set(false)">
    </app-currency-modal>

    <app-emergency-modal 
      [isOpen]="isEmergencyOpen()" 
      (close)="isEmergencyOpen.set(false)">
    </app-emergency-modal>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-height: 0;
      overflow: hidden;
    }
    .content-area {
      padding: 24px 20px 100px 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
      flex-grow: 1;
    }
    .header-title {
      font-size: 34px;
      font-weight: 700;
      line-height: 41px;
      letter-spacing: -0.02em;
      color: #1a237e;
      margin-bottom: 8px;
    }
    .events-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 4px;
    }
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a237e;
    }
    .section-link {
      font-size: 11px;
      font-weight: 600;
      color: #00a3d7;
      background: none;
      border: none;
      cursor: pointer;
      letter-spacing: 0.05em;
    }
    .activities-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .empty-card {
      padding: 24px;
      text-align: center;
      color: #454652;
      font-size: 15px;
    }
    .glass-card {
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
    }
    
    /* Skeletons loader styling */
    .skeleton-card {
      height: 88px;
      border: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 12px;
      display: flex;
      align-items: center;
    }
    .skeleton {
      background: linear-gradient(90deg, #ededf2 25%, #e2e2e7 50%, #ededf2 75%);
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: 4px;
    }
    .img-skeleton {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      margin-right: 16px;
      flex-shrink: 0;
    }
    .info-skeleton {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .line-1 {
      width: 60%;
      height: 16px;
    }
    .line-2 {
      width: 40%;
      height: 12px;
    }
    .opacity-50 {
      opacity: 0.5;
    }
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class HomeScreenComponent implements OnInit {
  tripService = inject(TripService);
  locationService = inject(LocationService);
  weatherService = inject(WeatherService);
  exchangeService = inject(ExchangeService);

  // Signals para visibilidad de modales
  isCurrencyOpen = signal<boolean>(false);
  isEmergencyOpen = signal<boolean>(false);

  async ngOnInit() {
    // Orquestación de la carga inicial reactiva mediante Signals
    try {
      // 1. Obtener localización
      const coords = await this.locationService.updateLocation();
      
      // 2. Cargar clima para las coordenadas
      await this.weatherService.fetchWeather(coords.lat, coords.lon);
      
      // 3. Cargar datos del viaje (actividades)
      await this.tripService.loadActiveTrip();
      
      // 4. Pre-cargar tasas del conversor
      await this.exchangeService.loadExchangeRate();
    } catch (err) {
      console.error('Error inicializando pantalla de inicio:', err);
    }
  }
}
