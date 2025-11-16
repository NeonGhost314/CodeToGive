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
    const fundIndex = this.funds.findIndex(f => f.id === fund.id);
    
    if (fundIndex === this.currentFundIndex) {
      this.selectedFund = fund;
    } else {
      this.currentFundIndex = fundIndex;
    }
  }

  closeFundDetail(): void {
    this.selectedFund = null;
  }

  getEfficiencyRate(fund: ImpactFund): number {
    // Mock du taux d'efficacité basé sur l'ID du fonds
    const rates = [92, 87, 95, 89, 91, 88, 93];
    return rates[fund.id % rates.length] || 90;
  }

  getBasketCost(fund: ImpactFund): number {
    // Mock du coût d'un panier basé sur l'ID et le type de fonds
    const baseCosts = [75, 125, 200, 150, 100, 175, 250];
    return baseCosts[fund.id % baseCosts.length] || 150;
  }
}

