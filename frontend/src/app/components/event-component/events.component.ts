import { Component } from '@angular/core';
import { TranslateService } from '../../services/translater/translation.service';

@Component({
  selector: 'app-video-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class VideoEventsComponent {

  translatedText: string = '';

  constructor(private translateService: TranslateService) {}

  translateText() {
    const textToTranslate = 'Bonjour le monde';

    this.translateService.translate(textToTranslate, 'EN').subscribe({
      next: (response: any) => {
        // DeepL renvoie un tableau "translations"
        this.translatedText = response.translations[0].text;
        console.log(this.translatedText);
      },
      error: (err) => {
        console.error('Erreur traduction:', err);
      }
    });
  }
}
