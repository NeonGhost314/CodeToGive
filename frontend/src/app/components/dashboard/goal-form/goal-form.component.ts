import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonalGoal, CreateGoalData } from '../../../models/dashboard.model';

@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goal-form.component.html',
  styleUrl: './goal-form.component.scss'
})
export class GoalFormComponent implements OnInit, OnChanges {
  @Input() goal?: PersonalGoal;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<CreateGoalData>();

  name: string = '';
  targetAmount: number = 0;
  deadline: string = '';
  error: string = '';

  ngOnInit(): void {
    if (this.goal) {
      this.name = this.goal.name;
      this.targetAmount = this.goal.target_amount;
      this.deadline = this.goal.deadline ? this.goal.deadline.split('T')[0] : '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['goal'] && this.goal) {
      this.name = this.goal.name;
      this.targetAmount = this.goal.target_amount;
      this.deadline = this.goal.deadline ? this.goal.deadline.split('T')[0] : '';
    } else if (changes['isOpen'] && !this.isOpen) {
      this.resetForm();
    }
  }

  get minDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  resetForm(): void {
    this.name = '';
    this.targetAmount = 0;
    this.deadline = '';
    this.error = '';
  }

  onClose(): void {
    this.resetForm();
    this.close.emit();
  }

  onSubmit(): void {
    this.error = '';

    if (!this.name.trim()) {
      this.error = 'Goal name is required';
      return;
    }

    if (this.targetAmount <= 0) {
      this.error = 'Target amount must be greater than 0';
      return;
    }

    if (this.deadline) {
      const deadlineDate = new Date(this.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        this.error = 'Deadline must be in the future';
        return;
      }
    }

    const goalData: CreateGoalData = {
      name: this.name.trim(),
      target_amount: this.targetAmount,
      deadline: this.deadline ? new Date(this.deadline).toISOString() : undefined
    };

    this.save.emit(goalData);
    this.resetForm();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}

