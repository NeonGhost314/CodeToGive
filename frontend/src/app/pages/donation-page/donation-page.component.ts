import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DonationService, ImpactFund } from '../../services/donation_service';
import { Observable, catchError, of } from 'rxjs';
import { DonationOptionsModalComponent } from '../../components/donation-options-modal/donation-options-modal.component';

@Component({
  selector: 'app-donation-page',
  standalone: true,
  imports: [CommonModule, DonationOptionsModalComponent],
  templateUrl: './donation-page.component.html',
  styleUrl: './donation-page.component.scss',
})
export class DonationPageComponent implements OnInit {
  funds$!: Observable<ImpactFund[]>;
  funds: ImpactFund[] = [];
  currentFundIndex: number = 0;
  selectedFund: ImpactFund | null = null;
  error?: string;

  constructor(
    private donationService: DonationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.funds$ = this.donationService.getImpactFunds().pipe(
      catchError((err) => {
        console.error('Failed to load impact funds', err);
        this.error = 'Failed to load impact funds';
        return of([]);
      })
    );
    
    this.funds$.subscribe(funds => {
      this.funds = funds;
    });
  }

  navigateUp(): void {
    if (this.funds.length > 0) {
      this.currentFundIndex = (this.currentFundIndex - 1 + this.funds.length) % this.funds.length;
    }
  }

  navigateDown(): void {
    if (this.funds.length > 0) {
      this.currentFundIndex = (this.currentFundIndex + 1) % this.funds.length;
    }
  }

  openFundDetail(fund: ImpactFund): void {
    this.selectedFund = fund;
  }

  closeFundDetail(): void {
    this.selectedFund = null;
  }
}

