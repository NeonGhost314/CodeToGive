import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-athena-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './join-athena-modal.component.html',
  styleUrl: './join-athena-modal.component.scss'
})
export class JoinAthenaModalComponent {
  @Output() accepted = new EventEmitter<void>();
  @Output() declined = new EventEmitter<void>();

  constructor(private router: Router) {}

  onAccept(): void {
    this.accepted.emit();
    this.router.navigate(['/auth/signup']);
  }

  onDecline(): void {
    this.declined.emit();
  }
}

