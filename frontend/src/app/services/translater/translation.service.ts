import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private apiUrl = 'http://localhost:5000/api/translate';
  private currentLanguage$ = new BehaviorSubject<string>('en');

  constructor(private http: HttpClient) {
    // Charger la langue sauvegardée au démarrage
    const savedLang = localStorage.getItem('selectedLanguageCode');
    if (savedLang) {
      this.currentLanguage$.next(savedLang);
    }
  }

  setLanguage(languageCode: string): void {
    this.currentLanguage$.next(languageCode);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage$.value;
  }

  getCurrentLanguage$(): Observable<string> {
    return this.currentLanguage$.asObservable();
  }

  translate(text: string, targetLang?: string): Observable<string> {
    const lang = targetLang || this.getCurrentLanguage();
    
    // Convertir le code langue au format DeepL (EN -> EN-US, etc.)
    const deeplLang = this.convertToDeepLFormat(lang);

    return this.http.post<any>(this.apiUrl, {
      text,
      target_lang: deeplLang
    }).pipe(
      map(response => {
        if (response.translations && response.translations[0]) {
          return response.translations[0].text;
        }
        return text; // Retourner le texte original en cas d'erreur
      })
    );
  }

  private convertToDeepLFormat(langCode: string): string {
    // DeepL utilise des codes spécifiques pour certaines langues
    const langMap: { [key: string]: string } = {
      'en': 'EN-US',
      'pt': 'PT-BR',
      'zh': 'ZH',
      'nb': 'NB',
      'sv': 'SV',
      'nl': 'NL',
      'fr': 'FR',
      'de': 'DE',
      'it': 'IT',
      'es': 'ES',
      'pl': 'PL',
      'ru': 'RU',
      'ja': 'JA',
      'bg': 'BG',
      'cs': 'CS',
      'da': 'DA',
      'el': 'EL',
      'et': 'ET',
      'fi': 'FI',
      'hu': 'HU',
      'id': 'ID',
      'ko': 'KO',
      'lt': 'LT',
      'lv': 'LV',
      'ro': 'RO',
      'sk': 'SK',
      'sl': 'SL',
      'tr': 'TR',
      'uk': 'UK'
    };

    return langMap[langCode.toLowerCase()] || langCode.toUpperCase();
  }
}