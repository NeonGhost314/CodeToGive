import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Supporter {
  name: string;
  amount: number;
  date: string;
  avatar?: string;
}

@Component({
  selector: 'app-donation-supporters-wall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donation-supporters-wall.component.html',
  styleUrl: './donation-supporters-wall.component.scss'
})
export class DonationSupportersWallComponent {
  supporters: Supporter[] = [
    {
      name: 'Marie Dubois',
      amount: 200,
      date: 'Il y a 2 jours',
      avatar: undefined
    },
    {
      name: 'Jean Tremblay',
      amount: 350,
      date: 'Il y a 5 jours',
      avatar: undefined
    },
    {
      name: 'Sophie Martin',
      amount: 50,
      date: 'Il y a 1 semaine',
      avatar: undefined
    }
  ];

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-CA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  getInitials(name: string): string {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
}

