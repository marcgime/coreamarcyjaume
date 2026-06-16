import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <span class="material-symbols-outlined" [style.fontSize]="size" [style.color]="color">
      {{ name }}
    </span>
  `,
  styles: [`
    .material-symbols-outlined {
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
  `]
})
export class IconComponent {
  @Input({ required: true }) name!: string;
  @Input() size: string = '24px';
  @Input() color: string = 'inherit';
}
