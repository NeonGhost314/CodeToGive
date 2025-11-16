import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-form.component.html',
  styleUrl: './auth-form.component.scss',
})
export class AuthFormComponent {
  @Input() mode: 'login' | 'register' = 'login';
  @Output() submit = new EventEmitter<{
    email: string;
    password: string;
    first_name?: string;
  }>();

  email: string = '';
  password: string = '';
  first_name: string = '';

  onSubmit(): void {
    if (this.mode === 'register') {
      this.submit.emit({
        email: this.email,
        password: this.password,
        first_name: this.first_name,
      });
    } else {
      this.submit.emit({
        email: this.email,
        password: this.password,
      });
    }
  }
}

