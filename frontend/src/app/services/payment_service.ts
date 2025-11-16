import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

export interface PaymentData {
  amount: number;
  taxes: number;
  total: number;
  paymentMethod: 'visa' | 'mastercard';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  email: string;
  billingAddress?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  email: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly TAX_RATE = 0.15; // 15% TPS+TVQ

  /**
   * Calcule les taxes (15%) et le total
   */
  calculateTaxes(amount: number): { taxes: number; total: number } {
    const taxes = amount * this.TAX_RATE;
    const total = amount + taxes;
    return {
      taxes: Math.round(taxes * 100) / 100,
      total: Math.round(total * 100) / 100
    };
  }

  /**
   * Simule le traitement d'un paiement
   * Retourne un Observable qui se résout après 2-3 secondes
   */
  processPayment(paymentData: PaymentData): Observable<PaymentResult> {
    // Simulation d'un délai de 2-3 secondes
    const delayMs = 2000 + Math.random() * 1000; // Entre 2000 et 3000ms
    
    const result: PaymentResult = {
      success: true,
      transactionId: this.generateTransactionId(),
      email: paymentData.email,
      message: 'Transaction réussie !'
    };

    return of(result).pipe(delay(delayMs));
  }

  /**
   * Génère un ID de transaction mock
   */
  private generateTransactionId(): string {
    return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  /**
   * Valide le numéro de carte (format basique)
   */
  validateCardNumber(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\s/g, '');
    return /^\d{13,19}$/.test(cleaned);
  }

  /**
   * Valide la date d'expiration (MM/YY)
   */
  validateExpiryDate(expiryDate: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) {
      return false;
    }
    
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const now = new Date();
    
    return expiry > now;
  }

  /**
   * Valide le CVV
   */
  validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }
}

