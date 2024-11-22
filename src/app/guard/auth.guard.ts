import { Injectable } from '@angular/core';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log('AuthGuard checking route:', state.url);
    
    if (state.url === '/login' && this.authService.isAuthenticated()) {
      console.log('Already authenticated, redirecting to home');
      return this.router.createUrlTree(['/']);
    }

    if (state.url !== '/login' && !this.authService.isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      return this.router.createUrlTree(['/login']);
    }

    console.log('Auth check passed for route:', state.url);
    return true;
  }
}