import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;min-height:80vh">
      <div style="background:white;padding:40px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.1);width:360px">
        <h2 style="margin-top:0;text-align:center">Iniciar Sesión</h2>
        <form [formGroup]="form" (ngSubmit)="login()">
          <label>
            <span style="color:red">*</span> Usuario:
            <input formControlName="username" style="width:100%">
            <small *ngIf="form.controls['username'].invalid && form.controls['username'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <label>
            <span style="color:red">*</span> Contraseña:
            <input type="password" formControlName="password" style="width:100%">
            <small *ngIf="form.controls['password'].invalid && form.controls['password'].touched" style="color:red">Campo obligatorio</small>
          </label>
          <button type="submit" [disabled]="loading" style="width:100%;margin-top:12px">{{ loading ? 'Validando...' : 'Ingresar' }}</button>
        </form>
        <p *ngIf="error" style="color:red;text-align:center">Usuario o contraseña inválidos</p>
      </div>
    </div>
  `,
  styles: [`
    input { margin: 8px 0 4px; padding: 6px; box-sizing:border-box; }
    button { padding: 10px 22px; background: #1976d2; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 15px; }
    button:disabled { opacity: 0.6; }
  `]
})
export class LoginComponent {
  form: FormGroup<{
    username: FormControl<string>;
    password: FormControl<string>;
  }>;
  error = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] })
    });
  }

  login(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = false;
    this.auth.login(this.form.value.username!, this.form.value.password!).subscribe(ok => {
      this.loading = false;
      if (ok) {
        this.router.navigate(['/stores']);
      } else {
        this.error = true;
      }
    });
  }
}
