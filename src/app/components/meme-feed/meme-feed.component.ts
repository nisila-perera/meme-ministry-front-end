import { Component, OnInit } from '@angular/core';
import { SingleMemeComponent } from "../single-meme/single-meme.component";
import { PostMemeComponent } from "../post-meme/post-meme.component";
import { Post } from '../../models/post.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meme-feed',
  standalone: true,
  imports: [SingleMemeComponent, PostMemeComponent, CommonModule],
  templateUrl: './meme-feed.component.html',
  styleUrl: './meme-feed.component.css'
})
export class MemeFeedComponent implements OnInit {

  posts: Post[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private authService: AuthService, private postService: PostService) {
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user:', currentUser);
    
    if (!currentUser) {
      console.error('No current user found');
      this.error = 'User not authenticated';
      this.isLoading = false;
      return;
    }
    
    setTimeout(() => {
      this.fetchPosts();
    }, 1000);
  }

  fetchPosts(): void {
    const userId = this.authService.getCurrentUser()!.id;
    console.log('Fetching posts for user ID:', userId);

    this.postService.getUserFollowingPosts(userId).subscribe({
      next: (data) => {
        console.log('Received posts data:', data);
        this.posts = data;
        console.log('Posts array after assignment:', this.posts);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching memes:', err);
        console.error('Error details:', {
          status: err.status,
          message: err.message,
          error: err.error
        });
        this.error = 'Failed to load memes';
        this.isLoading = false;
      },
      complete: () => {
        console.log('Posts fetch completed. Final posts array:', this.posts);
      }
    });
  }
}