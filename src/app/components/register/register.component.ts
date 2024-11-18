// register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

interface UserRegistrationDTO {
  username: string;
  password: string;
  email: string;
  bio: string;
  postCount: number;
  followerCount: number;
  followingCount: number;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerObj: UserRegistrationDTO = {
    username: '',
    password: '',
    email: '',
    bio: '',
    postCount: 0,
    followerCount: 0,
    followingCount: 0
  };

  profilePicture: File | null = null;
  coverPicture: File | null = null;
  confirmPassword: string = '';
  passwordsMatch: boolean = true;
  isLoading: boolean = false;
  formErrors: { [key: string]: string } = {};
  profilePreview: string | null = null;
  coverPreview: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      this.router.navigate(['']);
    }
  }

  onProfilePicChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        this.formErrors['profilePic'] = 'File size should be less than 5MB';
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.formErrors['profilePic'] = 'Only image files are allowed';
        return;
      }
      this.profilePicture = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      delete this.formErrors['profilePic'];
    }
  }

  onCoverImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        this.formErrors['coverPic'] = 'File size should be less than 5MB';
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.formErrors['coverPic'] = 'Only image files are allowed';
        return;
      }
      this.coverPicture = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      delete this.formErrors['coverPic'];
    }
  }

  validateForm(): boolean {
    this.formErrors = {};
    
    if (!this.registerObj.username) {
      this.formErrors['username'] = 'Username is required';
    } else if (this.registerObj.username.length < 3) {
      this.formErrors['username'] = 'Username must be at least 3 characters long';
    }

    if (!this.registerObj.email) {
      this.formErrors['email'] = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.registerObj.email)) {
      this.formErrors['email'] = 'Please enter a valid email address';
    }

    if (!this.registerObj.password) {
      this.formErrors['password'] = 'Password is required';
    } else if (this.registerObj.password.length < 6) {
      this.formErrors['password'] = 'Password must be at least 6 characters long';
    }

    if (this.registerObj.password !== this.confirmPassword) {
      this.formErrors['confirmPassword'] = 'Passwords do not match';
      this.passwordsMatch = false;
    }

    return Object.keys(this.formErrors).length === 0;
  }

  onRegister(): void {
    if (!this.validateForm()) return;
    
    this.isLoading = true;
    const formData = new FormData();
    formData.append('registrationDTO', new Blob([JSON.stringify(this.registerObj)], {
      type: 'application/json'
    }));

    if (this.profilePicture) {
      formData.append('profilePicture', this.profilePicture);
    }
    if (this.coverPicture) {
      formData.append('coverPicture', this.coverPicture);
    }

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.formErrors['general'] = 'Registration failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}