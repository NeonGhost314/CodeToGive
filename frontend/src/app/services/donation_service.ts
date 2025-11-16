import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImpactFund {
  id: number;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private http: HttpClient) {}

  getImpactFunds(): Observable<ImpactFund[]> {
    return this.http.get<ImpactFund[]>('/api/impact-funds');
  }
}
