import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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

  constructor(private http: HttpClient, private router: Router) {
    this.checkSession();
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

  private checkSession() {
    const sessionToken = this.getCookie('session_token');
    if (sessionToken) {
      this.verifySession(sessionToken).subscribe({
        next: (response) => {
          if (response.token) {
            this.handleAuthSuccess(response);
          }
        },
        error: () => this.logout()
      });
    }
  }

  private verifySession(token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/verify-session`, { token });
  }

  private handleAuthSuccess(response: AuthResponse) {
    if (response && response.user && response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      this.setCookie('session_token', response.token);
      this.currentUserSubject.next(response.user);
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login`, { username, password })
      .pipe(
        tap((response) => this.handleAuthSuccess(response))
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    document.cookie = 'session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(formData: FormData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth/register`,
      formData
    ).pipe(
      tap((response) => {
        if (response && response.user) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }
      })
    );
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getCurrentUser();
    return !!(token && user);
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
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }
}