import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ImpactFund {
  id: number;
  name: string;
  description?: string;
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
    return this.http.get<ImpactFund[]>('/api/impact-funds');
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
}
