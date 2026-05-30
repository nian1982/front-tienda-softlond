import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Store } from '../../models/store.model';

@Component({
  selector: 'app-store-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;min-height:70vh">
      <div style="background:white;padding:40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);width:400px">
        <h2 style="margin-top:0;text-align:center">{{ isEdit ? 'Editar' : 'Nueva' }} Tienda</h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <label><span style="color:red">*</span> Nombre: <input formControlName="name" style="width:100%">
            <small *ngIf="form.controls['name'].invalid && form.controls['name'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <label><span style="color:red">*</span> Descripción: <input formControlName="description" style="width:100%">
            <small *ngIf="form.controls['description'].invalid && form.controls['description'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px">
            <button type="submit" [disabled]="form.invalid">{{ isEdit ? 'Actualizar' : 'Crear' }}</button>
            <a routerLink="/stores">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    input { margin: 8px 0 4px; padding: 6px; box-sizing:border-box; }
    button { padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { opacity: 0.6; }
    a { color: #1976d2; text-decoration: none; }
  `]
})
export class StoreFormComponent implements OnInit {
  isEdit = false;
  form: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string>;
  }>;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      description: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.api.getStore(id).subscribe(data => this.form.patchValue(data));
    }
  }

  save(): void {
    if (this.form.invalid) return;
    const id = this.route.snapshot.paramMap.get('id');
    const obs = id
      ? this.api.updateStore(id, this.form.value as Store)
      : this.api.createStore(this.form.value as Store);
    obs.subscribe(() => this.router.navigate(['/stores']));
  }
}
