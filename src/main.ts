// // // main.ts
// // import { bootstrapApplication } from '@angular/platform-browser';
// // import { AppComponent } from './app/app.component';
// // import { provideAnimations } from '@angular/platform-browser/animations';
// // import { routes } from './app/app.routes';
// // import { provideRouter } from '@angular/router';
// // import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// // import { CookieService } from 'ngx-cookie-service';
// // import { AuthInterceptor } from './app/interceptor/auth.interceptor';

// // bootstrapApplication(AppComponent, {
// //   providers: [
// //     provideRouter(routes),
// //     provideAnimations(),
// //     // provideHttpClient(), // Correct, simple version
// //     provideHttpClient(withInterceptorsFromDi()),
// //     CookieService,
// //     {
// //       provide: HTTP_INTERCEPTORS,
// //       useClass: AuthInterceptor,
// //       multi: true
// //     }
// //     ]
// // }).catch(err => console.error(err));
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { routes } from './app/app.routes';
// import { provideRouter } from '@angular/router';
// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';
// import { AuthInterceptor } from './app/interceptor/auth.interceptor';

// import { importProvidersFrom } from '@angular/core';
// import { HttpClientModule, HttpClient } from '@angular/common/http';

// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// // Function to load translation files from assets/i18n
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// // bootstrapApplication(AppComponent, {
// //   providers: [
// //     provideRouter(routes),
// //     provideAnimations(),
// //     provideHttpClient(withInterceptorsFromDi()),
// //     CookieService,
// //     {
// //       provide: HTTP_INTERCEPTORS,
// //       useClass: AuthInterceptor,
// //       multi: true
// //     },
// //      importProvidersFrom(
// //       TranslateModule.forRoot({
// //         loader: {
// //           provide: TranslateLoader,
// //           useFactory: HttpLoaderFactory,
// //           deps: [HttpClient]
// //         }
// //       })
// //     )
// //     // importProvidersFrom([
// //     //   HttpClientModule,
// //     //   TranslateModule.forRoot({
// //     //     defaultLanguage: 'en',
// //     //     loader: {
// //     //       provide: TranslateLoader,
// //     //       useFactory: HttpLoaderFactory,
// //     //       deps: [HttpClient]
// //     //     }
// //     //   })
// //     // ])
// //   ]
// // }).catch(err => console.error(err));


// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     provideAnimations(),
//     provideHttpClient(withInterceptorsFromDi()),
//     CookieService,
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: AuthInterceptor,
//       multi: true
//     },
//     importProvidersFrom(
//       HttpClientModule,
//       TranslateModule.forRoot({
//         loader: {
//           provide: TranslateLoader,
//           useFactory: HttpLoaderFactory,
//           deps: [HttpClient]
//         }
//       })
//     )
//   ]
// });

// main.ts (updated bootstrap configuration)
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from './app/interceptor/auth.interceptor';
import { importProvidersFrom } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Function to load translation files from assets/i18n
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ]
}).catch(err => console.error(err));