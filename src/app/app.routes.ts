import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { StoreListComponent } from './components/store-list/store-list.component';
import { StoreFormComponent } from './components/store-form/store-form.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'stores', component: StoreListComponent, canActivate: [authGuard] },
  { path: 'stores/new', component: StoreFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'stores/:id/edit', component: StoreFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'products', component: ProductListComponent, canActivate: [authGuard] },
  { path: 'products/new', component: ProductFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'products/:id/edit', component: ProductFormComponent, canActivate: [authGuard, adminGuard] },
  { path: 'stores/:id/products', component: ProductListComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
