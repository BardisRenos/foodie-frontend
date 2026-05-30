import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class LanguageService {

  private readonly LANG_KEY = 'foodie_lang';

  availableLanguages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'el', label: 'ΕΛ', flag: '🇬🇷' }
  ];

  constructor(private translate: TranslateService) {
    const saved = localStorage.getItem(this.LANG_KEY) ?? 'en';
    this.translate.addLangs(['en', 'el']);
    this.translate.setDefaultLang('en');
    this.translate.use(saved);
  }

  switchLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem(this.LANG_KEY, lang);
  }

  getCurrentLang(): string {
    return this.translate.currentLang ?? 'en';
  }
}