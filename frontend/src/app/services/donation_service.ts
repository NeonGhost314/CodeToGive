import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface FundStatistics {
  total_donors: number;
  total_amount_raised: number;
  average_donation: number;
  recent_donations_count: number;
}

export interface OptionStatistics {
  donors_count: number;
  total_raised_for_this_option: number;
  popularity_rank: number;
}

export interface ImpactFund {
  id: number;
  name: string;
  description?: string;
  statistics?: FundStatistics;
}

export interface DonationOptions {
  id: number;
  fundId: number;
  description: string;
  suggestedAmount: number;
  optionType: string;
  statistics?: OptionStatistics;
}


interface DonationOptionsBackend {
  id: number;
  fund_id: number;
  description: string;
  suggested_amount: number;
  option_type: string;
  statistics?: {
    donors_count: number;
    total_raised_for_this_option: number;
    popularity_rank: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private http: HttpClient) {}

  getImpactFunds(): Observable<ImpactFund[]> {
    return this.http.get<ImpactFund[]>('/api/impact-funds');
  }

  
  getDonationOptions(fundId: number): Observable<DonationOptions[]> {
    return this.http.get<DonationOptionsBackend[]>(`/api/donation-options/${fundId}`).pipe(
      map(options => options.map(option => ({
        id: option.id,
        fundId: option.fund_id,
        description: option.description,
        suggestedAmount: option.suggested_amount,
        optionType: option.option_type,
        statistics: option.statistics ? {
          donors_count: option.statistics.donors_count,
          total_raised_for_this_option: option.statistics.total_raised_for_this_option,
          popularity_rank: option.statistics.popularity_rank
        } : undefined
      })))
    );
  } 
}
