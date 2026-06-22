import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../atoms/icon.component';

@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <section class="bento-grid">
      <!-- 1. Translate Card (Large) -->
      <div class="glass-card bento-card bento-large bento-translate" id="btn-translate" (click)="onTranslateClick()">
        <div class="bento-icon-wrapper">
          <app-icon name="translate" size="24px" color="#1a237e"></app-icon>
        </div>
        <div>
          <h3 class="bento-title">Translate</h3>
          <p class="bento-subtitle">KOR / ESP en tiempo real</p>
        </div>
      </div>

      <!-- 2. Currency Card -->
      <div class="glass-card bento-small-card bento-currency" id="btn-currency" (click)="openCurrency.emit()">
        <div class="flex-center-y">
          <div class="bento-icon-wrapper">
            <app-icon name="payments" size="24px" color="#00a3d7"></app-icon>
          </div>
          <span class="bento-title-small">Cambio</span>
        </div>
        <app-icon name="chevron_right" size="24px" color="#767683"></app-icon>
      </div>

      <!-- 3. Emergency Card -->
      <div class="bento-small-card bento-emergency" id="btn-emergency" (click)="openEmergency.emit()">
        <div class="flex-center-y">
          <div class="bento-icon-wrapper">
            <app-icon name="emergency" size="24px" color="#ffffff"></app-icon>
          </div>
          <span class="bento-emergency-text">Emergencia</span>
        </div>
        <app-icon name="chevron_right" size="24px" color="#ba1a1a"></app-icon>
      </div>
    </section>
  `,
  styles: [`
    .bento-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr; /* Dos filas de igual tamaño */
      gap: 16px;
    }
    .glass-card {
      background: var(--glass-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--glass-border);
      box-shadow: 0 10px 36px 0 rgba(43, 59, 156, 0.06);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
    }
    .bento-card {
      border-radius: 28px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      height: 100%;
      color: inherit;
    }
    .bento-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 16px 36px rgba(43, 59, 156, 0.12);
    }
    .bento-card:active {
      transform: scale(0.95);
    }
    .bento-large {
      grid-row: span 2; /* Ocupa las dos filas */
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .bento-small-card {
      padding: 16px 20px;
      border-radius: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      color: inherit;
      height: 100%;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, background 0.25s ease;
    }
    .bento-small-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(43, 59, 156, 0.08);
    }
    .bento-small-card:active {
      transform: scale(0.95);
    }
    .bento-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Specific Colors */
    .bento-translate .bento-icon-wrapper {
      background: rgba(43, 59, 156, 0.12);
    }
    .bento-currency .bento-icon-wrapper {
      background: rgba(0, 184, 230, 0.12);
    }
    .bento-emergency {
      background: rgba(186, 26, 26, 0.06);
      border: 1px solid rgba(186, 26, 26, 0.15);
      box-shadow: 0 6px 20px 0 rgba(186, 26, 26, 0.04);
    }
    .bento-emergency:hover {
      background: rgba(186, 26, 26, 0.1);
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(186, 26, 26, 0.08);
    }
    .bento-emergency:active {
      transform: scale(0.95);
    }
    .bento-emergency .bento-icon-wrapper {
      background: #ba1a1a;
    }
    .bento-emergency-text {
      color: #ba1a1a;
      font-weight: 700;
    }
    .bento-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--primary);
      margin-top: 12px;
    }
    .bento-title-small {
      font-size: 16px;
      font-weight: 700;
      color: var(--primary);
    }
    .bento-subtitle {
      font-size: 11px;
      color: var(--text-secondary);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: 600;
    }
    .flex-center-y {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class QuickActionsComponent {
  @Output() openCurrency = new EventEmitter<void>();
  @Output() openEmergency = new EventEmitter<void>();

  onTranslateClick() {
    const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    const webUrl = 'https://translate.google.com/?sl=es&tl=ko&op=translate';

    if (isIOS) {
      // Intentar abrir la app nativa en iOS mediante custom scheme
      window.location.href = 'googletranslate://?sl=es&tl=ko';
      
      // Fallback a web si la app no se abre (usando visibility API para evitar abrir web si la app ya se abrió)
      setTimeout(() => {
        if (!document.hidden) {
          window.open(webUrl, '_blank');
        }
      }, 2000);
    } else if (isAndroid) {
      // Intentar abrir la app nativa en Android mediante Intent URL
      window.location.href = 'intent://translate.google.com/?sl=es&tl=ko&op=translate#Intent;package=com.google.android.apps.translate;scheme=https;end';
    } else {
      // Fallback para escritorio
      window.open(webUrl, '_blank');
    }
  }
}
