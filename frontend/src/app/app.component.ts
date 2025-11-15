import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';
import { Observable, catchError, of } from 'rxjs';

interface ApiResponse {
  message: string;
  error?: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  // Message that will come from Flask (as an Observable)
  message$!: Observable<ApiResponse>;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.message$ = this.apiService.getTestData().pipe(
      catchError(err => {
        // Handle error if backend is not running
        console.error(err);
        return of({ message: "Failed to connect to Flask backend. Did you run 'flask run'?", error: true });
      })
    );
  }
}
