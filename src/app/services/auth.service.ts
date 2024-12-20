import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, catchError } from 'rxjs';
import { AuthResponse, User } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `http://localhost:8080/api`;
  private isInitializing = false;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    if (this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      const savedUser = this.getCurrentUser();
      const sessionToken = this.getCookie('session_token');

      if (savedUser && sessionToken) {
        this.currentUserSubject.next(savedUser);

        if (!window.location.pathname.includes('/login')) {
          await this.verifySession(sessionToken).toPromise();
        }
      } else {
        this.clearAuthData();
      }
    } catch (error) {
      this.clearAuthData();
    } finally {
      this.isInitializing = false;
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.currentUserSubject.next(null);
  }

  private setCookie(name: string, value: string, expiryHours: number = 2) {
    const date = new Date();
    date.setTime(date.getTime() + (expiryHours * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
      if (cookieName === name) {
        return cookieValue;
      }
    }
    return null;
  }

  private verifySession(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/verify-session`, { token }).pipe(
      catchError(error => {
        console.error('Session verification failed:', error);
        this.logout();
        return of({ user: null, token: null } as unknown as AuthResponse);
      })
    );
  }

  private handleAuthSuccess(response: AuthResponse) {
    console.log('Handling auth success:', response);
    if (response && response.user && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.setCookie('session_token', response.token);
      this.currentUserSubject.next(response.user);
      
      if (window.location.pathname !== '/') {
        console.log('Navigating to home page');
        this.router.navigate(['/']);
      }
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, { username, password })
      .pipe(
        tap((response) => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          throw error;
        })
      );
  }

  logout(): void {
      this.clearAuthData();
      
      if (!window.location.pathname.includes('/login')) {
        this.router.navigate(['/login']);
      }
  }

  register(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/register`,
      formData
    ).pipe(
      tap((response) => this.handleAuthSuccess(response)),
      catchError(error => {
        throw error;
      })
    );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    const sessionToken = this.getCookie('session_token');
    const isAuth = !!(token && user && sessionToken);
    console.log('Authentication check:', { 
      hasToken: !!token, 
      hasUser: !!user, 
      hasSessionToken: !!sessionToken,
      isAuthenticated: isAuth 
    });
    return isAuth;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && parsedUser.username) {
          return parsedUser;
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}