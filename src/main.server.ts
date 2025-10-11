// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { config } from './app/app.config.server';

// const bootstrap = () => bootstrapApplication(AppComponent, config);

// export default bootstrap;












import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withFetch } from '@angular/common/http';

// Merge client + server config
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(withFetch())
  ]
};

const config = mergeApplicationConfig(appConfig, serverConfig);

// ✅ Must receive `context` for Angular SSR
const bootstrap = (context: any) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
