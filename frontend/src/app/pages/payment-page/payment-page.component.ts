import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DonationService, DonationFormData } from '../../services/donation_service';
import { PaymentService, PaymentData } from '../../services/payment_service';
import { PaymentLoadingComponent } from '../../components/payment-loading/payment-loading.component';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, FormsModule, PaymentLoadingComponent],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.scss'
})
export class PaymentPageComponent implements OnInit {
  donationData: DonationFormData | null = null;
  
  // Données de paiement
  paymentMethod: 'visa' | 'mastercard' = 'visa';
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardName: string = '';
  email: string = '';

  // Calculs
  amount: number = 0;
  taxes: number = 0;
  total: number = 0;

  // États
  isProcessing: boolean = false;
  errors: { [key: string]: string } = {};

  constructor(
    private donationService: DonationService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les données de don
    this.donationData = this.donationService.getPendingDonationData();
    
    if (!this.donationData) {
      // Si pas de données, rediriger vers la page de don
      this.router.navigate(['/donation']);
      return;
    }

    this.amount = this.donationData.amount;
    this.calculateTotals();
  }

  calculateTotals(): void {
    const result = this.paymentService.calculateTaxes(this.amount);
    this.taxes = result.taxes;
    this.total = result.total;
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue.length > 19) {
      formattedValue = formattedValue.substring(0, 19);
    }
    this.cardNumber = formattedValue;
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.expiryDate = value;
  }

  validateForm(): boolean {
    this.errors = {};

    if (!this.cardNumber || !this.paymentService.validateCardNumber(this.cardNumber)) {
      this.errors['cardNumber'] = 'Veuillez entrer un numéro de carte valide (13-19 chiffres)';
    }

    if (!this.expiryDate || !this.paymentService.validateExpiryDate(this.expiryDate)) {
      this.errors['expiryDate'] = 'Veuillez entrer une date d\'expiration valide (MM/AA)';
    }

    if (!this.cvv || !this.paymentService.validateCVV(this.cvv)) {
      this.errors['cvv'] = 'Veuillez entrer un CVV valide (3 ou 4 chiffres)';
    }

    if (!this.cardName || this.cardName.trim().length < 2) {
      this.errors['cardName'] = 'Le nom sur la carte doit contenir au moins 2 caractères';
    }

    if (!this.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors['email'] = 'Veuillez entrer une adresse email valide';
    }

    return Object.keys(this.errors).length === 0;
  }

  // Validation en temps réel
  validateField(fieldName: string): void {
    switch (fieldName) {
      case 'cardNumber':
        if (this.cardNumber && !this.paymentService.validateCardNumber(this.cardNumber)) {
          this.errors['cardNumber'] = 'Numéro de carte invalide (13-19 chiffres requis)';
        } else if (this.cardNumber) {
          delete this.errors['cardNumber'];
        }
        break;
      case 'expiryDate':
        if (this.expiryDate && !this.paymentService.validateExpiryDate(this.expiryDate)) {
          this.errors['expiryDate'] = 'Date invalide (format MM/AA requis)';
        } else if (this.expiryDate) {
          delete this.errors['expiryDate'];
        }
        break;
      case 'cvv':
        if (this.cvv && !this.paymentService.validateCVV(this.cvv)) {
          this.errors['cvv'] = 'CVV invalide (3 ou 4 chiffres requis)';
        } else if (this.cvv) {
          delete this.errors['cvv'];
        }
        break;
      case 'cardName':
        if (this.cardName && this.cardName.trim().length < 2) {
          this.errors['cardName'] = 'Le nom doit contenir au moins 2 caractères';
        } else if (this.cardName) {
          delete this.errors['cardName'];
        }
        break;
      case 'email':
        if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
          this.errors['email'] = 'Format d\'email invalide';
        } else if (this.email) {
          delete this.errors['email'];
        }
        break;
    }
  }

  onSubmit(): void {
    if (!this.validateForm() || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    const paymentData: PaymentData = {
      amount: this.amount,
      taxes: this.taxes,
      total: this.total,
      paymentMethod: this.paymentMethod,
      cardNumber: this.cardNumber.replace(/\s/g, ''),
      expiryDate: this.expiryDate,
      cvv: this.cvv,
      cardName: this.cardName,
      email: this.email
    };

    this.paymentService.processPayment(paymentData).subscribe({
      next: (result) => {
        // Stocker le résultat pour la page de confirmation
        sessionStorage.setItem('paymentResult', JSON.stringify(result));
        this.router.navigate(['/payment/confirmation']);
      },
      error: (error) => {
        console.error('Payment error:', error);
        this.errors['general'] = 'Une erreur est survenue lors du paiement';
        this.isProcessing = false;
      }
    });
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-CA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}

