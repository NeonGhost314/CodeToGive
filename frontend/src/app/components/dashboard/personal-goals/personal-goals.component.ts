import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { PersonalGoal, CreateGoalData } from '../../../models/dashboard.model';
import { GoalFormComponent } from '../goal-form/goal-form.component';

@Component({
  selector: 'app-personal-goals',
  standalone: true,
  imports: [CommonModule, GoalFormComponent],
  templateUrl: './personal-goals.component.html',
  styleUrl: './personal-goals.component.scss'
})
export class PersonalGoalsComponent implements OnInit {
  goals: PersonalGoal[] = [];
  isLoading: boolean = true;
  error?: string;
  isFormOpen: boolean = false;
  editingGoal?: PersonalGoal;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadGoals(userId);
    }
  }

  loadGoals(userId: number): void {
    this.isLoading = true;
    this.dashboardService.getPersonalGoals(userId).subscribe({
      next: (goals) => {
        this.goals = goals;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load goals';
        this.isLoading = false;
      }
    });
  }

  openCreateForm(): void {
    this.editingGoal = undefined;
    this.isFormOpen = true;
  }

  openEditForm(goal: PersonalGoal): void {
    this.editingGoal = goal;
    this.isFormOpen = true;
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.editingGoal = undefined;
  }

  onSaveGoal(goalData: CreateGoalData): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    if (this.editingGoal) {
      // Update existing goal
      this.dashboardService.updatePersonalGoal(userId, this.editingGoal.id, goalData).subscribe({
        next: () => {
          this.closeForm();
          this.loadGoals(userId);
        },
        error: (error) => {
          this.error = 'Failed to update goal';
        }
      });
    } else {
      // Create new goal
      this.dashboardService.createPersonalGoal(userId, goalData).subscribe({
        next: () => {
          this.closeForm();
          this.loadGoals(userId);
        },
        error: (error) => {
          this.error = 'Failed to create goal';
        }
      });
    }
  }

  deleteGoal(goalId: number): void {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.dashboardService.deletePersonalGoal(userId, goalId).subscribe({
      next: () => {
        this.loadGoals(userId);
      },
      error: (error) => {
        this.error = 'Failed to delete goal';
      }
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'No deadline';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatAmount(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }

  getProgressPercentage(goal: PersonalGoal): number {
    if (goal.target_amount === 0) return 0;
    return Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
  }
}

