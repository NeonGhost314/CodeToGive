import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

export interface ImpactFund {
  id: number;
  name: string;
  description?: string;
  photoUrl?: string;               // Photo de l'organisation (pour site interne)
  // Note: Pas de badges ou références externes pour site interne
}

export interface DonationImpactItem {
  icon: string;                    // Nom de l'icône (ex: "food", "medical", "shelter")
  text: string;                    // Texte descriptif court
}

export interface DonationAmountOption {
  title?: string;
  amount?: number;
  description?: string;            // Description courte (optionnelle)
  impactItems?: DonationImpactItem[];
  isCustom?: boolean;              // true pour option personnalisée
  fundId?: number;
}

export interface DonationItems {
  id: number;
  fundId: number;
  description: string;
  suggestedAmount: number;
  optionType: string;
}

export interface DonationFormData {
  fundId: number;
  amount: number;
  type: 'one-time' | 'monthly' | 'quarterly' | 'yearly';
  message?: string;
  fundName?: string;
  recurringPeriod?: 'monthly' | 'quarterly' | 'yearly';
}


interface DonationItemsBackend {
  id: number;
  fund_id: number;
  description: string;
  suggested_amount: number;
  option_type: string;
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private pendingDonationData: DonationFormData | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Stocke temporairement les données de don pour la page de paiement
   */
  setPendingDonationData(data: DonationFormData): void {
    this.pendingDonationData = data;
  }

  /**
   * Récupère les données de don stockées temporairement
   */
  getPendingDonationData(): DonationFormData | null {
    return this.pendingDonationData;
  }

  /**
   * Efface les données de don stockées temporairement
   */
  clearPendingDonationData(): void {
    this.pendingDonationData = null;
  }

  getImpactFunds(): Observable<ImpactFund[]> {
    // Mock data pour développement frontend (site interne)
    const mockFunds: ImpactFund[] = [
      {
        id: 1,
        name: "LE BOUCLIER D'ATHENA / THE SHIELD OF ATHENA",
        description: "Services familiaux pour personnes en situation de violence",
        photoUrl: undefined  // Photo à ajouter via l'interface
      }
    ];
    
    // Pour le développement: retourner les données mock
    // TODO: Remplacer par l'appel HTTP réel quand le backend sera disponible
    return of(mockFunds);
    
    // Décommenter quand le backend sera prêt:
    // return this.http.get<ImpactFund[]>('/api/impact-funds');
  }

  
  getDonationItems(fundId: number): Observable<DonationItems[]> {
    return this.http.get<DonationItemsBackend[]>(`/api/donation-items/${fundId}`).pipe(
      map(items => items.map(item => ({
        id: item.id,
        fundId: item.fund_id,
        description: item.description,
        suggestedAmount: item.suggested_amount,
        optionType: item.option_type
      })))
    );
  }

  getDonationAmountOptions(): DonationAmountOption[] {
    return [
      {
        title: "Emergency Fund",
        fundId: 1,
        description: "Provide immediate safety and emergency support"
      },
      {
        title: "Support Fund",
        fundId: 2,
        description: "Support healing and recovery in the medium term"
      },
      {
        title: "Accommodation Fund",
        fundId: 3,
        description: "Build long-term autonomy and stability"
      }
    ];
  }
}
