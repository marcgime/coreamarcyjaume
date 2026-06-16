import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccommodationService } from '../../core/services/accommodation.service';
import { IconComponent } from '../../shared/components/atoms/icon.component';

@Component({
  selector: 'app-accommodations-screen',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <main class="content-area">
      <!-- Encabezado de la Sección -->
      <div class="header-section">
        <h1 class="header-title">Alojamientos</h1>
        <p class="subtitle">{{ accommodationService.accommodations().length }} reservas confirmadas en Corea del Sur</p>
      </div>

      <!-- Lista de Tarjetas de Hotel -->
      <div class="accommodations-list">
        @for (acc of accommodationService.accommodations(); track acc.id) {
          <div class="glass-card accommodation-card">
            <div class="image-container">
              <img [src]="acc.image" [alt]="acc.name" class="hotel-image" />
              <div class="status-badge" [ngClass]="acc.status.toLowerCase()">
                {{ acc.status }}
              </div>
              <div class="price-badge">
                {{ acc.price | currency:'EUR':'symbol':'1.0-0' }}
              </div>
            </div>

            <div class="card-content">
              <div class="card-header">
                <h3 class="hotel-name">{{ acc.name }}</h3>
                <span class="dates-chip">{{ acc.dates }}</span>
              </div>
              
              <div class="city-container">
                <span class="city-dot"></span>
                <p class="hotel-city">{{ acc.city }}</p>
              </div>
              
              <div class="divider"></div>
              
              <div class="address-container">
                <app-icon name="location_on" size="18px" color="var(--text-secondary)"></app-icon>
                <span class="hotel-address">{{ acc.address }}</span>
              </div>

              <div class="actions-container">
                <a [href]="acc.mapsUrl" target="_blank" class="btn btn-maps">
                  <app-icon name="map" size="18px" color="#ffffff"></app-icon>
                  <span>Ver en Maps</span>
                </a>
                <a [href]="acc.bookingUrl" target="_blank" class="btn btn-booking">
                  <app-icon name="bed" size="18px" color="var(--primary)"></app-icon>
                  <span>Booking</span>
                </a>
              </div>
            </div>
          </div>
        } @empty {
          <!-- Skeletons Loader State si no hay alojamientos cargados -->
          <div class="glass-card empty-card">
            No se han encontrado reservas de alojamiento.
          </div>
        }
      </div>
    </main>
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
      padding: 24px 20px 110px 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
      flex-grow: 1;
    }
    .header-section {
      margin-bottom: 4px;
    }
    .header-title {
      font-size: 34px;
      font-weight: 700;
      line-height: 41px;
      letter-spacing: -0.02em;
      color: var(--primary);
    }
    .subtitle {
      font-size: 15px;
      color: var(--text-secondary);
      opacity: 0.8;
      margin-top: 4px;
    }
    .accommodations-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .accommodation-card {
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    }
    .accommodation-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 30px rgba(26, 35, 126, 0.08);
    }
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
    }
    .image-container {
      position: relative;
      height: 180px;
      overflow: hidden;
    }
    .hotel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .accommodation-card:hover .hotel-image {
      transform: scale(1.06);
    }
    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .status-badge.confirmada {
      background: rgba(26, 35, 126, 0.85);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .price-badge {
      position: absolute;
      bottom: 12px;
      right: 12px;
      background: rgba(255, 255, 255, 0.9);
      color: var(--primary);
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    .card-content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }
    .hotel-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary);
      line-height: 1.3;
      flex: 1;
    }
    .dates-chip {
      font-size: 11px;
      font-weight: 600;
      color: var(--tertiary);
      background: rgba(0, 163, 215, 0.1);
      border: 1px solid rgba(0, 163, 215, 0.15);
      padding: 4px 10px;
      border-radius: 8px;
      white-space: nowrap;
    }
    .city-container {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .city-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--tertiary);
      box-shadow: 0 0 8px var(--tertiary-glow);
    }
    .hotel-city {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .divider {
      height: 1px;
      background: rgba(26, 35, 126, 0.1);
      margin: 4px 0;
    }
    .address-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .hotel-address {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    .actions-container {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }
    .btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-decoration: none;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: pointer;
    }
    .btn:active {
      transform: scale(0.96);
    }
    .btn-maps {
      background: var(--primary);
      color: #ffffff;
      border: 1px solid var(--primary);
      box-shadow: 0 4px 12px rgba(26, 35, 126, 0.15);
    }
    .btn-maps:hover {
      background: var(--primary-dark);
      box-shadow: 0 6px 16px rgba(26, 35, 126, 0.25);
    }
    .btn-booking {
      background: rgba(255, 255, 255, 0.6);
      color: var(--primary);
      border: 1px solid rgba(26, 35, 126, 0.2);
    }
    .btn-booking:hover {
      background: rgba(255, 255, 255, 0.95);
      border-color: var(--primary);
    }
    .empty-card {
      padding: 32px;
      text-align: center;
      color: var(--text-secondary);
      font-size: 15px;
    }
  `]
})
export class AccommodationsScreenComponent implements OnInit {
  accommodationService = inject(AccommodationService);

  ngOnInit() {
    this.accommodationService.loadAccommodations().catch(err => {
      console.error('Error al inicializar la pantalla de alojamientos:', err);
    });
  }
}
