import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '../../services/translater/translation.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[translate]',
  standalone: true
})
export class TranslateDirective implements OnInit, OnDestroy {
  @Input('translate') textToTranslate: string | undefined;
  private destroy$ = new Subject<void>();
  private originalText: string = '';

  constructor(
    private el: ElementRef,
    private translationService: TranslateService
  ) {}

  ngOnInit() {
    this.originalText = this.textToTranslate || this.el.nativeElement.innerText.trim();
    
    if (!this.originalText) return;

    // Traduire au chargement
    this.translateText();

    // Écouter les changements de langue
    window.addEventListener('languageChanged', this.onLanguageChange.bind(this));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('languageChanged', this.onLanguageChange.bind(this));
  }

  private onLanguageChange = () => {
    this.translateText();
  };

  private translateText() {
    this.translationService.translate(this.originalText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (translated) => {
          this.el.nativeElement.innerText = translated;
        },
        error: (error) => {
          console.error('Translation error:', error);
          // Garder le texte original en cas d'erreur
          this.el.nativeElement.innerText = this.originalText;
        }
      });
  }
}