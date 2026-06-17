import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-itinerary-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="content-area relative pt-[40px] pb-[120px] px-[20px]">
      <div class="relative mt-[24px]">
        <div class="absolute left-[18px] top-4 bottom-4 timeline-line opacity-20"></div>
        
        <div *ngFor="let item of days; let i = index" class="relative pl-12 mb-[24px] group">
          <div class="absolute left-0 top-6 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg transition-transform group-active:scale-90"
               [ngClass]="getDotClass(i)">
            <span class="material-symbols-outlined text-white text-[20px]" style="font-variation-settings: 'FILL' 1;">{{getIcon(i)}}</span>
          </div>
          
          <div class="flex flex-col gap-4">
            <h3 class="font-headline-sm text-headline-sm text-[20px] font-semibold" [ngClass]="getTextClass(i)">{{item.location}}</h3>
            
            <div #dayCard class="glass-card rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden transition-all duration-300 cursor-pointer"
                 (click)="toggleDay(i)">
              
              <div class="flex justify-between items-start">
                <div>
                  <span class="font-label-caps text-label-caps text-[12px] font-semibold uppercase tracking-wider" [ngClass]="getTextClass(i)">DÍA {{item.day < 10 ? '0'+item.day : item.day}}</span>
                  <h4 class="font-headline-sm text-headline-sm text-[#1a1c1f] mt-1 text-[20px] font-semibold">{{item.title}}</h4>
                </div>
                <span class="material-symbols-outlined" [ngClass]="getTextClass(i)">
                  {{ expandedDay === i ? 'expand_less' : 'expand_more' }}
                </span>
              </div>
              
              <div class="flex items-center text-[#454652] text-[13px] gap-1 -mt-2">
                 <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                 {{item.date}}
              </div>
              
              <!-- Detalles expandidos -->
              <div *ngIf="expandedDay === i" class="flex flex-col gap-3 mt-2 animate-fade-in max-h-[50vh] overflow-y-auto custom-scroll pr-1" #scrollContainer>
                <p class="font-body-md text-body-md text-[#454652] text-[15px]" [innerHTML]="formatDescription(item.description)"></p>
                
                <div class="flex flex-wrap gap-2 mt-2">
                  <span *ngFor="let tag of item.tags" class="glass-card px-2 py-1 rounded-lg font-caption text-caption text-[#1a237e] text-[11px]">{{tag}}</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, #f9f9fe 100%);
    }
    .content-area {
      flex: 1;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
    .bg-surface { background-color: #f9f9fe; }
    .glass-card {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    .timeline-line {
      width: 2px;
      background: linear-gradient(180deg, #1a237e 0%, #00a3d7 50%, #1a237e 100%);
    }
    .custom-scroll::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: rgba(26, 35, 126, 0.2);
      border-radius: 4px;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ItineraryScreenComponent implements OnInit {
  days: ItineraryDay[] = [];
  expandedDay: number | null = null;
  
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    fetch('assets/data/itinerary.json')
      .then(res => res.json())
      .then(data => {
        this.days = data;
        this.cdr.detectChanges();
      })
      .catch(err => console.error('Error fetching itinerary:', err));
  }

  getDotClass(index: number) {
    const cycle = index % 3;
    if (cycle === 0) return 'bg-[#1a237e] shadow-[#1a237e]/20'; // primary
    if (cycle === 1) return 'bg-[#864e5a] shadow-[#864e5a]/20'; // secondary color
    return 'bg-[#00a3d7] shadow-[#00a3d7]/20'; // tertiary
  }

  getTextClass(index: number) {
    const cycle = index % 3;
    if (cycle === 0) return 'text-[#1a237e]';
    if (cycle === 1) return 'text-[#864e5a]';
    return 'text-[#00a3d7]';
  }

  getIcon(index: number) {
    const cycle = index % 3;
    if (cycle === 0) return 'location_on';
    if (cycle === 1) return 'history_edu';
    return 'waves';
  }

  formatDescription(desc: string) {
    return desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  toggleDay(index: number) {
    if (this.expandedDay === index) {
      this.expandedDay = null;
    } else {
      this.expandedDay = index;
    }
  }

}
