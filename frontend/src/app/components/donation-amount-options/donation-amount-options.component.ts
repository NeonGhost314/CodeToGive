import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationAmountOption } from '../../services/donation_service';
import { DonationAmountCardComponent } from '../donation-amount-card/donation-amount-card.component';
import { DonationService } from '../../services/donation_service';

@Component({
  selector: 'app-donation-amount-options',
  standalone: true,
  imports: [CommonModule, DonationAmountCardComponent],
  templateUrl: './donation-amount-options.component.html',
  styleUrl: './donation-amount-options.component.scss'
})
export class DonationAmountOptionsComponent implements OnInit {
  @Input() selectedAmount?: number;
  @Output() amountSelected = new EventEmitter<DonationAmountOption>();
  @Output() customAmountSelected = new EventEmitter<void>();

  options: DonationAmountOption[] = [];
  customOption: DonationAmountOption = {
    amount: 0,
    title: 'Montant personnalisé',
    impactItems: [],
    isCustom: true
  };

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.options = this.donationService.getDonationAmountOptions();
  }

  onOptionSelected(option: DonationAmountOption): void {
    if (option.isCustom) {
      this.customAmountSelected.emit();
    } else {
      this.amountSelected.emit(option);
    }
  }

  isSelected(option: DonationAmountOption): boolean {
    return !option.isCustom && this.selectedAmount === option.amount;
  }
}

