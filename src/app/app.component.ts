import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSidebarComponent } from "./components/app-sidebar/app-sidebar.component";
import { MemeFeedComponent } from "./components/meme-feed/meme-feed.component";
import { ProfileSectionComponent } from "./components/profile-section/profile-section.component";
import { LoginComponent } from "./components/login/login.component";
import { LayoutComponent } from "./components/layout/layout.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppSidebarComponent, MemeFeedComponent, ProfileSectionComponent, LoginComponent, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meme-ministry-front-end';
}
