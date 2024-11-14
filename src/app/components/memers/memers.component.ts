import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { SingleMemerComponent } from "../single-memer/single-memer.component";
import { CommonModule } from '@angular/common';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.error = 'Failed to load users';
        this.isLoading = false;
      }
    });
  }
}