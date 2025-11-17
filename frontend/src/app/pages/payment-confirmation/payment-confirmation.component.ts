import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService, PaymentResult } from '../../services/payment_service';
import { PersonalDonationGoalComponent } from '../../components/personal-donation-goal/personal-donation-goal.component';
import { JoinAthenaModalComponent } from '../../components/join-athena-modal/join-athena-modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule, PersonalDonationGoalComponent, JoinAthenaModalComponent],
  templateUrl: './payment-confirmation.component.html',
  styleUrl: './payment-confirmation.component.scss'
})
export class PaymentConfirmationComponent implements OnInit {
  paymentResult: PaymentResult | null = null;
  showPersonalGoal: boolean = false;
  showJoinModal: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Récupérer le résultat du paiement depuis sessionStorage
    const storedResult = sessionStorage.getItem('paymentResult');
    
    if (!storedResult) {
      // Si pas de résultat, rediriger vers la page initiale
      this.router.navigate(['/']);
      return;
    }

    this.paymentResult = JSON.parse(storedResult);

    // Si l'utilisateur n'est pas connecté, proposer de créer un compte après 2 secondes
    if (!this.authService.isAuthenticated()) {
      setTimeout(() => {
        this.showJoinModal = true;
      }, 2000);
    } else {
      // Si connecté, afficher les défis améliorés après 2-3 secondes
      setTimeout(() => {
        this.showPersonalGoal = true;
      }, 2500);
    }
  }

  onJoinAccepted(): void {
    this.showJoinModal = false;
    // La navigation vers /auth/signup est gérée par le composant modal
  }

  onJoinDeclined(): void {
    this.showJoinModal = false;
    // Retourner à la page principale après un court délai
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 500);
  }

  onGoalCreated(): void {
    // Nettoyer sessionStorage après confirmation
    sessionStorage.removeItem('paymentResult');
    
    // Retourner à la page initiale
    this.router.navigate(['/']);
  }
}

