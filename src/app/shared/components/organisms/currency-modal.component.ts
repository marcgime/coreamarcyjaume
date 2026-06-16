import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExchangeService } from '../../../core/services/exchange.service';
import { IconComponent } from '../atoms/icon.component';

@Component({
  selector: 'app-currency-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div [ngClass]="['modal-overlay', isOpen ? 'active' : '']" (click)="onOverlayClick($event)">
      <div class="modal-content"
           (touchstart)="onTouchStart($event)"
           (touchmove)="onTouchMove($event)"
           (touchend)="onTouchEnd($event)">
        <div class="modal-handle"></div>
        
        <div class="modal-header">
          <h3 class="modal-title">
            <app-icon name="payments" size="24px" color="#00a3d7"></app-icon>
            <span>Conversor de Divisas</span>
          </h3>
          <button class="modal-close" (click)="close.emit()">
            <app-icon name="close" size="20px" color="#1a237e"></app-icon>
          </button>
        </div>

        <div class="converter-container">
          <!-- EUR Input -->
          <div class="currency-input-group">
            <div class="currency-info">
              <span class="currency-flag">🇪🇺</span>
              <div>
                <div class="currency-code">EUR</div>
                <div class="currency-name">Euro</div>
              </div>
            </div>
            <input type="number" 
                   [value]="exchangeService.eurValue()" 
                   (input)="onEurInput($event)"
                   class="currency-field" 
                   placeholder="0" 
                   min="0" 
                   step="any">
          </div>

          <!-- KRW Input -->
          <div class="currency-input-group">
            <div class="currency-info">
              <span class="currency-flag">🇰🇷</span>
              <div>
                <div class="currency-code">KRW</div>
                <div class="currency-name">Won Surcoreano</div>
              </div>
            </div>
            <input type="number" 
                   [value]="exchangeService.krwValue()" 
                   (input)="onKrwInput($event)"
                   class="currency-field" 
                   placeholder="0" 
                   min="0" 
                   step="1">
          </div>

          <!-- Rate Telemetry Info Box -->
          <div class="rate-info-box">
            <div>Tipo de cambio oficial de Internet:</div>
            <div class="rate-value">{{ formattedRate() }}</div>
            <div class="rate-update">Actualizado: {{ formattedDate() }}</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(26, 35, 126, 0.15);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 200;
      display: flex;
      align-items: flex-end; /* Efecto iOS bottom sheet */
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }
    .modal-content {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(25px);
      -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 32px 32px 0 0;
      width: 100%;
      max-width: 600px;
      padding: 24px 24px calc(var(--safe-area-bottom, 34px) + 24px) 24px;
      box-shadow: 0 -10px 40px rgba(0, 6, 102, 0.1);
      transform: translateY(100%);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-overlay.active .modal-content {
      transform: translateY(0);
    }
    .modal-handle {
      width: 36px;
      height: 5px;
      background: rgba(0, 6, 102, 0.15);
      border-radius: 999px;
      margin: 0 auto 20px auto;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-title {
      font-size: 20px;
      font-weight: 700;
      color: #1a237e;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .modal-close {
      background: rgba(0, 6, 102, 0.05);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #1a237e;
      transition: background-color 0.2s;
    }
    .modal-close:hover {
      background: rgba(0, 6, 102, 0.1);
    }
    .converter-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .currency-input-group {
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(26, 35, 126, 0.1);
      border-radius: 16px;
      padding: 14px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .currency-input-group:focus-within {
      border-color: #1a237e;
      box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
    }
    .currency-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .currency-flag {
      font-size: 24px;
      line-height: 1;
    }
    .currency-code {
      font-size: 15px;
      font-weight: 700;
      color: #1a237e;
    }
    .currency-name {
      font-size: 11px;
      color: #454652;
      margin-top: 1px;
    }
    .currency-field {
      background: transparent;
      border: none;
      outline: none;
      font-size: 22px;
      font-weight: 700;
      text-align: right;
      color: #1a237e;
      width: 60%;
      font-family: inherit;
    }
    .rate-info-box {
      background: rgba(0, 163, 215, 0.05);
      border: 1px solid rgba(0, 163, 215, 0.15);
      border-radius: 12px;
      padding: 12px;
      text-align: center;
      font-size: 12px;
      color: #454652;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .rate-value {
      font-weight: 700;
      color: #1a237e;
    }
    @media (min-width: 601px) {
      .modal-overlay {
        align-items: center;
      }
      .modal-content {
        border-radius: 24px;
        width: 90%;
        margin-bottom: 0;
        padding-bottom: 24px;
      }
      .modal-handle {
        display: none;
      }
    }
  `]
})
export class CurrencyModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  exchangeService = inject(ExchangeService);

  // Computed signals para formateo
  formattedRate = computed(() => {
    const rateVal = this.exchangeService.rate();
    const formatted = new Intl.NumberFormat('es-ES', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(rateVal);
    return `1 EUR = ${formatted} KRW`;
  });

  formattedDate = computed(() => {
    return this.exchangeService.lastUpdated().toLocaleString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  });

  onEurInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.exchangeService.updateEur(input.value);
  }

  onKrwInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.exchangeService.updateKrw(input.value);
  }

  onOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this.close.emit();
    }
  }

  // Touch gesture state variables
  private startY = 0;
  private currentY = 0;
  private isDragging = false;

  onTouchStart(e: TouchEvent) {
    const target = e.target as HTMLElement;
    if (target.closest('.modal-handle') || target.closest('.modal-header')) {
      this.startY = e.touches[0].clientY;
      this.isDragging = true;
      const content = target.closest('.modal-content') as HTMLElement;
      if (content) content.style.transition = 'none';
    }
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    this.currentY = e.touches[0].clientY;
    const deltaY = this.currentY - this.startY;
    const content = (e.currentTarget as HTMLElement);
    if (deltaY > 0) {
      content.style.transform = `translateY(${deltaY}px)`;
    }
  }

  onTouchEnd(e: TouchEvent) {
    if (!this.isDragging) return;
    this.isDragging = false;
    const deltaY = this.currentY - this.startY;
    const threshold = 120;
    const content = (e.currentTarget as HTMLElement);
    
    content.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
    if (deltaY > threshold) {
      content.style.transform = 'translateY(100%)';
      setTimeout(() => this.close.emit(), 150);
    } else {
      content.style.transform = 'translateY(0)';
    }
  }
}
