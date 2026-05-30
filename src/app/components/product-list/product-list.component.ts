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
    <h2>{{ storeId ? 'Productos de la tienda' : 'Productos' }}</h2>

    <a *ngIf="auth.isAdmin() && !storeId" routerLink="/products/new" class="btn">
      <!-- Icono + Agregar -->
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
           fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
      Nuevo Producto
    </a>

      <table style="margin:16px 24px;width:calc(100% - 48px)">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Presentación</th>
            <th>Precio</th>
            <th>Stock</th>
            <th *ngIf="auth.isAdmin()">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of products">
            <td>{{ p.id }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.presentation }}</td>
            <td>{{ p.price }}</td>
            <td>{{ p.stock }}</td>
            <td class="actions" *ngIf="auth.isAdmin()">
              <a *ngIf="auth.isAdmin()"
                 [routerLink]="['/products', p.id, 'edit']"
                 class="icon-btn edit"
                 title="Editar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </a>
              <button *ngIf="auth.isAdmin()"
                      (click)="delete(p.id!)"
                      class="icon-btn delete"
                      title="Eliminar">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/>
                  <path d="M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p *ngIf="products.length === 0">No hay productos.</p>
      <a routerLink="/stores" *ngIf="storeId" class="btn-back" title="Volver a tiendas">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
             fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/>
          <polyline points="12 19 5 12 12 5"/>
        </svg>
        Volver a tiendas
      </a>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #ccc; padding: 8px; text-align: left; }
    tbody tr:nth-child(even) { background: #f9f9f9; }
    tbody tr:hover { background: #e0e0e0; }

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

    .actions { display: flex; gap: 6px; align-items: center; justify-content: center; min-width: 80px; }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 6px;
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

    .icon-btn.delete {
      background: #ffebee;
      color: #d32f2f;
    }
    .icon-btn.delete:hover { background: #d32f2f; color: white; }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  storeId: string | null = null;

  constructor(
    protected api: ApiService,
    protected auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.storeId = this.route.snapshot.paramMap.get('id');
    const obs = this.storeId
      ? this.api.getProductsByStore(this.storeId)
      : this.api.getProducts();
    obs.subscribe(data => this.products = data);
  }

  delete(id: string): void {
    if (confirm('Eliminar producto?')) {
      this.api.deleteProduct(id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
      });
    }
  }
}