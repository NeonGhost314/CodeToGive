import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService, PaymentResult } from '../../services/payment_service';
import { PersonalDonationGoalComponent } from '../../components/personal-donation-goal/personal-donation-goal.component';

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule, PersonalDonationGoalComponent],
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.scss'
})
export class PaymentConfirmationComponent implements OnInit {
  paymentResult: PaymentResult | null = null;
  showPersonalGoal: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Récupérer le résultat du paiement depuis sessionStorage
    const storedResult = sessionStorage.getItem('paymentResult');
    
    if (!storedResult) {
      // Si pas de résultat, rediriger vers la page initiale
      this.router.navigate(['/']);
      return;
    }

    this.paymentResult = JSON.parse(storedResult);

    // Afficher le composant flottant après 2-3 secondes
    setTimeout(() => {
      this.showPersonalGoal = true;
    }, 2500);
  }

  onGoalCreated(): void {
    // Nettoyer sessionStorage après confirmation
    sessionStorage.removeItem('paymentResult');
    
    // Retourner à la page initiale
    this.router.navigate(['/']);
  }
}

