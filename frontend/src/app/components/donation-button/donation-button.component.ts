import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationService, ImpactFund } from '../../services/donation_service';
import { Observable, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-donation-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-button.component.html',
  styleUrl: './donation-button.component.scss',
})
export class DonationButtonComponent implements OnInit {
  constructor(private donationService: DonationService, private router: Router) {}

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
    this.router.navigateByUrl('/donation');
  }
}

