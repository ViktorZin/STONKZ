import { platformBrowser, bootstrapApplication } from '@angular/platform-browser';
//import { AppModule } from './app/app.module';
import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';


//platformBrowser().bootstrapModule(AppModule, {
//  ngZoneEventCoalescing: true,
//})
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));
