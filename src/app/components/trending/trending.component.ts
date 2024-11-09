import { Component } from '@angular/core';
import { SingleMemeComponent } from "../single-meme/single-meme.component";

@Component({
  selector: 'app-trending',
  standalone: true,
  imports: [SingleMemeComponent],
  templateUrl: './trending.component.html',
  styleUrl: './trending.component.css'
})
export class TrendingComponent {

}
