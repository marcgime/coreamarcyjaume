import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
}

@Component({
  selector: 'app-itinerary-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[-1] overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-surface"></div>
    </div>

    <!-- Header -->
    <header class="fixed top-0 w-full z-50 bg-surface/50 backdrop-blur-xl border-b border-white/20 shadow-sm shadow-primary/10 pt-[59px] px-[20px] pb-[8px] flex flex-col">
      <div class="flex items-center justify-between h-14">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-[#1a237e] font-headline-md text-headline-md">account_circle</span>
          <h1 class="font-display-lg text-display-lg text-[#1a237e] font-bold text-[34px] tracking-tight">Discover Korea</h1>
        </div>
        <span class="material-symbols-outlined text-[#1a237e] font-headline-md text-headline-md">notifications</span>
      </div>
    </header>

    <main class="relative pt-[140px] pb-[120px] px-[20px]">
      <section class="mb-[24px]">
        <div class="flex items-center gap-2 mb-2">
          <span class="px-3 py-1 glass-card rounded-full font-label-caps text-label-caps text-[#00a3d7] uppercase tracking-wider text-[12px] font-semibold">20 Day Route</span>
        </div>
        <h2 class="font-display-lg text-display-lg text-[#1a237e] font-bold text-[34px] tracking-tight leading-tight">The Grand Loop</h2>
        <p class="font-body-md text-body-md text-[#454652] mt-2 max-w-[85%] text-[15px]">A seamless journey from Seoul's neon skyscrapers to the ancient temples of Gyeongju and the coastal energy of Busan.</p>
      </section>

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
                 (click)="toggleDay(i)"
                 (wheel)="onScroll($event, i, dayCard)"
                 (touchmove)="onTouchMove($event, i, dayCard)"
                 (touchstart)="onTouchStart($event)">
              
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
                
                <div class="h-48 w-full rounded-lg overflow-hidden mt-2 relative">
                  <img [src]="item.image" [alt]="item.title" class="w-full h-full object-cover">
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div class="absolute bottom-2 left-2 flex items-center gap-1">
                    <span class="material-symbols-outlined text-white text-[14px]">photo_camera</span>
                    <span class="text-white text-caption font-caption text-[11px]">{{item.location}}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
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
  
  private lastTouchY = 0;
  private isAtBottomCount = 0;

  ngOnInit() {
    fetch('assets/data/itinerary.json')
      .then(res => res.json())
      .then(data => {
        this.days = data;
      });
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
    this.isAtBottomCount = 0; // Reset
  }

  onScroll(event: WheelEvent, index: number, element: HTMLElement) {
    if (this.expandedDay !== index) return;
    
    const scrollContainer = element.querySelector('.custom-scroll') as HTMLElement;
    if (!scrollContainer) return;

    if (event.deltaY > 0) {
      this.checkCloseOnScroll(scrollContainer);
    } else {
      this.isAtBottomCount = 0;
    }
  }

  onTouchStart(event: TouchEvent) {
    this.lastTouchY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent, index: number, element: HTMLElement) {
    if (this.expandedDay !== index) return;
    
    const scrollContainer = element.querySelector('.custom-scroll') as HTMLElement;
    if (!scrollContainer) return;

    const currentY = event.touches[0].clientY;
    const isScrollingDown = this.lastTouchY > currentY;
    this.lastTouchY = currentY;

    if (isScrollingDown) {
      this.checkCloseOnScroll(scrollContainer);
    } else {
      this.isAtBottomCount = 0;
    }
  }

  private checkCloseOnScroll(container: HTMLElement) {
    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 2;
    
    if (isAtBottom) {
      this.isAtBottomCount++;
      if (this.isAtBottomCount > 5) {
        this.expandedDay = null;
        this.isAtBottomCount = 0;
      }
    }
  }
}
