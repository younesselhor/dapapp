// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { config } from './app/app.config.server';

// const bootstrap = () => bootstrapApplication(AppComponent, config);

// export default bootstrap;












// main.server.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ApplicationConfig, mergeApplicationConfig, inject } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http';

// If you want to pass SSR context (like request URL, cookies, headers),
// inject it via a provider instead of passing as function argument
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch()),
    // Example: placeholder for SSR context
    { provide: 'SSR_CONTEXT', useValue: {} } 
  ]
};

// Merge client + server config
const config = mergeApplicationConfig(appConfig, serverConfig);

// ✅ Correct bootstrap function for Angular 19 SSR (0 arguments)
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;

