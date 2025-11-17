import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ImpactFund, DonationAmountOption, DonationItems, DonationService } from '../../services/donation_service';
import { AuthService } from '../../services/auth.service';
import { DonationGoalProgressComponent } from '../donation-goal-progress/donation-goal-progress.component';
import { DonationCustomAmountComponent } from '../donation-custom-amount/donation-custom-amount.component';

export interface DonationData {
  fundId: number;
  amount: number;
  type: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  message?: string;
  recurringPeriod?: 'monthly' | 'quarterly' | 'yearly';
}

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DonationGoalProgressComponent, DonationCustomAmountComponent],
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
  @Input() isCustomAmountMode: boolean = false;
  @Output() submit = new EventEmitter<DonationData>();

  donationType: 'one-time' | 'monthly' | 'quarterly' | 'yearly' = 'one-time';
  amount: number = 0;
  message: string = '';
  
  // Recurring donation options
  recurringPeriod: 'monthly' | 'quarterly' | 'yearly' = 'monthly';

  constructor(
    private authService: AuthService,
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateAmount();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['selectedFundCategory'] && !changes['selectedFundCategory'].firstChange) ||
        (changes['totalAmountFromItems'] && !changes['totalAmountFromItems'].firstChange) ||
        (changes['selectedItems'] && !changes['selectedItems'].firstChange) ||
        (changes['isCustomAmountMode'] && !changes['isCustomAmountMode'].firstChange)) {
      this.updateAmount();
    }
  }

  private updateAmount(): void {
    if (this.isCustomAmountMode) {
      // Don't override custom amount if in custom mode
      return;
    }
    if (this.totalAmountFromItems > 0) {
      this.amount = this.totalAmountFromItems;
    } else {
      this.amount = 0;
    }
  }

  onCustomAmountChange(amount: number): void {
    this.amount = amount;
  }

  onDonationTypeChange(type: 'one-time' | 'monthly' | 'quarterly' | 'yearly'): void {
    this.donationType = type;
    
    if (type !== 'one-time') {
      // When switching to recurring, set the period to match the type
      this.recurringPeriod = type;
    }
  }
  
  onRecurringPeriodChange(period: 'monthly' | 'quarterly' | 'yearly'): void {
    this.recurringPeriod = period;
    this.donationType = period;
  }
  
  getRecurringSummary(): string {
    if (this.donationType === 'one-time') {
      return '';
    }
    
    const periodText = this.recurringPeriod === 'monthly' ? 'month' : 
                      this.recurringPeriod === 'quarterly' ? 'quarter' : 'year';
    
    return `$${this.amount} per ${periodText}`;
  }
  
  getTotalCommitment(): number {
    if (this.donationType === 'one-time' || !this.amount) {
      return this.amount;
    }
    
    // Calculate total for one year (recurring donations are open-ended)
    const periodsPerYear = this.recurringPeriod === 'monthly' ? 12 : 
                          this.recurringPeriod === 'quarterly' ? 4 : 1;
    return this.amount * periodsPerYear;
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
      recurringPeriod: this.donationType !== 'one-time' ? this.recurringPeriod : undefined
    };

    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      // Sauvegarder les données de don pour après la connexion
      this.donationService.setPendingDonationData({
        fundId: donationData.fundId,
        amount: donationData.amount,
        type: donationData.type,
        message: donationData.message,
        fundName: this.fund.name,
        recurringPeriod: donationData.recurringPeriod
      });
      
      // Rediriger vers la page d'authentification avec un paramètre de retour
      this.router.navigate(['/auth'], { queryParams: { returnUrl: '/payment' } });
      return;
    }

    // Si connecté, émettre l'événement normalement
    this.submit.emit(donationData);
  }
}

