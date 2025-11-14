import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // API URL goes through proxy, so we use a relative path
  // This actually calls http://127.0.0.1:5000/api/test
  private apiUrl = '/api/test';

  constructor(private http: HttpClient) { }

  /**
   * Gets test message from Flask backend
   */
  getTestData(): Observable<{message: string}> {
    return this.http.get<{message: string}>(this.apiUrl);
  }
}
