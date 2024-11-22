import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-single-memer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-memer.component.html',
  styleUrls: ['./single-memer.component.css']
})
export class SingleMemerComponent implements OnInit {
  @Input() currentUser: User | null = null;

  // Image-related properties
  defaultCoverImage = 'assets/images/default-cover.jpg';
  defaultProfileImage = 'assets/images/default-profile.jpg';

  profileImageUrl: SafeUrl | string = '';
  coverImageUrl: SafeUrl | string = '';

  // Additional user-related flags
  isCurrentUserProfile = false;
  isFollowing = false;

  constructor(private sanitizer: DomSanitizer, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    if (this.currentUser) {
      this.processUserImages();
      this.checkFollowStatus();
    }
  }

  private processUserImages(): void {
    // Process profile image
    this.profileImageUrl = this.getProcessedImage(
      this.currentUser?.profilePictureData,
      this.currentUser?.profilePictureType,
      this.defaultProfileImage
    );

    // Process cover image
    this.coverImageUrl = this.getProcessedImage(
      this.currentUser?.coverPictureData,
      this.currentUser?.coverPictureType,
      this.defaultCoverImage
    );
  }

  private getProcessedImage(
    imageData: string | undefined,
    imageType: string | undefined,
    defaultImage: string
  ): SafeUrl | string {
    if (imageData) {
      return this.sanitizer.bypassSecurityTrustUrl(
        `data:${imageType || 'image/jpeg'};base64,${imageData}`
      );
    }
    return defaultImage;
  }

  checkFollowStatus(): void {
    if (!this.currentUser) return;

    this.userService.getFollowers(this.currentUser.id).subscribe({
      next: (followers) => {
        const currentLoggedInUserId = this.authService.getCurrentUser()?.id;
        this.isFollowing = followers.some(follower => follower.id === currentLoggedInUserId);
      },
      error: (error) => console.error('Error checking follow status:', error)
    });
  }

  onFollowToggle(): void {
    if (!this.currentUser) return;

    const userId = this.currentUser.id;

    if (this.isFollowing) {
      this.userService.unfollowUser(userId).subscribe({
        next: () => {
          this.isFollowing = false;
          this.currentUser!.followerCount--;
        },
        error: (error) => console.error('Error unfollowing user:', error)
      });
    } else {
      this.userService.followUser(userId).subscribe({
        next: () => {
          this.isFollowing = true;
          this.currentUser!.followerCount++;
        },
        error: (error) => console.error('Error following user:', error)
      });
    }
  }

  viewProfile(): void {
    if (!this.currentUser) return;
    console.log(`Navigating to profile of: ${this.currentUser.username}`);
  }

  get displayName(): string {
    return this.currentUser?.username ||
      'No Name Found';
  }

  get userBio(): string {
    return this.currentUser?.bio ||
      'No Bio Found';
  }

  followUser() { }

  getProfileImageUrl(): SafeUrl | string {
    return this.getProcessedImage(
      this.currentUser?.profilePictureData,
      this.currentUser?.profilePictureType,
      this.defaultProfileImage
    );
  }

  getCoverImageUrl(): SafeUrl | string {
    return this.getProcessedImage(
      this.currentUser?.coverPictureData,
      this.currentUser?.coverPictureType,
      this.defaultCoverImage
    );
  }
}