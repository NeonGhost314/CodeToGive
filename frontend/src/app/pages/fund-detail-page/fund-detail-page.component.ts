import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService, ImpactFund } from '../../services/donation_service';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { FundDetailModalComponent } from '../../components/fund-detail-modal/fund-detail-modal.component';
import { DonationOptionsModalComponent } from '../../components/donation-options-modal/donation-options-modal.component';

@Component({
  selector: 'app-fund-detail-page',
  standalone: true,
  imports: [CommonModule, FundDetailModalComponent, DonationOptionsModalComponent],
  templateUrl: './fund-detail-page.component.html',
  styleUrl: './fund-detail-page.component.scss',
})
export class FundDetailPageComponent implements OnInit {
  fund$!: Observable<ImpactFund | null>;
  selectedFund: ImpactFund | null = null;
  showDonationOptionsModal: boolean = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    this.fund$ = this.route.paramMap.pipe(
      switchMap(params => {
        const fundId = params.get('id');
        if (!fundId) {
          return of(null);
        }
        return this.donationService.getImpactFunds().pipe(
          catchError((err) => {
            console.error('Failed to load impact funds', err);
            this.error = 'Failed to load impact funds';
            return of([]);
          }),
          switchMap(funds => {
            const fund = funds.find(f => f.id === parseInt(fundId, 10));
            this.selectedFund = fund || null;
            return of(fund || null);
          })
        );
      })
    );
  }

  onClose(): void {
    this.router.navigate(['/donation']);
  }

  onDonate(): void {
    this.showDonationOptionsModal = true;
  }

  closeDonationOptionsModal(): void {
    this.showDonationOptionsModal = false;
  }
}

