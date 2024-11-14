import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  constructor(private sanitizer: DomSanitizer) { }

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
    // If image data exists, create a safe URL
    if (imageData) {
      return this.sanitizer.bypassSecurityTrustUrl(
        `data:${imageType || 'image/jpeg'};base64,${imageData}`
      );
    }

    // Return default image if no image data
    return defaultImage;
  }

  private checkFollowStatus(): void {
    // Implement follow status check logic
    // This might involve checking if the current authenticated user follows this user
    this.isFollowing = false;
  }

  // Method to handle follow/unfollow action
  onFollowToggle(): void {
    if (!this.currentUser) return;

    // Toggle follow status
    this.isFollowing = !this.isFollowing;

    // TODO: Implement actual follow/unfollow logic
    console.log(`${this.isFollowing ? 'Following' : 'Unfollowed'} user: ${this.currentUser.username}`);
  }

  // Method to view user profile
  viewProfile(): void {
    if (!this.currentUser) return;
    console.log(`Navigating to profile of: ${this.currentUser.username}`);
  }

  get displayName(): string {
    return this.currentUser?.username ||
      'Anonymous User';
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