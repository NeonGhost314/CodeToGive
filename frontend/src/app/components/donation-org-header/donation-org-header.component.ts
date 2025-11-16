import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactFund } from '../../services/donation_service';

@Component({
  selector: 'app-donation-org-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-org-header.component.html',
  styleUrl: './donation-org-header.component.scss'
})
export class DonationOrgHeaderComponent {
  @Input() fund!: ImpactFund;
}

