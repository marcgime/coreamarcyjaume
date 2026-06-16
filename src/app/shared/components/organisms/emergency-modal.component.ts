import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../atoms/icon.component';

@Component({
  selector: 'app-emergency-modal',
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
          <h3 class="modal-title" style="color: #ba1a1a;">
            <app-icon name="emergency" size="24px" color="#ba1a1a"></app-icon>
            <span>Teléfonos de Emergencia</span>
          </h3>
          <button class="modal-close" (click)="close.emit()">
            <app-icon name="close" size="20px" color="#1a237e"></app-icon>
          </button>
        </div>

        <div class="emergency-grid">
          <!-- Policía -->
          <a href="tel:112" class="emergency-item">
            <div class="emergency-details">
              <span class="emergency-label">Policía Nacional</span>
              <span class="emergency-desc">Denuncias y emergencias de seguridad pública</span>
            </div>
            <div class="emergency-number">
              <app-icon name="call" size="16px" color="#ba1a1a"></app-icon>
              <span>112</span>
            </div>
          </a>

          <!-- Bomberos / Ambulancia -->
          <a href="tel:119" class="emergency-item">
            <div class="emergency-details">
              <span class="emergency-label">Bomberos y Rescate</span>
              <span class="emergency-desc">Incendios, ambulancias y emergencias médicas directas</span>
            </div>
            <div class="emergency-number">
              <app-icon name="call" size="16px" color="#ba1a1a"></app-icon>
              <span>119</span>
            </div>
          </a>

          <!-- Centro Médico (KCDC) -->
          <a href="tel:1339" class="emergency-item">
            <div class="emergency-details">
              <span class="emergency-label">Emergencias Médicas (KCDC)</span>
              <span class="emergency-desc">Consulta de brotes, pandemias e información de salud</span>
            </div>
            <div class="emergency-number">
              <app-icon name="call" size="16px" color="#ba1a1a"></app-icon>
              <span>1339</span>
            </div>
          </a>

          <!-- Asistencia al Turista -->
          <a href="tel:1330" class="emergency-item">
            <div class="emergency-details">
              <span class="emergency-label">Información Turística</span>
              <span class="emergency-desc">Soporte multilingüe 24/7 (incluye Español e Inglés)</span>
            </div>
            <div class="emergency-number" style="background: rgba(0, 163, 215, 0.1); border-color: rgba(0, 163, 215, 0.2); color: #00a3d7;">
              <app-icon name="call" size="16px" color="#00a3d7"></app-icon>
              <span>1330</span>
            </div>
          </a>
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
      align-items: flex-end;
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
    .emergency-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .emergency-item {
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid rgba(186, 26, 26, 0.1);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      transition: background-color 0.2s, transform 0.2s;
    }
    .emergency-item:hover {
      background: rgba(186, 26, 26, 0.03);
      border-color: rgba(186, 26, 26, 0.25);
      transform: translateX(4px);
    }
    .emergency-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .emergency-label {
      font-size: 15px;
      font-weight: 600;
      color: #1a237e;
    }
    .emergency-desc {
      font-size: 11px;
      color: #454652;
    }
    .emergency-number {
      background: rgba(186, 26, 26, 0.1);
      border: 1px solid rgba(186, 26, 26, 0.2);
      color: #ba1a1a;
      font-size: 16px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 6px;
      letter-spacing: 0.05em;
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
export class EmergencyModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

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
