import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface PersonalGoal {
  amount: number;
  targetDate: Date;
  createdAt: Date;
}

@Component({
  selector: 'app-personal-donation-goal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './personal-donation-goal.component.html',
  styleUrl: './personal-donation-goal.component.scss'
})
export class PersonalDonationGoalComponent implements OnInit {
  @Output() goalCreated = new EventEmitter<void>();

  amount: number = 0;
  targetDate: string = '';
  errors: { [key: string]: string } = {};

  ngOnInit(): void {
    // Définir la date par défaut à 1 an à partir d'aujourd'hui
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1);
    this.targetDate = oneYearLater.toISOString().split('T')[0];
  }

  validateForm(): boolean {
    this.errors = {};

    if (!this.amount || this.amount < 1) {
      this.errors['amount'] = 'Le montant doit être d\'au moins 1$';
    }

    if (!this.targetDate) {
      this.errors['targetDate'] = 'La date cible est requise';
    } else {
      const selectedDate = new Date(this.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        this.errors['targetDate'] = 'La date doit être dans le futur';
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  onCreateGoal(): void {
    if (!this.validateForm()) {
      return;
    }

    const goal: PersonalGoal = {
      amount: this.amount,
      targetDate: new Date(this.targetDate),
      createdAt: new Date()
    };

    // Stocker dans localStorage
    const existingGoals = this.getStoredGoals();
    existingGoals.push(goal);
    localStorage.setItem('personalDonationGoals', JSON.stringify(existingGoals));

    // Émettre l'événement
    this.goalCreated.emit();
  }

  onSkip(): void {
    this.goalCreated.emit();
  }

  private getStoredGoals(): PersonalGoal[] {
    const stored = localStorage.getItem('personalDonationGoals');
    if (!stored) {
      return [];
    }
    try {
      const goals = JSON.parse(stored);
      // Convertir les dates string en Date objects
      return goals.map((goal: any) => ({
        ...goal,
        targetDate: new Date(goal.targetDate),
        createdAt: new Date(goal.createdAt)
      }));
    } catch {
      return [];
    }
  }

  getMinDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-CA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}

