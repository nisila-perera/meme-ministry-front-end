import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `http://localhost:8080/api/auth`;

  constructor(private http: HttpClient, private router:Router) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser: AuthResponse = JSON.parse(savedUser);
      this.currentUserSubject.next(parsedUser.user);
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.API_URL}/login`,
        { username, password }
      )
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.accessToken);
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  register(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, user,
      {
      responseType: 'json',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).pipe(
      tap((response) => {
        console.log(response);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser: AuthResponse = JSON.parse(savedUser);
      return parsedUser.user;
    }
    return null;
  }
}