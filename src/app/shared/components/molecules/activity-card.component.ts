import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stop } from '../../../core/models/trip.interface';
import { BadgeComponent } from '../atoms/badge.component';

@Component({
  selector: 'app-activity-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="glass-card activity-card">
      <div class="activity-img-wrapper">
        <img class="activity-img" [src]="stop.image" [alt]="stop.image_alt || stop.title" loading="lazy">
      </div>
      <div class="activity-info">
        <h4 class="activity-title">{{ stop.title }}</h4>
        <p class="activity-time">{{ stop.time_str }}</p>
      </div>
      <app-badge type="tag">{{ stop.category }}</app-badge>
    </div>
  `,
  styles: [`
    .glass-card {
      background: rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .activity-card {
      border-radius: 16px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .activity-card:hover {
      transform: translateX(4px);
    }
    .activity-img-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .activity-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .activity-info {
      flex-grow: 1;
    }
    .activity-title {
      font-size: 15px;
      font-weight: 600;
      color: #1a237e;
    }
    .activity-time {
      font-size: 11px;
      color: #454652;
      margin-top: 2px;
    }
  `]
})
export class ActivityCardComponent {
  @Input({ required: true }) stop!: Stop;
}
