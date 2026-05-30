import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgFor, NgIf],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;min-height:70vh">
      <div style="background:white;padding:40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);width:400px">
        <h2 style="margin-top:0;text-align:center">{{ isEdit ? 'Editar' : 'Nuevo' }} Producto</h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <label> Nombre: <input formControlName="name" style="width:100%">
            <small *ngIf="form.controls['name'].invalid && form.controls['name'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <label> Presentación: <input formControlName="presentation" style="width:100%">
            <small *ngIf="form.controls['presentation'].invalid && form.controls['presentation'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <label> Descripción: <input formControlName="description" style="width:100%">
            <small *ngIf="form.controls['description'].invalid && form.controls['description'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <label> Precio: <input type="number" step="0.01" formControlName="price" style="width:100%">
            <small *ngIf="form.controls['price'].invalid && form.controls['price'].touched" style="color:red">Campo obligatorio</small> 
          </label>
          <label> Stock: <input type="number" formControlName="stock" style="width:100%">
            <small *ngIf="form.controls['stock'].invalid && form.controls['stock'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <label> Tienda:
            <select formControlName="storeId" style="width:100%">
              <option *ngFor="let s of stores" [value]="s.id">{{ s.name }}</option>
            </select>
            <small *ngIf="form.controls['storeId'].invalid && form.controls['storeId'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px">
            <button type="submit" [disabled]="form.invalid">{{ isEdit ? 'Actualizar' : 'Crear' }}</button>
            <a routerLink="/products">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    input, select { margin: 8px 0 4px; padding: 6px; box-sizing:border-box; }
    button { padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { opacity: 0.6; }
    a { color: #1976d2; text-decoration: none; }
  `]
})
export class ProductFormComponent implements OnInit {
  isEdit = false;
  form: FormGroup<{
    name: FormControl<string>;
    presentation: FormControl<string>;
    description: FormControl<string>;
    price: FormControl<number>;
    stock: FormControl<number>;
    storeId: FormControl<string>;
  }>;
  stores: Store[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      presentation: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl<string>('', { nonNullable: true}),
      price: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
      stock: new FormControl<number>(0, { nonNullable: true, validators: [Validators.required] }),
      storeId: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
    });
  }

  ngOnInit(): void {
    this.api.getStores().subscribe(data => this.stores = data);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getProduct(id).subscribe(data => this.form.patchValue(data));
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const id = this.route.snapshot.paramMap.get('id');
    const obs = id
      ? this.api.updateProduct(id, this.form.value as Product)
      : this.api.createProduct(this.form.value as Product);
    obs.subscribe(() => this.router.navigate(['/products']));
  }
}
