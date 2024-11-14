import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, map } from 'rxjs';
import { PostResponse } from '../models/post.model';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly API_URL = 'http://localhost:8080/api/posts';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  postPost(formData: FormData): Observable<PostResponse> {
    const token = this.authService.getToken();
    console.log('Token being used:', token);

    if (!token) {
      throw new Error('No authentication token found');
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', '*/*');

    console.log('Headers being sent:', headers);

    return this.http.post<PostResponse>(
      this.API_URL,
      formData,
      {
        headers,
        observe: 'response'
      }
    ).pipe(
      map(response => response.body as PostResponse),
      catchError(error => {
        console.error('Error occurred during post:', error);
        return throwError(error);
      })
    );
  }
}