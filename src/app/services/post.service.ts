import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, map, tap } from 'rxjs';
import { Post, PostResponse } from '../models/post.model';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../models/user';

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

  getUserFollowingPosts(userId: number): Observable<Post[]> {
    const url = `${this.API_URL}/user/${userId}/following`;
    return this.http.get<Post[]>(url).pipe(
      tap({      
        next: (response) => console.log('API Response:', response),
        error: (error) => console.log('API Error:', error)
      })
    );
  }

  getSinglePostById(postId: number): Observable<Post[]> {
    const url = `${this.API_URL}/${postId}`;
    return this.http.get<Post[]>(url).pipe(
      tap({
        next: (response) => console.log('Post loaded successfully:', response),
        error: (error) => console.error('Error loading post:', error)
      })
    );
}
}