import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImpactFund, DonationAmountOption } from '../../services/donation_service';
import { DonationCustomAmountComponent } from '../donation-custom-amount/donation-custom-amount.component';
import { DonationGoalProgressComponent } from '../donation-goal-progress/donation-goal-progress.component';

export interface DonationData {
  fundId: number;
  amount: number;
  type: 'one-time' | 'monthly';    // Retiré 'securities' pour site interne
  message?: string;
}

@Component({
  selector: 'app-donation-form',
  standalone: true,
  imports: [CommonModule, FormsModule, DonationCustomAmountComponent, DonationGoalProgressComponent],
  templateUrl: './donation-form.component.html',
  styleUrl: './donation-form.component.scss'
})
export class DonationFormComponent implements OnInit, OnChanges {
  @Input() selectedPackage?: DonationAmountOption;
  @Input() fund!: ImpactFund;
  @Input() currentGoalAmount: number = 0;
  @Input() goalAmount: number = 10000;
  @Output() submit = new EventEmitter<DonationData>();

  donationType: 'one-time' | 'monthly' = 'one-time';
  amount: number = 0;
  message: string = '';
  showCustomAmount: boolean = false;
  customAmount: number = 0;

  ngOnInit(): void {
    this.updateFromPackage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPackage'] && !changes['selectedPackage'].firstChange) {
      this.updateFromPackage();
    }
  }

  private updateFromPackage(): void {
    if (this.selectedPackage && !this.selectedPackage.isCustom) {
      this.amount = this.selectedPackage.amount;
      this.showCustomAmount = false;
    } else if (this.selectedPackage?.isCustom) {
      this.showCustomAmount = true;
      this.amount = 0;
    } else {
      this.showCustomAmount = false;
      this.amount = 0;
    }
  }

  onPackageChange(packageOption: DonationAmountOption): void {
    if (!packageOption.isCustom) {
      this.amount = packageOption.amount;
      this.showCustomAmount = false;
    } else {
      this.showCustomAmount = true;
      this.amount = 0;
    }
  }

  onCustomAmountChange(amount: number): void {
    this.customAmount = amount;
    this.amount = amount;
  }

  onDonationTypeChange(type: 'one-time' | 'monthly'): void {
    this.donationType = type;
  }

  canProceed(): boolean {
    return this.amount > 0 && this.amount >= 1;
  }

  onSubmit(): void {
    if (!this.canProceed()) {
      return;
    }

    const donationData: DonationData = {
      fundId: this.fund.id,
      amount: this.amount,
      type: this.donationType,
      message: this.message || undefined
    };

    this.submit.emit(donationData);
  }
}

