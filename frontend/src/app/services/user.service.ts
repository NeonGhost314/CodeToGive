import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface User {
  id: number;
  mail: string;
  first_name: string;
  last_name: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
}

export interface UpdatePasswordResponse {
  success: boolean;
  message?: string;
}

export interface Donation {
  id: number;
  amount: number;
  state: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = '/users';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Get user profile
   */
  getUser(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update user profile (MOCKED)
   */
  updateProfile(
    userId: number,
    first_name: string
  ): Observable<UpdateProfileResponse> {
    // Mock implementation - simulate API call
    return of({ success: true }).pipe(
      delay(300),
      map(() => {
        // Update mock user data if exists
        const mockUsers = this.authService.getMockUsers();
        const userIndex = mockUsers.findIndex((u) => u.user_id === userId);
        if (userIndex !== -1) {
          mockUsers[userIndex].first_name = first_name;
          localStorage.setItem(
            'mock_user_data',
            JSON.stringify(mockUsers)
          );
        }
        return { success: true };
      })
    );
  }

  /**
   * Update user password (MOCKED)
   */
  updatePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Observable<UpdatePasswordResponse> {
    // Mock implementation - simulate API call
    return of(null).pipe(
      delay(300),
      map(() => {
        // Check if password matches in mock data
        const mockUser = this.authService.getMockUser(userId);
        
        if (!mockUser) {
          // For real API users, we can't validate current password
          // In a real implementation, this would be done by the backend
          return { success: true };
        }

        // Validate current password
        if (mockUser.password !== currentPassword) {
          return {
            success: false,
            message: 'Current password is incorrect',
          };
        }

        // Update password in mock data
        const mockUsers = this.authService.getMockUsers();
        const userIndex = mockUsers.findIndex((u) => u.user_id === userId);
        if (userIndex !== -1) {
          mockUsers[userIndex].password = newPassword;
          localStorage.setItem(
            'mock_user_data',
            JSON.stringify(mockUsers)
          );
        }

        return { success: true };
      })
    );
  }

  /**
   * Get user donations
   */
  getUserDonations(userId: number): Observable<Donation[]> {
    return this.http.get<Donation[]>(`/donations/user/${userId}`);
  }
}

