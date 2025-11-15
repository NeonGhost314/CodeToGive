import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImpactFund } from '../../services/donation_service';

@Component({
  selector: 'app-fund-detail-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fund-detail-modal.component.html',
  styleUrl: './fund-detail-modal.component.scss',
})
export class FundDetailModalComponent {
  @Input() fund!: ImpactFund;
  @Input() showAsPanel: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() donate = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onDonate(): void {
    this.donate.emit();
  }
}

