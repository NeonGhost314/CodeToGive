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

    // Vérifier si on doit éviter les données par défaut (inscription post-donation)
    const skipDefaultData = sessionStorage.getItem('skipDefaultData') === 'true';
    let recentDonations: Donation[] = [];
    let totalDonations = 0;
    
    if (skipDefaultData) {
      // Pour une inscription post-donation, créer seulement la donation récente
      const donorInfo = this.authService.getDonorInfo();
      console.log('Post-donation signup detected. Donor info:', donorInfo); // Debug log
      if (donorInfo) {
        const recentDonation = {
          id: Date.now(), // ID unique basé sur le timestamp
          amount: donorInfo.donationAmount,
          date: new Date().toISOString(),
          fund_name: donorInfo.fundName,
          status: 'completed' as const
        };
        recentDonations = [recentDonation];
        totalDonations = donorInfo.donationAmount;
        console.log('Created recent donation:', recentDonation); // Debug log
      } else {
        recentDonations = [];
        totalDonations = 0;
        console.log('No donor info found, empty donations'); // Debug log
      }
    } else {
      recentDonations = this.mockDonations.slice(0, 5);
      totalDonations = this.mockDonations.reduce((sum, d) => sum + d.amount, 0);
    }
    
    const data: DashboardData = {
      user: user,
      total_donations: totalDonations,
      recent_donations: recentDonations,
      subscriptions: skipDefaultData ? [] : this.mockSubscriptions,
      goals: skipDefaultData ? [] : this.mockGoals
    };

    // Ne pas nettoyer le flag ici car d'autres méthodes peuvent en avoir besoin

    return of(data).pipe(delay(300));
  }

  getDonationHistory(userId: number): Observable<Donation[]> {
    // Mock: Return array of sample donations
    // In Phase 2, this will make an HTTP call to /api/dashboard/{userId}/donations
    const skipDefaultData = sessionStorage.getItem('skipDefaultData') === 'true';
    
    if (skipDefaultData) {
      // Pour une inscription post-donation, créer seulement la donation récente
      const donorInfo = this.authService.getDonorInfo();
      console.log('getDonationHistory - Post-donation signup detected. Donor info:', donorInfo); // Debug log
      if (donorInfo) {
        const recentDonation = {
          id: Date.now(), // ID unique basé sur le timestamp
          amount: donorInfo.donationAmount,
          date: new Date().toISOString(),
          fund_name: donorInfo.fundName,
          status: 'completed' as const
        };
        console.log('getDonationHistory - Created recent donation:', recentDonation); // Debug log
        return of([recentDonation]).pipe(delay(200));
      }
      console.log('getDonationHistory - No donor info found, empty donations'); // Debug log
      return of([]).pipe(delay(200));
    }
    
    return of([...this.mockDonations]).pipe(delay(200));
  }

  getSubscriptions(userId: number): Observable<Subscription[]> {
    // Mock: Return array of sample subscriptions
    // In Phase 2, this will make an HTTP call to /api/dashboard/{userId}/subscriptions
    const skipDefaultData = sessionStorage.getItem('skipDefaultData') === 'true';
    return of(skipDefaultData ? [] : [...this.mockSubscriptions]).pipe(delay(200));
  }

  updateSubscription(userId: number, subscriptionId: number, data: Partial<Subscription>): Observable<Subscription> {
    // Mock: Update subscription in local array
    // In Phase 2, this will make an HTTP PUT call to /api/dashboard/{userId}/subscriptions/{subscriptionId}
    const index = this.mockSubscriptions.findIndex(s => s.id === subscriptionId);
    if (index !== -1) {
      this.mockSubscriptions[index] = { ...this.mockSubscriptions[index], ...data };
      return of({ ...this.mockSubscriptions[index] }).pipe(delay(300));
    }
    throw new Error('Subscription not found');
  }

  getPersonalGoals(userId: number): Observable<PersonalGoal[]> {
    // Mock: Return array of sample goals
    // In Phase 2, this will make an HTTP call to /api/dashboard/{userId}/goals
    const skipDefaultData = sessionStorage.getItem('skipDefaultData') === 'true';
    return of(skipDefaultData ? [] : [...this.mockGoals]).pipe(delay(200));
  }

  createPersonalGoal(userId: number, goal: CreateGoalData): Observable<PersonalGoal> {
    // Mock: Create new goal and add to local array
    // In Phase 2, this will make an HTTP POST call to /api/dashboard/{userId}/goals
    const newGoal: PersonalGoal = {
      id: this.nextGoalId++,
      name: goal.name,
      target_amount: goal.target_amount,
      current_amount: 0,
      deadline: goal.deadline,
      created_at: new Date().toISOString()
    };
    this.mockGoals.push(newGoal);
    return of({ ...newGoal }).pipe(delay(300));
  }

  updatePersonalGoal(userId: number, goalId: number, goal: Partial<PersonalGoal>): Observable<PersonalGoal> {
    // Mock: Update goal in local array
    // In Phase 2, this will make an HTTP PUT call to /api/dashboard/{userId}/goals/{goalId}
    const index = this.mockGoals.findIndex(g => g.id === goalId);
    if (index !== -1) {
      this.mockGoals[index] = { ...this.mockGoals[index], ...goal };
      return of({ ...this.mockGoals[index] }).pipe(delay(300));
    }
    throw new Error('Goal not found');
  }

  deletePersonalGoal(userId: number, goalId: number): Observable<void> {
    // Mock: Remove goal from local array
    // In Phase 2, this will make an HTTP DELETE call to /api/dashboard/{userId}/goals/{goalId}
    const index = this.mockGoals.findIndex(g => g.id === goalId);
    if (index !== -1) {
      this.mockGoals.splice(index, 1);
      return of(void 0).pipe(delay(300));
    }
    throw new Error('Goal not found');
  }
}

