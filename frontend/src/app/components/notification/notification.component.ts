import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

export type NotificationType = 'success' | 'error';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  @Input() type: NotificationType = 'success';
  @Input() message: string = '';
  @Input() duration: number = 5000; // Auto-close after 5 seconds
  @Input() autoClose: boolean = true;
  @Output() closed = new EventEmitter<void>();

  isVisible: boolean = true;
  private timeoutId?: number;

  ngOnInit() {
    if (this.autoClose && this.duration > 0) {
      this.timeoutId = window.setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  close() {
    this.isVisible = false;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    // Emit after a small delay to allow animation to complete
    setTimeout(() => {
      this.closed.emit();
    }, 300);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
