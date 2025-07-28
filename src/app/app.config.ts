// // app.config.ts (client configuration)
// import { ApplicationConfig, importProvidersFrom } from '@angular/core';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { provideRouter } from '@angular/router';
// import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
// import { routes } from './app.routes';
// import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
// import { HttpClient } from '@angular/common/http';

// export function HttpLoaderFactory(http: HttpClient) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// const translations = {
//   en: {
//     'FORM.BIKE_DETAILS': 'Bike Details',
//     'FORM.ADD_IMAGES': 'Add Images',
//     'NAVBAR.HOME': 'Home',
//     'NAVBAR.PRODUCTS': 'Products',
//     'COMMON.WELCOME': 'Welcome'
//   },
//   ar: {
//     'FORM.BIKE_DETAILS': 'تفاصيل الدراجة',
//     'FORM.ADD_IMAGES': 'إضافة صور',
//     'NAVBAR.HOME': 'الرئيسية',
//     'NAVBAR.PRODUCTS': 'المنتجات',
//     'COMMON.WELCOME': 'أهلاً وسهلاً'
//   }
// };
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideAnimations(),
//     provideHttpClient(withInterceptorsFromDi()),
//     HttpClientModule,
//     importProvidersFrom(
//       TranslateModule.forRoot({
//         loader: {
//           provide: TranslateLoader,
//           useFactory: HttpLoaderFactory,
//           deps: [HttpClient]
//         },
//          isolate: false
//       })
//     )
//   ]
// };

// app.config.ts
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
// import { AuthInterceptor } from './app/interceptor/auth.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
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
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth())
    )
  ]
};
