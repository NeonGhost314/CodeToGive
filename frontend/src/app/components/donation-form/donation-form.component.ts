import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImpactFund, DonationAmountOption, DonationItems } from '../../services/donation_service';
import { DonationGoalProgressComponent } from '../donation-goal-progress/donation-goal-progress.component';

export interface DonationData {
  fundId: number;
  amount: number;
  type: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  message?: string;
  recurringPeriod?: 'monthly' | 'quarterly' | 'yearly';
  endDate?: string; // ISO date string
  hasEndDate?: boolean;
}

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DonationGoalProgressComponent],
  templateUrl: './donation-form.component.html',
  styleUrl: './donation-form.component.scss'
})
export class DonationFormComponent implements OnInit, OnChanges {
  @Input() selectedFundCategory?: DonationAmountOption;
  @Input() selectedItems: DonationItems[] = [];
  @Input() totalAmountFromItems: number = 0;
  @Input() fund!: ImpactFund;
  @Input() currentGoalAmount: number = 0;
  @Input() goalAmount: number = 10000;
  @Output() submit = new EventEmitter<DonationData>();

  donationType: 'one-time' | 'monthly' | 'quarterly' | 'yearly' = 'one-time';
  amount: number = 0;
  message: string = '';
  
  // Recurring donation options
  recurringPeriod: 'monthly' | 'quarterly' | 'yearly' = 'monthly';
  hasEndDate: boolean = false;
  endDate: string = '';
  
  // Computed min date (today)
  minDate: string = '';

  ngOnInit(): void {
    this.updateAmount();
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    // Set default end date based on recurring period
    if (this.donationType !== 'one-time') {
      this.updateEndDateForPeriod();
      this.hasEndDate = true;
    }
  }

  private updateEndDateForPeriod(): void {
    const today = new Date();
    const endDate = new Date(today);
    
    switch (this.recurringPeriod) {
      case 'monthly':
        // Next month
        endDate.setMonth(today.getMonth() + 1);
        break;
      case 'quarterly':
        // Next quarter (3 months from now)
        endDate.setMonth(today.getMonth() + 3);
        break;
      case 'yearly':
        // Next year
        endDate.setFullYear(today.getFullYear() + 1);
        break;
    }
    
    this.endDate = endDate.toISOString().split('T')[0];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['selectedFundCategory'] && !changes['selectedFundCategory'].firstChange) ||
        (changes['totalAmountFromItems'] && !changes['totalAmountFromItems'].firstChange) ||
        (changes['selectedItems'] && !changes['selectedItems'].firstChange)) {
      this.updateAmount();
    }
  }

  private updateAmount(): void {
    if (this.totalAmountFromItems > 0) {
      this.amount = this.totalAmountFromItems;
    } else {
      this.amount = 0;
    }
  }

  onDonationTypeChange(type: 'one-time' | 'monthly' | 'quarterly' | 'yearly'): void {
    this.donationType = type;
    
    if (type === 'one-time') {
      this.hasEndDate = false;
    } else {
      // When switching to recurring, set the period to match the type
      this.recurringPeriod = type;
      // Always set hasEndDate to true for recurring donations
      this.hasEndDate = true;
      // Update end date based on the new period
      this.updateEndDateForPeriod();
    }
  }
  
  onRecurringPeriodChange(period: 'monthly' | 'quarterly' | 'yearly'): void {
    this.recurringPeriod = period;
    this.donationType = period;
    // Update end date when period changes
    this.updateEndDateForPeriod();
  }
  
  getRecurringSummary(): string {
    if (this.donationType === 'one-time') {
      return '';
    }
    
    const periodText = this.recurringPeriod === 'monthly' ? 'month' : 
                      this.recurringPeriod === 'quarterly' ? 'quarter' : 'year';
    
    let summary = `$${this.amount} per ${periodText}`;
    
    if (this.endDate) {
      const endDateObj = new Date(this.endDate);
      const formattedDate = endDateObj.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
      });
      summary += ` until ${formattedDate}`;
    }
    
    return summary;
  }
  
  getTotalCommitment(): number {
    if (this.donationType === 'one-time' || !this.amount) {
      return this.amount;
    }
    
    if (!this.endDate) {
      // If no end date is set, show first year estimate
      const periodsPerYear = this.recurringPeriod === 'monthly' ? 12 : 
                            this.recurringPeriod === 'quarterly' ? 4 : 1;
      return this.amount * periodsPerYear;
    }
    
    // Calculate total based on end date
    const startDate = new Date();
    const endDate = new Date(this.endDate);
    const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                       (endDate.getMonth() - startDate.getMonth());
    
    let periods = 0;
    if (this.recurringPeriod === 'monthly') {
      periods = Math.max(1, monthsDiff);
    } else if (this.recurringPeriod === 'quarterly') {
      periods = Math.max(1, Math.ceil(monthsDiff / 3));
    } else { // yearly
      const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
      periods = Math.max(1, yearsDiff);
    }
    
    return this.amount * periods;
  }

  canProceed(): boolean {
    return this.amount > 0 && this.amount >= 1;
  }

  getPotentialDonationAmount(): number {
    if (this.amount <= 0) {
      return 0;
    }
    
    // For one-time donations, return the amount directly
    if (this.donationType === 'one-time') {
      return this.amount;
    }
    
    // For recurring donations, return the total commitment
    return this.getTotalCommitment();
  }

  onSubmit(): void {
    if (!this.canProceed()) {
      return;
    }

    const donationData: DonationData = {
      fundId: this.fund.id,
      amount: this.amount,
      type: this.donationType,
      message: this.message || undefined,
      recurringPeriod: this.donationType !== 'one-time' ? this.recurringPeriod : undefined,
      endDate: this.donationType !== 'one-time' && this.endDate ? this.endDate : undefined,
      hasEndDate: this.donationType !== 'one-time' ? true : undefined
    };

    this.submit.emit(donationData);
  }
}

