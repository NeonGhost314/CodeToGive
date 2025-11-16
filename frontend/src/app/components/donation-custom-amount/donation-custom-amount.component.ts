import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donation-custom-amount',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-custom-amount.component.html',
  styleUrl: './donation-custom-amount.component.scss'
})
export class DonationCustomAmountComponent implements OnInit {
  @Input() minAmount?: number = 1;
  @Input() maxAmount?: number = 10000;
  @Input() currentAmount?: number;
  @Output() amountChanged = new EventEmitter<number>();

  customAmount: number = 0;
  quickAmounts: number[] = [25, 50, 100, 250, 500];

  ngOnInit(): void {
    if (this.currentAmount) {
      this.customAmount = this.currentAmount;
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

