import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  UrlTree
} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private cookieService: CookieService) {}

  private checkLogin(): boolean | UrlTree {
    const token = this.cookieService.get('token');

    if (!token) {
      // 🚫 No token → redirect to home
      return this.router.createUrlTree(['/home']);
    }

    // ✅ Logged in
    return true;
  }

  canActivate(): boolean | UrlTree {
    return this.checkLogin();
  }

  canActivateChild(): boolean | UrlTree {
    return this.checkLogin();
  }
}
