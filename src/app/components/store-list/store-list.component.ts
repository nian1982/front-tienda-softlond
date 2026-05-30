import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-store-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  template: `
    <h2>Tiendas</h2>
    <a *ngIf="auth.isAdmin()" routerLink="/stores/new" class="btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      Nueva Tienda
    </a>

    <table>
      <thead>
        <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Acciones</th></tr>
      </thead>
      <tbody>
        <tr *ngFor="let s of stores">
          <td>{{ s.id }}</td>
          <td>{{ s.name }}</td>
          <td>{{ s.description }}</td>
          <td class="actions">

            <!-- Editar (azul) -->
            <a *ngIf="auth.isAdmin()"
               [routerLink]="['/stores', s.id, 'edit']"
               class="icon-btn edit"
               title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </a>

            <!-- Eliminar (rojo) -->
            <button *ngIf="auth.isAdmin()"
                    (click)="delete(s.id!)"
                    class="icon-btn delete"
                    title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6"/><path d="M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>

            <!-- Ver productos (verde) -->
            <a [routerLink]="['/stores', s.id, 'products']"
               class="icon-btn view"
               title="Ver productos">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </a>

          </td>
        </tr>
      </tbody>
    </table>
    <p *ngIf="stores.length === 0">No hay tiendas registradas.</p>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border-bottom: 1px solid #ccc; padding: 8px; text-align: left; }
    tbody tr:hover { background: #f5f5f5; }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 8px 0;
      font-size: 14px;
    }
    .btn:hover { background: #1565c0; }

    .actions { display: flex; gap: 6px; align-items: center; }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      padding: 0;
      text-decoration: none;
      line-height: 1;
      transition: background 0.2s, color 0.2s;
    }

    .icon-btn.edit  { background: #e3f2fd; color: #1976d2; }
    .icon-btn.edit:hover  { background: #1976d2; color: white; }

    .icon-btn.delete  { background: #ffebee; color: #d32f2f; }
    .icon-btn.delete:hover  { background: #d32f2f; color: white; }

    .icon-btn.view  { background: #e8f5e9; color: #2e7d32; }
    .icon-btn.view:hover  { background: #2e7d32; color: white; }
  `]
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];

  constructor(
    protected api: ApiService,
    protected auth: AuthService
  ) {}

  ngOnInit(): void {
    this.api.getStores().subscribe(data => this.stores = data);
  }

  delete(id: string): void {
    if (confirm('Eliminar tienda?')) {
      this.api.deleteStore(id).subscribe(() => {
        this.stores = this.stores.filter(s => s.id !== id);
      });
    }
  }
}