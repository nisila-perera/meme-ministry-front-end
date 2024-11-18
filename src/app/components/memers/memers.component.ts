import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { SingleMemerComponent } from "../single-memer/single-memer.component";
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-memers',
  standalone: true,
  templateUrl: './memers.component.html',
  styleUrls: ['./memers.component.css'],
  imports: [SingleMemerComponent, CommonModule]
})
export class MemersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;
  error: string | null = null;
  private currentUser: User | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (!this.isLoading) {
        this.filterUsers();
      }
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filterUsers();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.error = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }

  private filterUsers(): void {
    if (this.currentUser) {
      this.users = this.users.filter(user => user.id !== this.currentUser?.id);
    }
  }
}