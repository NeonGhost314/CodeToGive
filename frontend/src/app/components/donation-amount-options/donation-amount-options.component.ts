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
  @Input() selectedFundId?: number;
  @Output() amountSelected = new EventEmitter<DonationAmountOption>();
  @Output() customAmountSelected = new EventEmitter<void>();

  options: DonationAmountOption[] = [];
  customOption: DonationAmountOption = {
    title: 'Custom Amount',
    isCustom: true
  };
  selectedOption?: DonationAmountOption;

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    this.options = this.donationService.getDonationAmountOptions();
  }

  onOptionSelected(option: DonationAmountOption): void {
    if (option.isCustom) {
      this.selectedOption = this.customOption;
      this.customAmountSelected.emit();
    } else {
      this.selectedOption = option;
      this.amountSelected.emit(option);
    }
  }

  isSelected(option: DonationAmountOption): boolean {
    if (option.isCustom) {
      return this.selectedOption === this.customOption;
    }
    return this.selectedOption?.fundId === option.fundId;
  }
}

