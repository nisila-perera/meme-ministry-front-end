import { Component } from '@angular/core';
import { SingleSavedMemeComponent } from "../single-saved-meme/single-saved-meme.component";

@Component({
  selector: 'app-saved-memes',
  standalone: true,
  imports: [SingleSavedMemeComponent],
  templateUrl: './saved-memes.component.html',
  styleUrl: './saved-memes.component.css'
})
export class SavedMemesComponent {

}
