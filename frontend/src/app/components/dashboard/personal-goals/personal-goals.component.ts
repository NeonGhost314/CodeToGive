import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard.service';
import { AuthService } from '../../../services/auth.service';
import { PersonalGoal, CreateGoalData } from '../../../models/dashboard.model';
import { GoalFormComponent } from '../goal-form/goal-form.component';
import { JoinAthenaModalComponent } from '../../../components/join-athena-modal/join-athena-modal.component';

@Component({
  selector: 'app-personal-goals',
  standalone: true,
  imports: [CommonModule, GoalFormComponent, JoinAthenaModalComponent],
  templateUrl: './personal-goals.component.html',
  styleUrl: './personal-goals.component.scss'
})
export class PersonalGoalsComponent implements OnInit {
  @Output() goalCreated = new EventEmitter<void>();
  
  goals: PersonalGoal[] = [];
  isLoading: boolean = true;
  error?: string;
  isFormOpen: boolean = false;
  editingGoal?: PersonalGoal;
  showJoinModal: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router
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
    // Vérifier si l'utilisateur est connecté
    if (!this.authService.isAuthenticated()) {
      // Afficher le modal pour proposer de créer un compte
      this.showJoinModal = true;
      return;
    }

    this.editingGoal = undefined;
    this.isFormOpen = true;
  }

  onJoinAccepted(): void {
    this.showJoinModal = false;
    // La navigation vers /auth/signup est gérée par le composant modal
  }

  onJoinDeclined(): void {
    this.showJoinModal = false;
    // Retourner à la page principale
    this.router.navigate(['/']);
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
          // Emit event to notify parent dashboard of new goal creation
          this.goalCreated.emit();
        },
        error: (error) => {
          this.error = 'Failed to create goal';
        }
      });
    }
  }

  deleteGoal(goalId: number): void {
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

