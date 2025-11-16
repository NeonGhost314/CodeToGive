import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactCardEffectService } from '../../services/contact-card-effect/contact-card-effect.service';

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
export class EmergencyContactsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('effectCanvas1', { static: false })
  effectCanvas1!: ElementRef<HTMLDivElement>;
  @ViewChild('effectCanvas2', { static: false })
  effectCanvas2!: ElementRef<HTMLDivElement>;
  @ViewChild('effectCanvas3', { static: false })
  effectCanvas3!: ElementRef<HTMLDivElement>;
  @ViewChild('effectCanvas4', { static: false })
  effectCanvas4!: ElementRef<HTMLDivElement>;

  private effectServices: ContactCardEffectService[] = [];
  private hoveredIndex = -1;

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      const canvases = [
        this.effectCanvas1,
        this.effectCanvas2,
        this.effectCanvas3,
        this.effectCanvas4,
      ];

      canvases.forEach((canvas, index) => {
        if (canvas) {
          const service = new ContactCardEffectService();
          service.init(canvas.nativeElement);
          this.effectServices[index] = service;
        }
      });
    }, 100);
  }

  ngOnDestroy(): void {
    this.effectServices.forEach((service) => service.dispose());
  }

  onCardMouseEnter(index: number): void {
    this.hoveredIndex = index;
    if (this.effectServices[index]) {
      this.effectServices[index].onMouseEnter();
    }
  }

  onCardMouseLeave(index: number): void {
    this.hoveredIndex = -1;
    if (this.effectServices[index]) {
      this.effectServices[index].onMouseLeave();
    }
  }
}
