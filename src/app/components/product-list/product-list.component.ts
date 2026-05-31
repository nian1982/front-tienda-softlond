import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  template: `
    <div style="display:flex;align-items:center;justify-content:space-between;margin:16px 24px 8px">
      <div style="display:flex;align-items:center;gap:16px">
        <h2 style="margin:0">{{ storeId ? 'Productos de la tienda' : 'Productos' }}</h2>
        <span *ngIf="auth.isAdmin() && !storeId && showAll" class="badge badge-info">Todos</span>
        <span *ngIf="auth.isAdmin() && !storeId && !showAll" class="badge badge-success">Activos</span>
      </div>
      <div style="display:flex;gap:12px">
        <button *ngIf="auth.isAdmin() && !storeId" (click)="toggleView()" class="btn-toggle">
          {{ showAll ? 'Solo activos' : 'Ver todos' }}
        </button>
        <a routerLink="/stores" *ngIf="storeId" class="btn-back" title="Volver a tiendas" style="margin:0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver a tiendas
        </a>
        <a *ngIf="auth.isAdmin() && !storeId" routerLink="/products/new" class="btn" style="margin:0">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          Nuevo Producto
        </a>
      </div>
    </div>

    <div class="search-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <input type="text" placeholder="Buscar por nombre" (input)="filterValue = $any($event.target).value" class="search-input">
    </div>

      <table style="margin:20px 24px;width:calc(100% - 48px)">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Presentación</th>
            <th class="text-right">Precio</th>
            <th class="text-right">Stock</th>
            <th *ngIf="auth.isAdmin()">Estado</th>
            <th *ngIf="auth.isAdmin()">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of filteredProducts()" [class.inactive]="!p.active">
            <td>{{ p.id }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.presentation }}</td>
            <td class="text-right">{{ p.price }}</td>
            <td class="text-right">{{ p.stock }}</td>
            <td *ngIf="auth.isAdmin()">
              <label class="switch" (click)="toggleStatus(p)">
                <input type="checkbox" [checked]="p.active">
                <span class="slider"></span>
              </label>
            </td>
            <td *ngIf="auth.isAdmin()">
              <div class="actions">
                <a [class.hidden]="!p.active"
                   (click)="openModal(p)"
                   class="icon-btn view"
                   title="Ver">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                </a>
                <a [class.hidden]="!p.active"
                   [routerLink]="['/products', p.id, 'edit']"
                   class="icon-btn edit"
                   title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="products.length === 0" style="margin:24px;font-style:italic;color:#666">No hay productos.</p>
      <p *ngIf="products.length > 0 && filteredProducts().length === 0" style="margin:24px;font-style:italic;color:#666">No se encontraron productos con ese nombre.</p>

      <div class="modal-overlay" *ngIf="selectedProduct" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <button class="modal-close" (click)="closeModal()">&times;</button>
          <h3>Detalle del Producto</h3>
          <table class="detail-table">
            <tr><td class="label">ID</td><td>{{ selectedProduct.id }}</td></tr>
            <tr><td class="label">Nombre</td><td>{{ selectedProduct.name }}</td></tr>
            <tr><td class="label">Presentación</td><td>{{ selectedProduct.presentation }}</td></tr>
            <tr><td class="label">Descripción</td><td>{{ selectedProduct.description }}</td></tr>
            <tr><td class="label">Precio</td><td>{{ selectedProduct.price }}</td></tr>
            <tr><td class="label">Stock</td><td>{{ selectedProduct.stock }}</td></tr>
            <tr><td class="label">Tienda ID</td><td>{{ selectedProduct.storeId }}</td></tr>
            <tr><td class="label">Estado</td><td>{{ selectedProduct.active ? 'Activo' : 'Inactivo' }}</td></tr>
          </table>
        </div>
      </div>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #ccc; padding: 8px; text-align: left; }
    .text-right { text-align: right; }
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

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      background: #607d8b;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin-top: 8px;
      font-size: 15px;
    }
    .btn-back:hover { background: #546e7a; }

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
      transition: background 0.2s, color 0.2s;
      text-decoration: none;
    }

    .icon-btn.edit {
      background: #e3f2fd;
      color: #1976d2;
    }
    .icon-btn.edit:hover { background: #1976d2; color: white; }

    .icon-btn.view {
      background: #fff3e0;
      color: #e65100;
    }
    .icon-btn.view:hover { background: #e65100; color: white; }

    a.hidden { visibility: hidden; pointer-events: none; }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 32px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      position: relative;
    }
    .modal-content h3 { margin-top: 0; }
    .modal-close {
      position: absolute;
      top: 8px;
      right: 12px;
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
    }
    .modal-close:hover { color: #000; }
    .detail-table { width: 100%; border-collapse: collapse; }
    .detail-table td { padding: 6px 8px; border: none; }
    .detail-table td.label { font-weight: 600; width: 140px; color: #555; }

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
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  storeId: string | null = null;
  showAll = false;
  filterValue = '';
  selectedProduct: Product | null = null;

  constructor(
    protected api: ApiService,
    protected auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('id');
    if (this.auth.isAdmin() && !this.storeId) {
      this.showAll = true;
    }
    this.loadProducts();
  }

  private loadProducts(): void {
    let obs;
    if (this.storeId) {
      obs = this.api.getProductsByStore(this.storeId);
    } else if (this.auth.isAdmin() && this.showAll) {
      obs = this.api.getAllProducts();
    } else {
      obs = this.api.getProducts();
    }
    obs.subscribe(data => this.products = data);
  }

  toggleView(): void {
    this.showAll = !this.showAll;
    this.loadProducts();
  }

  filteredProducts(): Product[] {
    if (!this.filterValue) {
      return this.products;
    }
    const search = this.filterValue.toLowerCase().trim();
    return this.products.filter(p => p.name.toLowerCase().startsWith(search));
  }

  openModal(p: Product): void {
    this.selectedProduct = p;
  }

  closeModal(): void {
    this.selectedProduct = null;
  }

  toggleStatus(p: Product): void {
    if (p.active) {
      if (confirm('¿Desactivar producto?')) {
        this.api.deleteProduct(p.id!).subscribe(() => {
          this.products = this.products.map(x => x.id === p.id ? { ...x, active: false } : x);
        });
      }
    } else {
      if (confirm('¿Reactivar producto?')) {
        this.api.reactivateProduct(p.id!).subscribe(() => {
          this.products = this.products.map(x => x.id === p.id ? { ...x, active: true } : x);
        });
      }
    }
  }
}
