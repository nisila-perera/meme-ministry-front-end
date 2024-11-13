import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-profile-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-section.component.html',
  styleUrl: './profile-section.component.css'
})
export class ProfileSectionComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isLoading = true;
  error: string | null = null;
  private userSubscription?: Subscription;
  defaultCoverImage = 'assets/img/cover.webp';
  defaultProfileImage = 'assets/img/default-profile.webp';
  profileImageUrl: SafeUrl | string = '';
  coverImageUrl: SafeUrl | string = '';

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    const savedUser = this.authService.getCurrentUser();
    if (savedUser) {
      console.log('Initial user data from localStorage:', savedUser);
      this.currentUser = savedUser;
      this.updateImageUrls();
    }

    this.userSubscription = this.authService.currentUser$.subscribe({
      next: (user) => {
        console.log('User data from subscription:', user);
        if (user) {
          this.currentUser = user;
          this.updateImageUrls();
        } else if (!this.currentUser) {
          // If no user in subscription and no current user, try localStorage again
          const localUser = this.authService.getCurrentUser();
          if (localUser) {
            this.currentUser = localUser;
            this.updateImageUrls();
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error in user subscription:', err);
        this.error = 'Failed to load user data';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    if (img.classList.contains('rounded-full')) {
      img.src = this.defaultProfileImage;
    } else {
      img.src = this.defaultCoverImage;
    }
  }

  private updateImageUrls(): void {
    if (this.currentUser) {
      // Profile image URL
      if (this.currentUser.profilePictureData) {
        try {
          const profileUrl = this.sanitizer.bypassSecurityTrustUrl(
            `data:${this.currentUser.profilePictureType || 'image/jpeg'};base64,${this.currentUser.profilePictureData}`
          );
          this.profileImageUrl = profileUrl;
        } catch (error) {
          console.error('Error processing profile image:', error);
          this.profileImageUrl = this.defaultProfileImage;
        }
      } else {
        this.profileImageUrl = this.defaultProfileImage;
      }

      // Cover image URL
      if (this.currentUser.coverPictureData) {
        try {
          const coverUrl = this.sanitizer.bypassSecurityTrustUrl(
            `data:${this.currentUser.coverPictureType || 'image/jpeg'};base64,${this.currentUser.coverPictureData}`
          );
          this.coverImageUrl = coverUrl;
        } catch (error) {
          console.error('Error processing cover image:', error);
          this.coverImageUrl = this.defaultCoverImage;
        }
      } else {
        this.coverImageUrl = this.defaultCoverImage;
      }
    }
  }

  refreshProfile() {
    this.isLoading = true;
    this.error = null;
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.currentUser = currentUser;
      this.updateImageUrls();
    }
    this.isLoading = false;
  }
}