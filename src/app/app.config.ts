import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation  } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
// import { NgbNavModule  } from '@ng-bootstrap/ng-bootstrap';




export const appConfig: ApplicationConfig = {
   providers: 
  [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withComponentInputBinding(),
      withHashLocation() // <-- THIS replaces useHash:true
    ), 
    importProvidersFrom(FontAwesomeModule,  ), 
    provideHttpClient()]
};