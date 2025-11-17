import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_ID_KEY = 'user_id';
  private readonly USER_DATA_KEY = 'user_data';

  login(email: string, password: string): Observable<AuthResponse> {
    const response: AuthResponse = {
      message: 'Login successful',
      user_id: 1
    };
    sessionStorage.setItem(this.USER_ID_KEY, '1');
    return of(response).pipe(delay(500));
  }

  signup(firstName: string, lastName: string, email: string, password: string): Observable<AuthResponse> {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Stocker les infos utilisateur
    sessionStorage.setItem(this.USER_DATA_KEY, JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      email: email
    }));

    const response: AuthResponse = {
      message: 'Signup successful',
      user_id: 1
    };
    sessionStorage.setItem(this.USER_ID_KEY, '1');
    return of(response).pipe(delay(500));
  }

  logout(): void {
    sessionStorage.removeItem(this.USER_ID_KEY);
    sessionStorage.removeItem(this.USER_DATA_KEY);
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(this.USER_ID_KEY);
  }

  getCurrentUserId(): number | null {
    const id = sessionStorage.getItem(this.USER_ID_KEY);
    return id ? parseInt(id, 10) : null;
  }

  getUserData(): { first_name: string; last_name: string; email: string } | null {
    const data = sessionStorage.getItem(this.USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  }

  setUserId(userId: number): void {
    sessionStorage.setItem(this.USER_ID_KEY, userId.toString());
  }
}

