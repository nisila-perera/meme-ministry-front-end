import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  currentMeme: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
   if(this.authService.isAuthenticated()){
    this.router.navigate(['']);
   }
   this.setRandomMeme()
  }

  setRandomMeme() {
    const randomNum = Math.floor(Math.random() * 6) + 1;
    this.currentMeme = `assets/img/login-memes/login-meme-${randomNum}.jpg`;
  }

  loginObj: any = {
    "username": "",
    "password": ""
  };

  onLogin(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.loginObj.username, this.loginObj.password)
      .subscribe({
        next: (response) => {
          this.router.navigate(['']);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Login failed. Please check your credentials and try again.';
          this.isLoading = false;
        }
      });
  }
}