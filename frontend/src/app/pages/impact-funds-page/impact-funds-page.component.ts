import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationModalComponent } from '../../components/donation-modal/donation-modal.component';

@Component({
  selector: 'app-impact-funds-page',
  standalone: true,
  imports: [CommonModule, DonationModalComponent],
  templateUrl: './impact-funds-page.component.html',
  styleUrl: './impact-funds-page.component.scss',
})
export class ImpactFundsPageComponent {
}

