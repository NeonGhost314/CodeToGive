import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-organisation-donor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './organisation-donor.component.html',
  styleUrl: './organisation-donor.component.scss'
})
export class OrganisationDonorComponent {
  phoneNumber = '514-274-8117';
  email = 'EVENEMENT@BOUCLIERDATHENA.COM';
  sponsorshipFormPath = 'assets/Sponsorship_Forms_ENFR_2025.pdf';

  onDownloadForm(): void {
    const link = document.createElement('a');
    link.href = this.sponsorshipFormPath;
    link.download = 'Sponsorship_Forms_ENFR_2025.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onCallPhone(): void {
    window.open(`tel:${this.phoneNumber}`);
  }

  onSendEmail(): void {
    window.open(`mailto:${this.email}?subject=Corporate Sponsorship Inquiry`);
  }
}