import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit(): void {
   if(this.authService.isAuthenticated()){
    this.router.navigate(['']);
   }
  }

  loginObj: any = {
    "username": "",
    "password": ""
  };

  // Add login method
  onLogin(): void {
    this.authService.login(this.loginObj.username, this.loginObj.password)
      .subscribe({
        next: (response) => {
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
  }
}