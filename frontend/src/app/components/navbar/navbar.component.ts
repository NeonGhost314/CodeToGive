import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { COLORS } from '../../shared/constants/colors.constants';
import { TranslateService } from '../../services/translater/translation.service';

interface Language {
  code: string;
  name: string;
  flagCode: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  colors = COLORS;
  isDropdownOpen = false;
  private readonly LANGUAGE_STORAGE_KEY = 'selectedLanguageCode';
  
  languages: Language[] = [
    { code: 'ar', name: 'العربية', flagCode: 'sa' },
    { code: 'bg', name: 'Български', flagCode: 'bg' },
    { code: 'cs', name: 'Čeština', flagCode: 'cz' },
    { code: 'da', name: 'Dansk', flagCode: 'dk' },
    { code: 'de', name: 'Deutsch', flagCode: 'de' },
    { code: 'el', name: 'Ελληνικά', flagCode: 'gr' },
    { code: 'en', name: 'English', flagCode: 'gb' },
    { code: 'es', name: 'Español', flagCode: 'es' },
    { code: 'et', name: 'Eesti', flagCode: 'ee' },
    { code: 'fi', name: 'Suomi', flagCode: 'fi' },
    { code: 'fr', name: 'Français', flagCode: 'fr' },
    { code: 'he', name: 'עברית', flagCode: 'il' },
    { code: 'hu', name: 'Magyar', flagCode: 'hu' },
    { code: 'id', name: 'Bahasa Indonesia', flagCode: 'id' },
    { code: 'it', name: 'Italiano', flagCode: 'it' },
    { code: 'ja', name: '日本語', flagCode: 'jp' },
    { code: 'ko', name: '한국어', flagCode: 'kr' },
    { code: 'lt', name: 'Lietuvių', flagCode: 'lt' },
    { code: 'lv', name: 'Latviešu', flagCode: 'lv' },
    { code: 'nb', name: 'Norsk Bokmål', flagCode: 'no' },
    { code: 'nl', name: 'Nederlands', flagCode: 'nl' },
    { code: 'pl', name: 'Polski', flagCode: 'pl' },
    { code: 'pt', name: 'Português', flagCode: 'pt' },
    { code: 'ro', name: 'Română', flagCode: 'ro' },
    { code: 'ru', name: 'Русский', flagCode: 'ru' },
    { code: 'sk', name: 'Slovenčina', flagCode: 'sk' },
    { code: 'sl', name: 'Slovenščina', flagCode: 'si' },
    { code: 'sv', name: 'Svenska', flagCode: 'se' },
    { code: 'th', name: 'ไทย', flagCode: 'th' },
    { code: 'tr', name: 'Türkçe', flagCode: 'tr' },
    { code: 'uk', name: 'Українська', flagCode: 'ua' },
    { code: 'vi', name: 'Tiếng Việt', flagCode: 'vn' },
    { code: 'zh', name: '中文', flagCode: 'cn' },
    { code: 'hi', name: 'हिन्दी', flagCode: 'in' }
  ];

  selectedLanguage: Language = this.languages.find(lang => lang.code === 'en') || this.languages[0];

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    const storedLanguageCode = localStorage.getItem(this.LANGUAGE_STORAGE_KEY);
    if (storedLanguageCode) {
      const storedLanguage = this.languages.find(lang => lang.code === storedLanguageCode);
      if (storedLanguage) {
        this.selectedLanguage = storedLanguage;
        this.translateService.setLanguage(storedLanguageCode);
      }
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  selectLanguage(language: Language): void {
    this.selectedLanguage = language;
    this.isDropdownOpen = false;

    this.saveLanguagePreference(language.code);

    this.translateService.setLanguage(language.code);
    
    console.log('Language changed to:', language.code);

    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { languageCode: language.code }
    }));
  }

  private saveLanguagePreference(languageCode: string): void {
    try {
      localStorage.setItem(this.LANGUAGE_STORAGE_KEY, languageCode);
    } catch (e) {
      console.error('Error saving language preference to localStorage', e);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.language-selector')) {
      this.closeDropdown();
    }
  }
}