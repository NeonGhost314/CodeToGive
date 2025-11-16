import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationService, DonationItems } from '../../services/donation_service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-donation-items-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-items-list.component.html',
  styleUrl: './donation-items-list.component.scss'
})
export class DonationItemsListComponent implements OnInit, OnChanges {
  @Input() fundId?: number;
  @Output() itemsSelected = new EventEmitter<{ items: DonationItems[], totalAmount: number }>();

  items: DonationItems[] = [];
  selectedItems: Set<number> = new Set();
  totalAmount: number = 0;

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fundId']) {
      if (this.fundId) {
        this.selectedItems.clear();
        this.totalAmount = 0;
        this.loadItems();
      } else {
        this.items = [];
        this.selectedItems.clear();
        this.totalAmount = 0;
      }
    }
  }

  private loadItems(): void {
    if (!this.fundId) {
      this.items = [];
      return;
    }

    this.donationService.getDonationItems(this.fundId).subscribe({
      next: (items) => {
        this.items = items;
      },
      error: (err) => {
        console.error('Failed to load donation items', err);
        this.items = [];
      }
    });
  }

  toggleItem(item: DonationItems): void {
    if (this.selectedItems.has(item.id)) {
      this.selectedItems.delete(item.id);
    } else {
      this.selectedItems.add(item.id);
    }
    this.calculateTotal();
  }

  isSelected(item: DonationItems): boolean {
    return this.selectedItems.has(item.id);
  }

  private calculateTotal(): void {
    this.totalAmount = Array.from(this.selectedItems)
      .reduce((sum, itemId) => {
        const item = this.items.find(i => i.id === itemId);
        return sum + (item?.suggestedAmount || 0);
      }, 0);
    
    const selectedItemsArray = Array.from(this.selectedItems)
      .map(id => this.items.find(item => item.id === id))
      .filter((item): item is DonationItems => item !== undefined);
    
    this.itemsSelected.emit({
      items: selectedItemsArray,
      totalAmount: this.totalAmount
    });
  }

  getIconForItem(description: string): string {
    const desc = description.toLowerCase();
    if (desc.includes('meal') || desc.includes('food')) return 'food';
    if (desc.includes('hygiene')) return 'hygiene';
    if (desc.includes('clothing')) return 'clothing';
    if (desc.includes('hotline') || desc.includes('phone') || desc.includes('crisis')) return 'phone';
    if (desc.includes('first aid') || desc.includes('medical')) return 'medical';
    if (desc.includes('legal') || desc.includes('consultation')) return 'legal';
    if (desc.includes('transport')) return 'transport';
    if (desc.includes('information') || desc.includes('resources')) return 'info';
    if (desc.includes('psychological') || desc.includes('psychology')) return 'psychology';
    if (desc.includes('therapy')) return 'therapy';
    if (desc.includes('support group') || desc.includes('peer')) return 'group';
    if (desc.includes('follow-up') || desc.includes('follow up')) return 'social';
    if (desc.includes('workshop')) return 'workshop';
    if (desc.includes('training') || desc.includes('education')) return 'education';
    if (desc.includes('job')) return 'job';
    if (desc.includes('shelter') || desc.includes('night')) return 'shelter';
    if (desc.includes('bed') || desc.includes('rest')) return 'bed';
    if (desc.includes('safety') || desc.includes('security')) return 'security';
    if (desc.includes('housing') || desc.includes('house')) return 'house';
    if (desc.includes('specialist') || desc.includes('consultation')) return 'specialist';
    if (desc.includes('children')) return 'children';
    return 'info';
  }

  getIconSvg(iconName: string): string {
    const icons: { [key: string]: string } = {
      food: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.1 13.34L11 16.24L18.34 8.9C19.22 8.03 19.22 6.65 18.34 5.78C17.47 4.9 16.09 4.9 15.22 5.78L8.1 12.91V13.34ZM11 2L8.5 4.5L11 7L13.5 4.5L11 2ZM13.5 11.5L11 9L8.5 11.5L11 14L13.5 11.5Z" fill="currentColor"/></svg>`,
      hygiene: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V4C20 2.9 19.1 2 18 2ZM18 20H6V4H18V20Z" fill="currentColor"/><path d="M8 6H16V8H8V6ZM8 10H16V12H8V10ZM8 14H13V16H8V14Z" fill="currentColor"/></svg>`,
      clothing: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.5 4.5C16.67 4.5 16.04 4.95 15.88 5.77L14.12 4.01C13.8 3.69 13.4 3.5 13 3.5C12.6 3.5 12.2 3.69 11.88 4.01L10.12 5.77C9.96 4.95 9.33 4.5 8.5 4.5C7.67 4.5 7.04 4.95 6.88 5.77L4.01 8.64L5.64 10.27L8.5 7.41C8.5 7.68 8.73 7.91 9 7.91C9.27 7.91 9.5 7.68 9.5 7.41L12.64 4.27C12.97 3.94 13.03 3.94 13.36 4.27L16.5 7.41C16.5 7.68 16.73 7.91 17 7.91C17.27 7.91 17.5 7.68 17.5 7.41L20.36 10.27L21.99 8.64L19.12 5.77C18.96 4.95 18.33 4.5 17.5 4.5ZM20 11.27L19.12 12.15L17.5 10.53L15.88 12.15L14.12 10.39L13 11.51V20.5H11V11.51L9.88 10.39L8.12 12.15L6.5 10.53L4.88 12.15L4 11.27V20.5C4 21.33 4.67 22 5.5 22H18.5C19.33 22 20 21.33 20 20.5V11.27Z" fill="currentColor"/></svg>`,
      phone: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/></svg>`,
      medical: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z" fill="currentColor"/></svg>`,
      legal: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/></svg>`,
      transport: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 8H17V4H3C1.9 4 1 4.9 1 6V17H3C3 18.66 4.34 20 6 20S9 18.66 9 17H15C15 18.66 16.34 20 18 20S21 18.66 21 17H23V12L20 8ZM6 18.5C5.17 18.5 4.5 17.83 4.5 17S5.17 15.5 6 15.5 7.5 16.17 7.5 17 6.83 18.5 6 18.5ZM19.5 9.5L21.46 12H17V9.5H19.5ZM18 18.5C17.17 18.5 16.5 17.83 16.5 17S17.17 15.5 18 15.5 19.5 16.17 19.5 17 18.83 18.5 18 18.5Z" fill="currentColor"/></svg>`,
      info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/></svg>`,
      psychology: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 2C5.36 2 2 5.36 2 9.5C2 11.28 2.61 12.92 3.63 14.23L2.5 16.5L4.77 15.37C6.08 16.39 7.72 17 9.5 17C13.64 17 17 13.64 17 9.5C17 5.36 13.64 2 9.5 2ZM9.5 15C7.57 15 6 13.43 6 11.5C6 9.57 7.57 8 9.5 8C11.43 8 13 9.57 13 11.5C13 13.43 11.43 15 9.5 15ZM17.5 10C17.78 10 18 10.22 18 10.5V11.5C18 11.78 17.78 12 17.5 12H16.5C16.22 12 16 11.78 16 11.5V10.5C16 10.22 16.22 10 16.5 10H17.5ZM19.5 8C19.78 8 20 8.22 20 8.5V9.5C20 9.78 19.78 10 19.5 10H18.5C18.22 10 18 9.78 18 9.5V8.5C18 8.22 18.22 8 18.5 8H19.5ZM21.5 12C21.78 12 22 12.22 22 12.5V13.5C22 13.78 21.78 14 21.5 14H20.5C20.22 14 20 13.78 20 13.5V12.5C20 12.22 20.22 12 20.5 12H21.5Z" fill="currentColor"/></svg>`,
      therapy: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/></svg>`,
      group: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/></svg>`,
      social: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/></svg>`,
      workshop: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H13V16H11V12H7V10H11V6H13V10H17V12Z" fill="currentColor"/></svg>`,
      education: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18ZM12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="currentColor"/></svg>`,
      job: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19ZM7 10H9V17H7V10ZM11 10H13V17H11V10ZM15 10H17V17H15V10Z" fill="currentColor"/></svg>`,
      shelter: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/></svg>`,
      bed: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 14C8.66 14 10 12.66 10 11C10 9.34 8.66 8 7 8C5.34 8 4 9.34 4 11C4 12.66 5.34 14 7 14ZM19 11H11V7H19V11ZM7 16C4.24 16 2 13.76 2 11C2 8.24 4.24 6 7 6C9.76 6 12 8.24 12 11C12 13.76 9.76 16 7 16ZM17 6H11V4H17V6ZM19 14H11V12H19V14ZM23 19H1V21H23V19Z" fill="currentColor"/></svg>`,
      security: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 7C13.4 7 14.8 8.6 14.8 10V11H16V16H8V11H9.2V10C9.2 8.6 10.6 7 12 7ZM12 8.2C11.2 8.2 10.6 8.7 10.6 10V11H13.4V10C13.4 8.7 12.8 8.2 12 8.2Z" fill="currentColor"/></svg>`,
      house: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/></svg>`,
      specialist: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/></svg>`,
      children: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 12C17.88 12 19 10.88 19 9.5C19 8.12 17.88 7 16.5 7C15.12 7 14 8.12 14 9.5C14 10.88 15.12 12 16.5 12ZM9 11C10.38 11 11.5 9.88 11.5 8.5C11.5 7.12 10.38 6 9 6C7.62 6 6.5 7.12 6.5 8.5C6.5 9.88 7.62 11 9 11ZM16.5 14C14.67 14 11 14.92 11 16.75V19H22V16.75C22 14.92 18.33 14 16.5 14ZM9 13C6.67 13 2 14.17 2 16.5V19H9V16.75C9 15.9 9.33 14.17 12 13.26C10.94 13.09 9.95 13 9 13Z" fill="currentColor"/></svg>`,
      follow: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/></svg>`
    };
    return icons[iconName] || icons['info'];
  }
}

