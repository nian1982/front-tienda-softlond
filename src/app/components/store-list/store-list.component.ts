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
    <div style="display:flex;align-items:center;justify-content:space-between;margin:16px 24px 8px">
      <div style="display:flex;align-items:center;gap:16px">
        <h2 style="margin:0">Tiendas</h2>
        <span *ngIf="auth.isAdmin() && showAll" class="badge badge-info">Todas</span>
        <span *ngIf="auth.isAdmin() && !showAll" class="badge badge-success">Activas</span>
      </div>
      <div style="display:flex;gap:12px">
        <button *ngIf="auth.isAdmin()" (click)="toggleView()" class="btn-toggle">
          {{ showAll ? 'Solo activas' : 'Ver todas' }}
        </button>
        <a *ngIf="auth.isAdmin()" routerLink="/stores/new" class="btn" style="margin:0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Nueva Tienda
        </a>
      </div>
    </div>

    <div class="search-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" placeholder="Buscar tienda por nombre..." (input)="filterValue = $any($event.target).value" class="search-input">
    </div>

      <table style="margin:20px 24px;width:calc(100% - 48px)">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Descripción</th><th *ngIf="auth.isAdmin()">Estado</th><th *ngIf="auth.isAdmin()">Acciones</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of filteredStores()" [class.inactive]="!s.active">
            <td>{{ s.id }}</td>
            <td>{{ s.name }}</td>
            <td>{{ s.description }}</td>
            <td *ngIf="auth.isAdmin()">
              <label class="switch" (click)="toggleStatus(s)">
                <input type="checkbox" [checked]="s.active">
                <span class="slider"></span>
              </label>
            </td>
            <td *ngIf="auth.isAdmin()">
              <div class="actions">
                <a [class.hidden]="!s.active"
                   [routerLink]="['/stores', s.id, 'edit']"
                   class="icon-btn edit"
                   title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </a>
                <a [class.hidden]="!s.active"
                   [routerLink]="['/stores', s.id, 'products']"
                   class="icon-btn view"
                   title="Ver productos">
                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="stores.length === 0" style="margin:24px;font-style:italic;color:#666">No hay tiendas registradas.</p>
      <p *ngIf="stores.length > 0 && filteredStores().length === 0" style="margin:24px;font-style:italic;color:#666">No se encontraron tiendas con ese nombre.</p>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #ccc; padding: 8px; text-align: left; }
    tbody tr:nth-child(even) { background: #f9f9f9; }
    tbody tr:hover { background: #e0e0e0; }
    tbody tr.inactive { opacity: 0.6; }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      background: #1976d2;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 8px 0;
      font-size: 15px;
    }
    .btn:hover { background: #1565c0; }

    .btn-toggle {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      background: #607d8b;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 15px;
    }
    .btn-toggle:hover { background: #546e7a; }

    .actions { display: flex; gap: 6px; align-items: center; min-width: 80px; }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 0;
      border: none;
      cursor: pointer;
      padding: 0;
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
    }

    .icon-btn.edit  { background: #e3f2fd; color: #1976d2; }
    .icon-btn.edit:hover  { background: #1976d2; color: white; }

    .icon-btn.view  { background: #fff3e0; color: #e65100; }
    .icon-btn.view:hover  { background: #e65100; color: white; }

    a.hidden { visibility: hidden; pointer-events: none; }


    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }
    .badge-success { background: #e8f5e9; color: #2e7d32; }
    .badge-danger  { background: #ffebee; color: #d32f2f; }
    .badge-info    { background: #e3f2fd; color: #1976d2; }

    .switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      cursor: pointer;
    }
    .switch input { opacity: 0; width: 0; height: 0; }
    .slider {
      position: absolute;
      inset: 0;
      background: #d32f2f;
      border-radius: 24px;
      transition: 0.3s;
    }
    .slider::before {
      content: "";
      position: absolute;
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background: white;
      border-radius: 50%;
      transition: 0.3s;
    }
    .switch input:checked + .slider { background: #2e7d32; }
    .switch input:checked + .slider::before { transform: translateX(20px); }

    .search-container {
      position: relative;
      margin: 16px 24px 0;
      display: flex;
      align-items: center;
      max-width: 320px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      pointer-events: none;
    }
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 38px;
      font-size: 14px;
      border: 1px solid #ccc;
      border-radius: 6px;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
      background: white;
    }
    .search-input:focus {
      border-color: #1976d2;
      box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.15);
    }
  `]
})
export class StoreListComponent implements OnInit {
  stores: Store[] = [];
  showAll = false;
  filterValue = '';

  constructor(
    protected api: ApiService,
    protected auth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.auth.isAdmin()) {
      this.showAll = true;
    }
    this.loadStores();
  }

  private loadStores(): void {
    const obs = this.auth.isAdmin() && this.showAll
      ? this.api.getAllStores()
      : this.api.getStores();
    obs.subscribe(data => this.stores = data);
  }

  toggleView(): void {
    this.showAll = !this.showAll;
    this.loadStores();
  }

  filteredStores(): Store[] {
    if (!this.filterValue) {
      return this.stores;
    }
    const search = this.filterValue.toLowerCase().trim();
    return this.stores.filter(s => s.name.toLowerCase().startsWith(search));
  }

  toggleStatus(s: Store): void {
    if (s.active) {
      if (confirm('¿Desactivar tienda?')) {
        this.api.deleteStore(s.id!).subscribe(() => {
          this.stores = this.stores.map(x => x.id === s.id ? { ...x, active: false } : x);
        });
      }
    } else {
      if (confirm('¿Reactivar tienda?')) {
        this.api.reactivateStore(s.id!).subscribe(() => {
          this.stores = this.stores.map(x => x.id === s.id ? { ...x, active: true } : x);
        });
      }
    }
  }
}
