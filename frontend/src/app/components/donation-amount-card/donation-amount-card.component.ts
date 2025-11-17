import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationAmountOption } from '../../services/donation_service';

@Component({
  selector: 'app-donation-amount-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-amount-card.component.html',
  styleUrl: './donation-amount-card.component.scss'
})
export class DonationAmountCardComponent {
  @Input() option!: DonationAmountOption;
  @Input() isSelected: boolean = false;
  @Output() select = new EventEmitter<DonationAmountOption>();

  onSelect(): void {
    this.select.emit(this.option);
  }
}

