import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ContactInfo {
  title: string;
  numbers: Array<{
    label?: string;
    number: string;
    isPrimary?: boolean;
  }>;
}

@Component({
  selector: 'app-emergency-contacts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emergencyContacts.component.html',
  styleUrl: './emergencyContacts.component.scss',
})
export class EmergencyContactsComponent {
  contacts: ContactInfo[] = [
    {
      title: 'Police',
      numbers: [{ number: '9-1-1', isPrimary: true }],
    },
    {
      title: 'S.O.S. Violence Conjugale',
      numbers: [
        { number: '514-873-9010', isPrimary: true },
        { label: 'Toll-free', number: '1-800-363-9010' },
      ],
    },
    {
      title: 'Shield of Athena',
      numbers: [
        { label: 'Montreal', number: '514-274-8117', isPrimary: true },
        { label: 'Montreal toll-free', number: '1-877-274-8117' },
        { label: 'Laval', number: '450-688-6584' },
      ],
    },
    {
      title: 'Multilingual Sexual Violence Help Lines',
      numbers: [
        { label: 'Montreal', number: '514-270-2900' },
        { label: 'Laval', number: '450-688-2117' },
      ],
    },
  ];
}
