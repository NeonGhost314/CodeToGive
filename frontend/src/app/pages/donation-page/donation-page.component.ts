import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService, ImpactFund, DonationAmountOption, DonationItems } from '../../services/donation_service';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { DonationAmountOptionsComponent } from '../../components/donation-amount-options/donation-amount-options.component';
import { DonationFormComponent, DonationData } from '../../components/donation-form/donation-form.component';
import { OrganisationDonorComponent } from '../../components/organisation-donor/organisation-donor.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-donation-page',
  standalone: true,
  imports: [
    CommonModule,
    DonationAmountOptionsComponent,
    DonationFormComponent,
    OrganisationDonorComponent,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './donation-page.component.html',
  styleUrl: './donation-page.component.scss',
})
export class DonationPageComponent implements OnInit {
  fund$!: Observable<ImpactFund | null>;
  selectedFund: ImpactFund | null = null;
  selectedFundCategory?: DonationAmountOption;
  selectedItems: DonationItems[] = [];
  totalAmountFromItems: number = 0;
  error?: string;
  currentGoalAmount: number = 52000; // Montant actuel collecté (mock data)
  goalAmount: number = 100000; // Objectif à atteindre (mock data)

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    // Charger le fond depuis la route ou utiliser le premier disponible
    this.fund$ = this.route.paramMap.pipe(
      switchMap(params => {
        const fundId = params.get('id');
        if (!fundId) {
          // Si pas d'ID, charger le premier fond disponible
          return this.donationService.getImpactFunds().pipe(
            catchError((err) => {
              console.error('Failed to load impact funds', err);
              this.error = 'Failed to load impact funds';
              return of([]);
            }),
            switchMap(funds => {
              const fund = funds.length > 0 ? funds[0] : null;
              this.selectedFund = fund || null;
              return of(this.selectedFund);
            })
          );
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
            return of(this.selectedFund);
          })
        );
      })
    );

    this.fund$.subscribe();
  }

  onFundSelected(option: DonationAmountOption): void {
    this.selectedFundCategory = option;
    // Clear selected items when switching funds
    this.selectedItems = [];
    this.totalAmountFromItems = 0;
    // Si montant fixe, définir le montant
    if (option.fixedAmount && option.amount) {
      this.totalAmountFromItems = option.amount;
    }
  }

  onCustomAmountSelected(): void {
    this.selectedFundCategory = { 
      title: 'General',
      isCustom: true,
      imageUrl: "/assets/pictures/general.png"
    };
    // Clear selected items when general amount is selected
    this.selectedItems = [];
    this.totalAmountFromItems = 0;
  }

  onItemsSelected(event: { items: DonationItems[], totalAmount: number }): void {
    this.selectedItems = event.items;
    this.totalAmountFromItems = event.totalAmount;
  }
  getSelectedFundId(): number | undefined {
    return this.selectedFundCategory?.fundId;
  }

  isCustomAmountMode(): boolean {
    return this.selectedFundCategory?.isCustom === true;
  }

  onDonationSubmit(donationData: DonationData): void {
    console.log('Donation submitted:', donationData);
    
    // Stocker les données de don pour la page de paiement
    if (this.selectedFund) {
      this.donationService.setPendingDonationData({
        fundId: donationData.fundId,
        amount: donationData.amount,
        type: donationData.type,
        message: donationData.message,
        fundName: this.selectedFund.name,
        recurringPeriod: donationData.recurringPeriod
      });
      
      // Naviguer vers la page de paiement
      this.router.navigate(['/payment']);
    }
  }
}
