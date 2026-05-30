import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt-interceptor';
import { Observable } from 'rxjs';

class CustomTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}
  getTranslation(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`);
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

export function initTranslate(translate: TranslateService) {
  return () => {
    const saved = localStorage.getItem('foodie_lang') ?? 'en';
    translate.addLangs(['en', 'el']);
    translate.setDefaultLang('en');
    return translate.use(saved).toPromise();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslate,
      deps: [TranslateService],
      multi: true
    }
  ]
};