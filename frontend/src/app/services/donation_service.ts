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
  constructor(private http: HttpClient) {}

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
        amount: 50,
        title: "Package d'urgence",
        impactItems: [
          { icon: "food", text: "Repas chauds pour 2 jours complets" },
          { icon: "hygiene", text: "Kits d'hygiène essentiels" },
          { icon: "clothing", text: "Vêtements d'urgence" },
          { icon: "phone", text: "Ligne d'écoute 24/7 pour crises" },
          { icon: "medical", text: "Trousses de premiers soins" },
          { icon: "legal", text: "2h de consultation juridique" },
          { icon: "transport", text: "Transport vers refuge sécuritaire" },
          { icon: "info", text: "Ressources d'information et droits" }
        ]
      },
      {
        amount: 200,
        title: "Package de soutien",
        impactItems: [
          { icon: "psychology", text: "5h de soutien psychologique professionnel" },
          { icon: "therapy", text: "3 sessions de thérapie individuelle" },
          { icon: "group", text: "Groupes de soutien par les pairs (2 mois)" },
          { icon: "legal", text: "Accompagnement démarches administratives" },
          { icon: "social", text: "Suivi personnalisé (6 semaines)" },
          { icon: "workshop", text: "Ateliers développement compétences" },
          { icon: "education", text: "Formation professionnelle" },
          { icon: "job", text: "Aide recherche d'emploi" }
        ]
      },
      {
        amount: 350,
        title: "Package d'hébergement",
        impactItems: [
          { icon: "shelter", text: "Nuit complète refuge sécurisé (24h/24)" },
          { icon: "food", text: "3 repas nutritifs par jour" },
          { icon: "hygiene", text: "Produits hygiène et vêtements complets" },
          { icon: "bed", text: "Espace privé repos et récupération" },
          { icon: "security", text: "Planification de sécurité" },
          { icon: "house", text: "Soutien recherche logement permanent" },
          { icon: "specialist", text: "Consultations spécialistes (psychologue, avocat)" },
          { icon: "workshop", text: "Ateliers préparation vie autonome" },
          { icon: "children", text: "Ressources enfants (activités, école, garderie)" },
          { icon: "follow", text: "Suivi post-hébergement (3 mois)" }
        ]
      }
    ];
  }
}
