// settings.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class SettingsComponent implements OnInit {
  currentUser: any;
  formData: any = {
    username: '',
    email: '',
    bio: '',
  };
  profilePictureFile: File | null = null;
  coverPictureFile: File | null = null;
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.formData = {
        username: this.currentUser.username || '',
        email: this.currentUser.email || '',
        bio: this.currentUser.bio || '',
      };
    }
  }

  onFileChange(event: Event, type: 'profile' | 'cover'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidImageFile(file)) {
        if (type === 'profile') {
          this.profilePictureFile = file;
        } else if (type === 'cover') {
          this.coverPictureFile = file;
        }
      } else {
        alert('Please upload a valid image file (JPG, PNG, or GIF)');
        input.value = '';
      }
    }
  }

  isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return validTypes.includes(file.type);
  }

  navigateToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  saveChanges(): void {
    if (!this.currentUser?.id) {
      alert('User ID not found');
      return;
    }

    this.isLoading = true;
    const formData = new FormData();

    const updateData = {
      username: this.formData.username,
      email: this.formData.email,
      bio: this.formData.bio
    };

    formData.append('registrationDTO', new Blob([JSON.stringify(updateData)], {
      type: 'application/json'
    }));

    if (this.profilePictureFile) {
      formData.append('profilePicture', this.profilePictureFile);
    }
    if (this.coverPictureFile) {
      formData.append('coverPicture', this.coverPictureFile);
    }

    this.userService.updateUserProfile(this.currentUser.id, formData).subscribe({
      next: (response) => {
        if (response) {
          this.currentUser = response;
          this.loadUserData();
          alert('Profile updated successfully!');
        }
      },
      error: (error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        } else {
          alert('An error occurred while updating the profile.');
        }
        console.error('Update error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }


  initiateAccountDeletion(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion logic
    }
  }
}