import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { DashboardData, Donation, Subscription, PersonalGoal, CreateGoalData, User } from '../models/dashboard.model';
import { AuthService } from './auth.service';

const MOCK_DONATIONS: Donation[] = [
  {
    id: 1,
    amount: 50,
    date: '2024-01-15T10:30:00Z',
    fund_name: 'Emergency Fund',
    status: 'completed'
  },
  {
    id: 2,
    amount: 100,
    date: '2024-01-10T14:20:00Z',
    fund_name: 'Support Fund',
    status: 'completed'
  },
  {
    id: 3,
    amount: 25,
    date: '2024-01-05T09:15:00Z',
    fund_name: 'Accommodation Fund',
    status: 'completed'
  },
  {
    id: 4,
    amount: 75,
    date: '2023-12-28T16:45:00Z',
    fund_name: 'Emergency Fund',
    status: 'completed'
  },
  {
    id: 5,
    amount: 200,
    date: '2023-12-20T11:00:00Z',
    fund_name: 'Support Fund',
    status: 'completed'
  }
];

const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 1,
    amount: 50,
    frequency: 'monthly',
    fund_name: 'Emergency Fund',
    status: 'active',
    next_payment_date: '2024-02-15T00:00:00Z'
  },
  {
    id: 2,
    amount: 100,
    frequency: 'quarterly',
    fund_name: 'Support Fund',
    status: 'active',
    next_payment_date: '2024-04-01T00:00:00Z'
  }
];

