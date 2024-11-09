import { Component, inject, OnInit } from '@angular/core';
import { AppSidebarComponent } from "../app-sidebar/app-sidebar.component";
import { ProfileSectionComponent } from "../profile-section/profile-section.component";
import { MemeFeedComponent } from "../meme-feed/meme-feed.component";
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AppSidebarComponent, ProfileSectionComponent, MemeFeedComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {


}
