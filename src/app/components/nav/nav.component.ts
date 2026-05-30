import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  template: `
    <nav>
      <span class="cart-icon" style="cursor:pointer;display:flex;align-items:center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
      </span>
      <a routerLink="/stores" routerLinkActive="active">Tiendas</a>
      <a routerLink="/products" routerLinkActive="active">Productos</a>
      <span style="flex:1"></span>
      <span *ngIf="auth.user() as u" style="color:white;margin-right:12px">
        {{ u.username }}
      </span>
      <a href="#" (click)="logout($event)">Salir</a>
    </nav>
  `,
  styles: [`
    nav { background: #1976d2; padding: 12px 24px; display: flex; gap: 24px; align-items: center; }
    a { color: white; text-decoration: none; font-weight: 500; }
    a.active { text-decoration: underline; }
    .cart-icon {
      margin-right: 20px;
    }
  `]
})
export class NavComponent {
  constructor(protected auth: AuthService, private router: Router) {}

  logout(e: Event): void {
    e.preventDefault();
    this.auth.logout();
    this.router.navigate(['/']);
  }
}