const MOCK_GOALS: PersonalGoal[] = [
  {
    id: 1,
    name: 'Annual Giving Goal',
    target_amount: 1000,
    current_amount: 450,
    deadline: '2024-12-31T00:00:00Z',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Emergency Support',
    target_amount: 500,
    current_amount: 125,
    deadline: '2024-06-30T00:00:00Z',
    created_at: '2024-01-15T00:00:00Z'
  }
];

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private mockDonations = [...MOCK_DONATIONS];
  private mockSubscriptions = [...MOCK_SUBSCRIPTIONS];
  private mockGoals = [...MOCK_GOALS];
  private nextGoalId = 3;

  constructor(private authService: AuthService) {}

  // Méthodes pour gérer la persistance de l'état utilisateur
  private getUserPersistedState(userId: number): { 
    donations: Donation[]; 
    totalAmount: number;
    subscriptions: Subscription[];
    goals: PersonalGoal[];
    isPostDonationUser: boolean;
    hasPersistedData: boolean;
  } {
    const key = `userState_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    return { 
      donations: [],
      totalAmount: 0,
      subscriptions: [],
      goals: [],
      isPostDonationUser: false,
      hasPersistedData: false
    };
  }

  private setUserPersistedState(userId: number, state: {
    donations: Donation[];
    totalAmount: number;
    subscriptions: Subscription[];
    goals: PersonalGoal[];
    isPostDonationUser: boolean;
  }): void {
    const key = `userState_${userId}`;
    const persistedState = {
      ...state,
      hasPersistedData: true,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(persistedState));
  }

  private clearUserPersistedState(userId: number): void {
    const key = `userState_${userId}`;
    localStorage.removeItem(key);
  }

  getDashboardData(userId: number): Observable<DashboardData> {
    const userData = this.authService.getUserData();
    const user: User = userData ? {
      id: userId,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email
    } : {
      id: userId,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com'
    };

    // Vérifier s'il y a des informations de donateur (inscription ou connexion post-donation)
    const skipDefaultData = sessionStorage.getItem('skipDefaultData') === 'true';
    const donorInfo = this.authService.getDonorInfo();
    const persistedState = this.getUserPersistedState(userId);
    console.log('Dashboard loading - skipDefaultData:', skipDefaultData, 'donorInfo:', donorInfo, 'persistedState:', persistedState); // Debug log
    let recentDonations: Donation[] = [];
    let totalDonations = 0;
    let subscriptions: Subscription[] = [];
    let goals: PersonalGoal[] = [];
    
    if (donorInfo) {
      // Créer la nouvelle donation à partir des informations du donateur
      const newDonation = {
        id: Date.now(), // ID unique basé sur le timestamp
        amount: donorInfo.donationAmount,
        date: new Date().toISOString(),
        fund_name: donorInfo.fundName,
        status: 'completed' as const
      };
      console.log('Created new donation:', newDonation); // Debug log
      
      if (skipDefaultData) {
        // Pour une inscription post-donation, créer seulement la donation récente
        recentDonations = [newDonation];
        totalDonations = donorInfo.donationAmount;
        subscriptions = [];
        goals = [];
        console.log('Signup mode: only new donation'); // Debug log
        
        // Sauvegarder l'état d'inscription post-donation
        this.setUserPersistedState(userId, {
          donations: [newDonation],
          totalAmount: donorInfo.donationAmount,
          subscriptions: [],
          goals: [],
          isPostDonationUser: true
        });
      } else {
        // Pour une connexion post-donation, ajouter la nouvelle donation en haut de la liste existante
        const existingDonations = persistedState.hasPersistedData ? persistedState.donations : this.mockDonations;
        const existingSubscriptions = persistedState.hasPersistedData ? persistedState.subscriptions : this.mockSubscriptions;
        const existingGoals = persistedState.hasPersistedData ? persistedState.goals : this.mockGoals;
        const existingTotal = persistedState.hasPersistedData ? persistedState.totalAmount : this.mockDonations.reduce((sum, d) => sum + d.amount, 0);
        
        const allDonations = [newDonation, ...existingDonations];
        recentDonations = allDonations.slice(0, 5);
        totalDonations = existingTotal + donorInfo.donationAmount;
        subscriptions = existingSubscriptions;
        goals = existingGoals;
        console.log('Login mode: added new donation to existing state'); // Debug log
        
        // Sauvegarder l'état complet mis à jour
        this.setUserPersistedState(userId, {
          donations: allDonations,
          totalAmount: totalDonations,
          subscriptions: subscriptions,
          goals: goals,
          isPostDonationUser: false // Plus considéré comme post-donation après connexion
        });
      }
    } else if (persistedState.hasPersistedData) {
      // L'utilisateur revient - restaurer l'état sauvegardé
      recentDonations = persistedState.donations.slice(0, 5);
      totalDonations = persistedState.totalAmount;
      subscriptions = persistedState.subscriptions;
      goals = persistedState.goals;
      console.log('Restored persisted user state'); // Debug log
    } else {
      // Nouvel utilisateur ou pas d'état sauvegardé, utiliser les données normales
      recentDonations = this.mockDonations.slice(0, 5);
      totalDonations = this.mockDonations.reduce((sum, d) => sum + d.amount, 0);
      subscriptions = this.mockSubscriptions;
      goals = this.mockGoals;
      console.log('Normal mode: using mock data'); // Debug log
    }
    
    const data: DashboardData = {
      user: user,
      total_donations: totalDonations,
      recent_donations: recentDonations,
      subscriptions: subscriptions,
      goals: goals
    };

    // Ne pas nettoyer le flag ici car d'autres méthodes peuvent en avoir besoin

    return of(data).pipe(delay(300));
  }

  getDonationHistory(userId: number): Observable<Donation[]> {
    // Mock: Return array of sample donations
    // In Phase 2, this will make an HTTP call to /api/dashboard/{userId}/donations
    const persistedState = this.getUserPersistedState(userId);
    console.log('getDonationHistory - persistedState:', persistedState); // Debug log
    
    if (persistedState.hasPersistedData) {
      // L'utilisateur a un état sauvegardé - retourner ses donations
      return of([...persistedState.donations]).pipe(delay(200));
    }
    
    // Utilisateur normal - retourner les donations mock
    return of([...this.mockDonations]).pipe(delay(200));
  }

  getSubscriptions(userId: number): Observable<Subscription[]> {
    // Mock: Return array of sample subscriptions
    // In Phase 2, this will make an HTTP call to /api/dashboard/{userId}/subscriptions
    const persistedState = this.getUserPersistedState(userId);
    
    if (persistedState.hasPersistedData) {
      // L'utilisateur a un état sauvegardé - retourner ses abonnements
      return of([...persistedState.subscriptions]).pipe(delay(200));
    }
    
    // Utilisateur normal - retourner les abonnements mock
    return of([...this.mockSubscriptions]).pipe(delay(200));
  }

  updateSubscription(userId: number, subscriptionId: number, data: Partial<Subscription>): Observable<Subscription> {
    // Mock: Update subscription in local array and persisted state
    // In Phase 2, this will make an HTTP PUT call to /api/dashboard/{userId}/subscriptions/{subscriptionId}
    const persistedState = this.getUserPersistedState(userId);
    
    if (persistedState.hasPersistedData) {
      // Mettre à jour dans l'état persistant
      const index = persistedState.subscriptions.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        persistedState.subscriptions[index] = { ...persistedState.subscriptions[index], ...data };
        this.setUserPersistedState(userId, persistedState);
        return of({ ...persistedState.subscriptions[index] }).pipe(delay(300));
      }
    } else {
      // Mettre à jour dans les données mock
      const index = this.mockSubscriptions.findIndex(s => s.id === subscriptionId);
      if (index !== -1) {
        this.mockSubscriptions[index] = { ...this.mockSubscriptions[index], ...data };
        return of({ ...this.mockSubscriptions[index] }).pipe(delay(300));
      }
    }
    throw new Error('Subscription not found');
  }

  getPersonalGoals(userId: number): Observable<PersonalGoal[]> {
    // Mock: Return array of sample goals
    // In Phase 2, this will make an HTTP call to /api/dashboard/{userId}/goals
    const persistedState = this.getUserPersistedState(userId);
    
    if (persistedState.hasPersistedData) {
      // L'utilisateur a un état sauvegardé - retourner ses objectifs
      return of([...persistedState.goals]).pipe(delay(200));
    }
    
    // Utilisateur normal - retourner les objectifs mock
    return of([...this.mockGoals]).pipe(delay(200));
  }

  createPersonalGoal(userId: number, goal: CreateGoalData): Observable<PersonalGoal> {
    // Mock: Create new goal and add to local array or persisted state
    // In Phase 2, this will make an HTTP POST call to /api/dashboard/{userId}/goals
    const newGoal: PersonalGoal = {
      id: this.nextGoalId++,
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: 0,
      deadline: goal.deadline,
      created_at: new Date().toISOString()
    };
    
    const persistedState = this.getUserPersistedState(userId);
    if (persistedState.hasPersistedData) {
      // Ajouter à l'état persistant
      persistedState.goals.push(newGoal);
      this.setUserPersistedState(userId, persistedState);
    } else {
      // Ajouter aux données mock
      this.mockGoals.push(newGoal);
    }
    
    return of({ ...newGoal }).pipe(delay(300));
  }

  updatePersonalGoal(userId: number, goalId: number, goal: Partial<PersonalGoal>): Observable<PersonalGoal> {
    // Mock: Update goal in local array or persisted state
    // In Phase 2, this will make an HTTP PUT call to /api/dashboard/{userId}/goals/{goalId}
    const persistedState = this.getUserPersistedState(userId);
    
    if (persistedState.hasPersistedData) {
      // Mettre à jour dans l'état persistant
      const index = persistedState.goals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        persistedState.goals[index] = { ...persistedState.goals[index], ...goal };
        this.setUserPersistedState(userId, persistedState);
        return of({ ...persistedState.goals[index] }).pipe(delay(300));
      }
    } else {
      // Mettre à jour dans les données mock
      const index = this.mockGoals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        this.mockGoals[index] = { ...this.mockGoals[index], ...goal };
        return of({ ...this.mockGoals[index] }).pipe(delay(300));
      }
    }
    throw new Error('Goal not found');
  }

  deletePersonalGoal(userId: number, goalId: number): Observable<void> {
    // Mock: Remove goal from local array or persisted state
    // In Phase 2, this will make an HTTP DELETE call to /api/dashboard/{userId}/goals/{goalId}
    const persistedState = this.getUserPersistedState(userId);
    
    if (persistedState.hasPersistedData) {
      // Supprimer de l'état persistant
      const index = persistedState.goals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        persistedState.goals.splice(index, 1);
        this.setUserPersistedState(userId, persistedState);
        return of(void 0).pipe(delay(300));
      }
    } else {
      // Supprimer des données mock
      const index = this.mockGoals.findIndex(g => g.id === goalId);
      if (index !== -1) {
        this.mockGoals.splice(index, 1);
        return of(void 0).pipe(delay(300));
      }
    }
    throw new Error('Goal not found');
  }
}

