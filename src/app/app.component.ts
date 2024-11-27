import { Component, OnInit } from '@angular/core';
import { GoogleAuthService } from './services/google-auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private googleAuthService: GoogleAuthService) {}

  ngOnInit(): void {
    this.googleAuthService.loadGoogleApi();
  }

  authorize(): void {
    this.googleAuthService.handleAuthClick();
  }

  signout(): void {
    this.googleAuthService.handleSignoutClick();
  }
}