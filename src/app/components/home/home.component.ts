import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:24px;box-sizing:border-box">
      <img src="assets/carrito.png" alt="Carrito" style="max-width:90%;max-height:70vh;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15)" onerror="this.style.display='none'">
      <a routerLink="/login" style="margin-top:32px;padding:14px 48px;background:#1976d2;color:white;text-decoration:none;border-radius:8px;font-size:1.2rem;font-weight:500">Iniciar Sesión</a>
    </div>
  `
})
export class HomeComponent {}
