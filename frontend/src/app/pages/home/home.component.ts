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
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss' // Vous devrez créer ce fichier vide ou le laisser à vous de voir
})
export class HomeComponent implements OnInit {
  // Déplacez la logique de l'API ici
  message$!: Observable<ApiResponse>;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    // Initialise le test d'API (gardé pour l'instant, mais vous pouvez le retirer si vous ne voulez pas le voir dans la console)
    this.message$ = this.apiService.getTestData().pipe(
      catchError(err => {
        console.error(err);
        return of({ message: "Failed to connect to Flask backend.", error: true });
      })
    );
  }

  navigateToDonation(): void {
    this.router.navigate(['/donation']);
  }

  navigateToVideo(): void {
    this.router.navigate(['/video']);
  }
}


