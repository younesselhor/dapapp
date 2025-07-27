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



// // main.ts (updated bootstrap configuration)
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { routes } from './app/app.routes';
// import { provideRouter } from '@angular/router';
// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';
// import { AuthInterceptor } from './app/interceptor/auth.interceptor';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// // Function to load translation files from assets/i18n
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

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
//       TranslateModule.forRoot({
//         loader: {
//           provide: TranslateLoader,
//           useFactory: HttpLoaderFactory,
//           deps: [HttpClient]
//         }
//       })
//     )
//   ]
// }).catch(err => console.error(err));





// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { routes } from './app/app.routes';
// import { provideRouter } from '@angular/router';
// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { CookieService } from 'ngx-cookie-service';
// import { AuthInterceptor } from './app/interceptor/auth.interceptor';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { provideAuth, getAuth } from '@angular/fire/auth';
// import { environment } from './environments/environment'; // make sure you have this
// // Function to load translation files from assets/i18n
// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

//  const firebaseConfig = {
//     apiKey: "AIzaSyCPGsHiy6Eq2J8bnHi2xo9rx-1nIXM-p-o",
//     authDomain: "dabapp-3d853.firebaseapp.com",
//     projectId: "dabapp-3d853",
//     storageBucket: "dabapp-3d853.firebasestorage.app",
//     messagingSenderId: "988124060172",
//     appId: "1:988124060172:web:6a7b2aeb937a44fa196c29",
//     measurementId: "G-RELFGL4QX8"
//   };

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
//       TranslateModule.forRoot({
//         loader: {
//           provide: TranslateLoader,
//           useFactory: HttpLoaderFactory,
//           deps: [HttpClient]
//         }
//       }),
//       provideFirebaseApp(() => initializeApp(firebaseConfig)),
//       provideAuth(() => getAuth())
//     )
//   ]
// }).catch(err => console.error(err));

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
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from './environments/environment';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const firebaseConfig = {
  apiKey: "AIzaSyCPGsHiy6Eq2J8bnHi2xo9rx-1nIXM-p-o",
  authDomain: "dabapp-3d853.firebaseapp.com",
  projectId: "dabapp-3d853",
  storageBucket: "dabapp-3d853.firebasestorage.app",
  messagingSenderId: "988124060172",
  appId: "1:988124060172:web:6a7b2aeb937a44fa196c29",
  measurementId: "G-RELFGL4QX8"
};

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
//     // Firebase providers should be separate from importProvidersFrom
//     provideFirebaseApp(() => initializeApp(firebaseConfig)),
//     provideAuth(() => getAuth()),
//     // Translate module can stay with importProvidersFrom
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
// }).catch(err => console.error(err));

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
    // ✅ Firebase and Translate modules inside importProvidersFrom
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth()),
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
