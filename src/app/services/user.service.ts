import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getAllUsers(): Observable<User[]> {
    const token = this.authService.getToken();

    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    return this.http.get<User[]>(this.API_URL, { headers }).pipe(
      tap(users => console.log('Fetched users:', users)),
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(error);
      })
    );
  }

  getUserData(id: number) { }

  updateUserProfile(userId: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(
      `${this.API_URL}/${userId}`, 
      formData,
      { 
        headers,
        reportProgress: true
      }
    ).pipe(
      tap(response => {
        if (response && response.id) {
          localStorage.setItem('currentUser', JSON.stringify(response));
        }
      }),
      catchError(error => {
        console.error('Update error:', error);
        return throwError(() => error);
      })
    );
}



  updatePassword(id: number, currentPassword: string, newPassword: string) { }

  deleteAccount(id: number) { }

}
