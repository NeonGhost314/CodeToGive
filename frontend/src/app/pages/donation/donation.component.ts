import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationModalComponent } from '../../components/donation-modal/donation-modal.component';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, DonationModalComponent],
  templateUrl: './donation.component.html',
  styleUrl: './donation.component.scss',
})
export class DonationComponent {
}

