// // app.config.server.ts
// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideServerRendering } from '@angular/platform-server';
// import { provideRouter } from '@angular/router';
// import { routes } from './app.routes';
// import { HttpClientModule, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { HttpClient } from '@angular/common/http';

// // Factory function for server-side translation loading
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// export const serverConfig: ApplicationConfig = {
//   providers: [
//     provideServerRendering(),
//     provideRouter(routes),
//      HttpClientModule,
//     provideHttpClient(
//       withFetch(),
//       withInterceptors([]) // you can add your interceptors here later
//     ),
//     // Add TranslateModule configuration for SSR
//     importProvidersFrom(
//       TranslateModule.forRoot({
//         loader: {
//           provide: TranslateLoader,
//           useFactory: HttpLoaderFactory,
//           deps: [HttpClient]
//         }
//       })
//     )
//   ]
// };





// import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
// import { provideServerRendering } from '@angular/platform-server';
// import { provideHttpClient, withFetch } from '@angular/common/http';
// import { appConfig } from './app.config';

// const serverConfig: ApplicationConfig = {
//   providers: [
//     provideServerRendering(),
//     provideHttpClient(withFetch()) // Use withFetch for server-side
//   ]
// };

// export const config = mergeApplicationConfig(appConfig, serverConfig);







import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);