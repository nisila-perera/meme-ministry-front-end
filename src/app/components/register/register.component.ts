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
      this.profilePicture = file;
    }
  }

  onCoverImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.coverPicture = file;
    }
  }

  validatePasswords(): void {
    this.passwordsMatch = this.registerObj.password === this.confirmPassword;
  }

  onRegister(): void {
    if (!this.passwordsMatch) return;
    if (!this.registerObj.username || !this.registerObj.password || !this.registerObj.email) {
      return;
    }

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
      }
    });
  }
}