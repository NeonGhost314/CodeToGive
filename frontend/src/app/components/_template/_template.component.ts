/**
 * Template Component
 * 
 * To use this template:
 * 1. Copy this entire folder and rename it to your component name
 * 2. Replace 'Template' with your component name throughout
 * 3. Replace 'template' with your component name (lowercase) throughout
 * 4. Update the selector in @Component decorator
 * 5. Implement your component logic
 */

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.component.html',
  styleUrl: './template.component.scss'
})
export class TemplateComponent implements OnInit {
  // Input properties - data passed from parent component
  @Input() title: string = '';
  @Input() data: any = null;

  // Output events - events emitted to parent component
  @Output() actionEvent = new EventEmitter<any>();

  // Component properties
  isLoading: boolean = false;
  error: string | null = null;

  constructor() { }

  ngOnInit(): void {
    // Initialize component
    this.initializeComponent();
  }

  /**
   * Initialize component data
   */
  private initializeComponent(): void {
    // TODO: Add initialization logic
    // Example: Load data, set default values, etc.
  }

  /**
   * Handle user actions
   */
  handleAction(data: any): void {
    // TODO: Implement action logic
    // Emit event to parent component
    this.actionEvent.emit(data);
  }

  /**
   * Example method
   */
  doSomething(): void {
    // TODO: Implement your logic
  }
}

