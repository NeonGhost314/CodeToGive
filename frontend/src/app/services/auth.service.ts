import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

const USER_ID_STORAGE_KEY = 'user_id';
const MOCK_USER_DATA_KEY = 'mock_user_data';

interface LoginResponse {
  message: string;
  user_id: number;
}

interface RegisterResponse {
  user_id: number;
}

interface MockUserData {
  email: string;
  password: string;
  first_name: string;
  user_id: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/auth';

  constructor(private http: HttpClient) {}

  /**
   * Login with email and password
   */
  login(email: string, password: string): Observable<{ user_id: number }> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, {
        email,
        password,
      })
      .pipe(
        map((response) => {
          if (response.user_id) {
            this.setUserId(response.user_id);
          }
          return { user_id: response.user_id };
        })
      );
  }

  /**
   * Register new account (MOCKED)
   */
  register(
    email: string,
    password: string,
    first_name: string
  ): Observable<{ user_id: number }> {
    // Mock implementation - simulate API call
    const mockUserId = Date.now(); // Generate unique ID based on timestamp

    // Store mock user data for password validation in settings
    const mockUserData: MockUserData = {
      email,
      password,
      first_name,
      user_id: mockUserId,
    };
    const existingUsers = this.getMockUsers();
    existingUsers.push(mockUserData);
    localStorage.setItem(MOCK_USER_DATA_KEY, JSON.stringify(existingUsers));

    // Simulate API delay
    return of({ user_id: mockUserId }).pipe(
      delay(300),
      map((response) => {
        this.setUserId(response.user_id);
        return response;
      })
    );
  }

  /**
   * Logout current user
   */
  logout(): void {
    localStorage.removeItem(USER_ID_STORAGE_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getUserId() !== null;
  }

  /**
   * Get current user ID from localStorage
   */
  getUserId(): number | null {
    const userId = localStorage.getItem(USER_ID_STORAGE_KEY);
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Set user ID in localStorage
   */
  private setUserId(userId: number): void {
    localStorage.setItem(USER_ID_STORAGE_KEY, userId.toString());
  }

  /**
   * Get mock user data (for password validation)
   */
  getMockUsers(): MockUserData[] {
    const data = localStorage.getItem(MOCK_USER_DATA_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Get mock user by ID
   */
  getMockUser(userId: number): MockUserData | undefined {
    const users = this.getMockUsers();
    return users.find((u) => u.user_id === userId);
  }
}

