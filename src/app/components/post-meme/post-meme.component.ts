import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-meme',
  templateUrl: './post-meme.component.html',
  styleUrls: ['./post-meme.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class PostMemeComponent {
  caption: string = '';
  selectedImage: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isPosting = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      this.selectedFile = file;

      // For image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.selectedFile = null;
  }

  onPost(): void {
    // Check if a file is selected and the user is logged in
    if (!this.selectedFile || !this.currentUser) {
      console.error('File or user is not selected');
      return;
    }

    this.isPosting = true;

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    formData.append('caption', this.caption);
    formData.append('userId', this.currentUser.id.toString());

    console.log('Current user:', this.currentUser);
    console.log('Auth token:', this.authService.getToken());

    try {
      this.postService.postPost(formData).subscribe({
        next: (response) => {
          console.log('Post created successfully:', response);
          this.isPosting = false;
          this.removeImage();
          this.caption = '';
        },
        error: (error) => {
          console.error('Error creating post - Full error object:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Error headers:', error.headers);
          if (error.error) {
            console.error('Server error response:', error.error);
          }

          this.isPosting = false;
          if (error.status === 401) {
            console.log('Unauthorized - Current token:', this.authService.getToken());
          }
        }
      });
    } catch (error) {
      console.error('Try-catch error:', error);
      this.isPosting = false;
    }
  }
}