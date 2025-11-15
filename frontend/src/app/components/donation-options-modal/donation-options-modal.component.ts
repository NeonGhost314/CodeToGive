import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DonationService, DonationOptions, ImpactFund } from '../../services/donation_service';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-donation-options-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donation-options-modal.component.html',
  styleUrl: './donation-options-modal.component.scss',
})
export class DonationOptionsModalComponent implements OnInit {
  @Input() fund!: ImpactFund;
  @Output() close = new EventEmitter<void>();
  
  donationOptions$!: Observable<DonationOptions[]>;
  error?: string;
  
  // Selected donation option
  selectedOption: DonationOptions | null = null;
  selectedAmount: number | null = null;
  
  // Personalized amount
  showPersonalizedAmount: boolean = false;
  personalizedAmount: number = 0;
  
  // Membership
  showMembership: boolean = false;
  membershipAmount: number = 0;
  membershipInterval: 'monthly' | 'quarterly' | 'yearly' = 'monthly';
  
  getDefaultActionOptions(): DonationOptions[] {
    return [
      {
        id: 1,
        fundId: this.fund?.id || 0,
        description: "Financer 3 heures d'écoute",
        suggestedAmount: 45,
        optionType: 'action'
      },
      {
        id: 2,
        fundId: this.fund?.id || 0,
        description: "Offrir 1 nuit de sécurité",
        suggestedAmount: 75,
        optionType: 'action'
      },
      {
        id: 3,
        fundId: this.fund?.id || 0,
        description: "Payer 1 kit d'urgence",
        suggestedAmount: 25,
        optionType: 'action'
      }
    ];
  }

  constructor(private donationService: DonationService) {}

  ngOnInit(): void {
    if (this.fund?.id) {
      const defaultOptions = this.getDefaultActionOptions();
      
      // Try to load from backend, fallback to defaults
      this.donationOptions$ = this.donationService.getDonationOptions(this.fund.id).pipe(
        catchError((err) => {
          console.error('Failed to load donation options, using defaults', err);
          return of(defaultOptions);
        })
      );
    } else {
      this.donationOptions$ = of(this.getDefaultActionOptions());
    }
  }

  onClose(): void {
    this.close.emit();
  }

  selectOption(option: DonationOptions): void {
    this.selectedOption = option;
    this.selectedAmount = option.suggestedAmount;
    this.showPersonalizedAmount = false;
    this.showMembership = false;
  }

  togglePersonalizedAmount(): void {
    this.showPersonalizedAmount = !this.showPersonalizedAmount;
    if (this.showPersonalizedAmount) {
      this.selectedOption = null;
      this.showMembership = false;
    }
  }

  toggleMembership(): void {
    this.showMembership = !this.showMembership;
    if (this.showMembership) {
      this.selectedOption = null;
      this.showPersonalizedAmount = false;
    }
  }

  onProceedToPayment(): void {
    let amount = 0;
    let donationType = 'one-time';
    let interval = null;
    
    if (this.selectedOption) {
      amount = this.selectedOption.suggestedAmount;
    } else if (this.showPersonalizedAmount && this.personalizedAmount > 0) {
      amount = this.personalizedAmount;
    } else if (this.showMembership && this.membershipAmount > 0) {
      amount = this.membershipAmount;
      donationType = 'membership';
      interval = this.membershipInterval;
    }
    
    if (amount > 0) {
      console.log('Proceeding to payment:', {
        fundId: this.fund.id,
        fundName: this.fund.name,
        amount,
        donationType,
        interval,
        selectedOption: this.selectedOption?.description
      });
      // TODO: Navigate to payment page with these parameters
    }
  }

  canProceed(): boolean {
    if (this.selectedOption) return true;
    if (this.showPersonalizedAmount && this.personalizedAmount > 0) return true;
    if (this.showMembership && this.membershipAmount > 0) return true;
    return false;
  }
}

