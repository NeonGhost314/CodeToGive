import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DonationSummaryData {
  amount: number;
  type: string;
  fundName: string;
  isMonthly?: boolean;
}

@Component({
  selector: 'app-donation-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-summary.component.html',
  styleUrl: './donation-summary.component.scss'
})
export class DonationSummaryComponent {
  @Input() summary!: DonationSummaryData;

  getTypeLabel(): string {
    switch (this.summary.type) {
      case 'one-time':
        return 'Don unique';
      case 'monthly':
        return 'Don mensuel';
      case 'securities':
        return 'Don de valeurs mobilières';
      default:
        return 'Don';
    }
  }
}

