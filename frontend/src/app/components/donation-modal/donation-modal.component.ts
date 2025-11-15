import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationService, ImpactFund } from '../../services/donation_service';
import { Observable, catchError, of } from 'rxjs';

@Component({
  selector: 'app-donation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-modal.component.html',
  styleUrl: './donation-modal.component.scss',
})
export class DonationModalComponent implements OnInit {
  constructor(private donationService: DonationService) {}

  impactFunds$!: Observable<ImpactFund[]>;
  error?: string;

  ngOnInit(): void {

    this.impactFunds$ = this.donationService.getImpactFunds().pipe(
      catchError((err) => {
        console.error('Failed to load impact funds', err);
        this.error = 'Failed to load impact funds';
        return of([]);
      })
    );
  }

  selectFund(fund: ImpactFund): void {
    console.log('Selected fund:', fund);
  }
}
