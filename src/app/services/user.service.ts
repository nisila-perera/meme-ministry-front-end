import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUserData(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const currentUser = this.authService.getCurrentUser()

    return this.http.get<any>(`${this.API_URL}/${currentUser?.id}`, { headers }).pipe(
      tap(res =>{
        console.log(res);
        
      })
      // catchError(error => {
      //   console.error('Failed to load user data:', error);
      //   return throwError(() => new Error('Failed to load user data.'));
      // })
    );
  }
}
