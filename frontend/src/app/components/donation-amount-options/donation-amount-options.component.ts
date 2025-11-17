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
  allOptions: DonationAmountOption[] = [];
  customOption: DonationAmountOption = {
    title: 'General',
    isCustom: true,
    imageUrl: "/assets/pictures/general.png"
  };
  selectedOption?: DonationAmountOption;

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    const serviceOptions = this.donationService.getDonationAmountOptions();
    // Insérer "General" en 3ème position
    this.allOptions = [
      serviceOptions[0], // Annual Art Auction
      serviceOptions[1], // Second Step Shelter
      this.customOption, // General (3ème position)
      serviceOptions[2]  // Accès au Gala 2025 Annual Lilac Gala
    ];
    this.options = this.allOptions;
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

