import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DonationService, DonationOptions, ImpactFund } from '../../services/donation_service';
import { Observable, catchError, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-donation-options-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-options-page.component.html',
  styleUrl: './donation-options-page.component.scss',
})
export class DonationOptionsPageComponent implements OnInit {
  fundId!: number;
  donationOptions$!: Observable<DonationOptions[]>;
  fund$!: Observable<ImpactFund | null>;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private donationService: DonationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.fundId = +params['id'];
      
      if (isNaN(this.fundId)) {
        this.error = 'Invalid fund ID';
        return;
      }

      this.donationOptions$ = this.donationService.getDonationOptions(this.fundId).pipe(
        catchError((err) => {
          console.error('Failed to load donation options', err);
          this.error = 'Failed to load donation options';
          return of([]);
        })
      );
    });
  }

  goBack(): void {
    this.router.navigate(['/impact-funds']);
  }
}

