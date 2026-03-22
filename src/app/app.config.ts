import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, withInMemoryScrolling, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { handleHeaderInterceptor } from './core/interceptors/handle-header-interceptor';
import { handleErrorInterceptor } from './core/interceptors/handle-error-interceptor';
import { provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { loadingInterceptor } from './core/interceptors/loading-interceptor';
import {provideTranslateHttpLoader} from "@ngx-translate/http-loader";
import {provideTranslateService} from "@ngx-translate/core";



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: "top" }),
      withViewTransitions(),
      withHashLocation()
    ),
    provideHttpClient(withFetch(), withInterceptors([handleHeaderInterceptor, handleErrorInterceptor,loadingInterceptor])),
    provideToastr(),
    importProvidersFrom(BrowserAnimationsModule,NgxSpinnerModule),



    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json'
      }),
      fallbackLang: 'en',
      lang: 'en'
    })

  ]
};
