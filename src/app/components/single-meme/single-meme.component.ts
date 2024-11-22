import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-single-meme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-meme.component.html',
  styleUrl: './single-meme.component.css'
})
export class SingleMemeComponent implements OnInit {
  @Input() currentPost: Post | null = null;

  defaultMemeImage = 'assets/images/meme.jpg';
  defaultProfileImage = 'assets/img/profile.jpg';

  postImageUrl: SafeUrl | string = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // if (this.currentPost) {
    //   this.processPostImage();
    // }
  }
  private getProcessedImage(
    imageData: string | undefined,
    imageType: string | undefined,
    defaultImage: string
): string {
    if (imageData && imageType) {
        const imageUrl = `data:png;base64,${imageData}`;
        console.log('Constructed image URL:', imageUrl.substring(0, 100) + '...');
        return imageUrl;
    }
    return defaultImage;
}


  getProfileImageUrl(): SafeUrl {
    const imageUrl = this.getProcessedImage(
      this.currentPost?.user?.profilePictureData,
      this.currentPost?.user?.profilePictureType,
      this.defaultProfileImage
    );
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  processPostImage(): SafeUrl {
    const imageUrl = this.getProcessedImage(
      this.currentPost?.imageData,
      this.currentPost?.imageType,
      this.defaultProfileImage
    );
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }
}