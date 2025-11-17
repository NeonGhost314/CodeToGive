import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donation-custom-amount',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-custom-amount.component.html',
  styleUrl: './donation-custom-amount.component.scss'
})
export class DonationCustomAmountComponent implements OnInit, OnChanges {
  @Input() minAmount?: number = 1;
  @Input() maxAmount?: number = 10000;
  @Input() currentAmount?: number;
  @Output() amountChanged = new EventEmitter<number>();

  customAmount: number = 0;
  quickAmounts: number[] = [25, 50, 100, 250, 500];

  ngOnInit(): void {
    if (this.currentAmount !== undefined) {
      this.customAmount = this.currentAmount;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Mettre à jour customAmount quand currentAmount change (y compris si c'est 0)
    if (changes['currentAmount']) {
      const newValue = changes['currentAmount'].currentValue;
      // Mettre à jour même si c'est 0 (0 est une valeur valide, donc on vérifie explicitement)
      if (newValue === 0 || (newValue !== undefined && newValue !== null)) {
        this.customAmount = newValue;
      }
    }
  }

  onAmountChange(): void {
    if (this.customAmount >= (this.minAmount || 0) && this.customAmount <= (this.maxAmount || 10000)) {
      this.amountChanged.emit(this.customAmount);
    }
  }

  selectQuickAmount(amount: number): void {
    this.customAmount = amount;
    this.amountChanged.emit(amount);
  }

  isValid(): boolean {
    return this.customAmount >= (this.minAmount || 0) && this.customAmount <= (this.maxAmount || 10000);
  }
}

