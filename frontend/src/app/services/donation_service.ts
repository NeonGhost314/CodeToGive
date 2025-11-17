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
  amount?: number;                 // Montant fixe (si défini, l'utilisateur ne peut pas le modifier)
  description?: string;            // Description courte (optionnelle)
  impactItems?: DonationImpactItem[];
  isCustom?: boolean;              // true pour option personnalisée
  fundId?: number;
  fixedAmount?: boolean;           // true si le montant est fixe (non modifiable)
  imageUrl?: string;               // URL de l'image pour la carte
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
    // Mock data pour développement frontend
    // TODO: Remplacer par l'appel HTTP réel quand le backend sera disponible
    return of([]);
    
    // Décommenter quand le backend sera prêt:
    // return this.http.get<DonationItemsBackend[]>(`/api/donation-items/${fundId}`).pipe(
    //   map(items => items.map(item => ({
    //     id: item.id,
    //     fundId: item.fund_id,
    //     description: item.description,
    //     suggestedAmount: item.suggested_amount,
    //     optionType: item.option_type
    //   })))
    // );
  }

  getDonationAmountOptions(): DonationAmountOption[] {
    return [
      {
        title: "Annual Art Auction",
        fundId: 1,
        imageUrl: "/assets/pictures/auction.png",
        description: "Your contribution directly supports our mission by funding critical programs and services. This event brings together artists, supporters, and community members to raise essential funds that enable us to provide emergency shelter, counseling services, legal assistance, and long-term support for survivors of domestic violence. Every dollar helps us maintain our 24/7 crisis hotline, offer safe housing options, and deliver comprehensive support services.",
        fixedAmount: false
      },
      {
        title: "Second Step Shelter",
        fundId: 2,
        imageUrl: "/assets/pictures/shelter.jpg",
        description: "Your donation provides immediate and long-term housing solutions for survivors of domestic violence. This program offers safe, confidential emergency shelter, transitional housing, and support services including case management, counseling, job training, and assistance with finding permanent housing. Your support ensures individuals and families have a safe place to stay while working towards independence and recovery.",
        fixedAmount: false
      },
      {
        title: "2025 Annual Lilac Gala Access",
        fundId: 3,
        amount: 425,
        imageUrl: "/assets/pictures/lilac_gala.png",
        description: "Join us for an unforgettable evening at the 2025 Annual Lilac Gala. Your $425 ticket includes access to an elegant dinner, live entertainment, silent and live auctions featuring unique items and experiences, and the opportunity to connect with fellow supporters. This exclusive event celebrates our community's commitment to ending domestic violence while raising critical funds that directly support our programs and services.",
        fixedAmount: true
      }
    ];
  }
}
