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
  amount: number;                  // 50, 200, 350
  title: string;                   // Ex: "Package d'urgence", "Package de soutien", etc.
  description?: string;            // Description courte (optionnelle)
  impactItems: DonationImpactItem[]; // Liste d'items avec icônes
  isCustom?: boolean;              // true pour option personnalisée
}

export interface DonationOptions {
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
  endDate?: string; // ISO date string
  hasEndDate?: boolean;
}


interface DonationOptionsBackend {
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

  
  getDonationOptions(fundId: number): Observable<DonationOptions[]> {
    return this.http.get<DonationOptionsBackend[]>(`/api/donation-options/${fundId}`).pipe(
      map(options => options.map(option => ({
        id: option.id,
        fundId: option.fund_id,
        description: option.description,
        suggestedAmount: option.suggested_amount,
        optionType: option.option_type
      })))
    );
  }

  // Mock data pour options de montant avec packages
  getDonationAmountOptions(): DonationAmountOption[] {
    return [
      {
        amount: 25,
        title: "Emergency Package",
        impactItems: [
          { icon: "food", text: "Hot meals for 2 full days" },
          { icon: "hygiene", text: "Essential hygiene kits" },
          { icon: "clothing", text: "Emergency clothing" },
          { icon: "phone", text: "24/7 crisis hotline access" },
          { icon: "medical", text: "First aid kits" },
          { icon: "legal", text: "2 hours of legal consultation" },
          { icon: "transport", text: "Transport to safe shelter" },
          { icon: "info", text: "Information resources and rights" }
        ]
      },
      {
        amount: 75,
        title: "Support Package",
        impactItems: [
          { icon: "psychology", text: "5 hours of professional psychological support" },
          { icon: "therapy", text: "3 individual therapy sessions" },
          { icon: "group", text: "Peer support groups (2 months)" },
          { icon: "legal", text: "Administrative process assistance" },
          { icon: "social", text: "Personalized follow-up (6 weeks)" },
          { icon: "workshop", text: "Skills development workshops" },
          { icon: "education", text: "Professional training" },
          { icon: "job", text: "Job search assistance" }
        ]
      },
      {
        amount: 350,
        title: "Accommodation Package",
        impactItems: [
          { icon: "shelter", text: "Full night in secure shelter (24/7)" },
          { icon: "food", text: "3 nutritious meals per day" },
          { icon: "hygiene", text: "Hygiene products and complete clothing" },
          { icon: "bed", text: "Private space for rest and recovery" },
          { icon: "security", text: "Safety planning" },
          { icon: "house", text: "Support finding permanent housing" },
          { icon: "specialist", text: "Specialist consultations (psychologist, lawyer)" },
          { icon: "workshop", text: "Workshops preparing for independent living" },
          { icon: "children", text: "Children's resources (activities, school, daycare)" },
          { icon: "follow", text: "Post-shelter follow-up (3 months)" }
        ]
      }
    ];
  }
}
