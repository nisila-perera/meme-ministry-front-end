import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-meme',
  templateUrl: './post-meme.component.html',
  styleUrls: ['./post-meme.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PostMemeComponent {
  selectedImage: string | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.selectedImage = e.target?.result as string;
      };
      
      reader.readAsDataURL(input.files[0]);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}