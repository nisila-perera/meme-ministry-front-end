import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  http= inject(HttpClient)
  userList: any[]= [];

  ngOnInit(): void{
    this.getAllUser()
  }

  getAllUser() {
    debugger
    this.http.get("http://localhost:8080/api/users").subscribe((res:any)=>{
      this.userList = res.username
    })
  }
}
