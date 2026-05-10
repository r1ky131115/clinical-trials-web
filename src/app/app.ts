import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  title = 'Clinical Trials Dashboard';
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
}
