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

  getIconClass(iconName: string): string {
    const iconMap: { [key: string]: string } = {
      food: 'utensils',
      hygiene: 'soap',
      clothing: 'tshirt',
      phone: 'phone',
      medical: 'plus-circle',
      legal: 'file-contract',
      transport: 'car',
      info: 'info-circle',
      psychology: 'brain',
      therapy: 'heart',
      group: 'users',
      social: 'user-friends',
      workshop: 'chalkboard-teacher',
      education: 'graduation-cap',
      job: 'briefcase',
      shelter: 'home',
      bed: 'bed',
      security: 'shield-alt',
      house: 'home',
      specialist: 'user-md',
      children: 'child',
      follow: 'plus'
    };
    return iconMap[iconName] || 'info-circle';
  }
}

