import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-sidebar.component.html',
  styleUrl: './app-sidebar.component.css'
})
export class AppSidebarComponent {

  constructor(private authServic:AuthService){}

  logout():void{
    this.authServic.logout();
  }

}
