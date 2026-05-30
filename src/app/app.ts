import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavComponent } from './components/nav/nav.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, NavComponent],
  template: `
    <app-nav *ngIf="auth.isLoggedIn()"></app-nav>
    <main style="padding: 24px;">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App {
  constructor(protected auth: AuthService) {}
}
