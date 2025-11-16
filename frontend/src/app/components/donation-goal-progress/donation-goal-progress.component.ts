import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donation-goal-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-goal-progress.component.html',
  styleUrl: './donation-goal-progress.component.scss'
})
export class DonationGoalProgressComponent {
  @Input() currentAmount: number = 0;
  @Input() goalAmount: number = 10000; // Objectif par défaut : 10 000$
  @Input() potentialAmount: number = 0; // Amount the user is considering donating
  
  get progressPercentage(): number {
    return Math.min((this.currentAmount / this.goalAmount) * 100, 100);
  }
  
  get potentialProgressPercentage(): number {
    if (this.potentialAmount <= 0) return 0;
    const totalWithPotential = this.currentAmount + this.potentialAmount;
    return Math.min((totalWithPotential / this.goalAmount) * 100, 100);
  }
  
  get potentialAdditionPercentage(): number {
    if (this.potentialAmount <= 0) return 0;
    const additionPercentage = (this.potentialAmount / this.goalAmount) * 100;
    return Math.min(additionPercentage, 100 - this.progressPercentage);
  }
  
  get remaining(): number {
    return Math.max(this.goalAmount - this.currentAmount, 0);
  }
  
  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-CA', { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(value);
  }
}

