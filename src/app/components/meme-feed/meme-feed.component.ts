import { Component } from '@angular/core';
import { SingleMemeComponent } from "../single-meme/single-meme.component";
import { PostMemeComponent } from "../post-meme/post-meme.component";

@Component({
  selector: 'app-meme-feed',
  standalone: true,
  imports: [SingleMemeComponent, PostMemeComponent],
  templateUrl: './meme-feed.component.html',
  styleUrl: './meme-feed.component.css'
})
export class MemeFeedComponent {

}
