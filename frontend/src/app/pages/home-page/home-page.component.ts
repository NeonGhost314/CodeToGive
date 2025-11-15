import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Observable, catchError, of } from 'rxjs';

interface ApiResponse {
  message: string;
  error?: boolean;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  // Message that will come from Flask (as an Observable)
  message$!: Observable<ApiResponse>;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.message$ = this.apiService.getTestData().pipe(
      catchError(err => {
        // Handle error if backend is not running
        console.error(err);
        return of({ message: "Failed to connect to Flask backend. Did you run 'flask run'?", error: true });
      })
    );
  }

  navigateToImpactFunds(): void {
    this.router.navigateByUrl('/impact-funds');
  }
}

