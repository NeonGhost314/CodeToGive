export interface DashboardData {
  user: User;
  total_donations: number;
  recent_donations: Donation[];
  subscriptions: Subscription[];
  goals: PersonalGoal[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Donation {
  id: number;
  amount: number;
  date: string;
  fund_name: string;
  status: string;
}

export interface Subscription {
  id: number;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
  fund_name: string;
  status: 'active' | 'paused' | 'cancelled';
  next_payment_date: string;
}

export interface PersonalGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  created_at: string;
}

export interface CreateGoalData {
  name: string;
  target_amount: number;
  deadline?: string;
}

